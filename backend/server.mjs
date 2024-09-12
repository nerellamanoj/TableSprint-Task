import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const port = 2030;
const app = express();

app.use(express.json());
app.use(cors());

// Secret key for JWT
const JWT_SECRET = 'kanna7266046';

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'karunakar',
  password: '16771677',
  database: 'sun',
});

// Connect using a callback
connection.connect((err) => {
  if (err) {
    console.log('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Handle POST request for /register
app.post('/register', (req, res) => {
  if (req.body) {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required' });
    }

    // Check if the email already exists
    const checkQuery = 'SELECT * FROM userdetails WHERE email = ?';
    connection.query(checkQuery, [email], (err, results) => {
      if (err) {
        console.log('Error executing check query:', err);
        return res.status(500).send({ message: 'Error checking user existence' });
      }

      if (results.length > 0) {
        // Email already exists
        return res.status(400).send({ message: 'Email already registered' });
      }

      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.log('Error hashing password:', err);
          return res.status(500).send({ message: 'Error registering user' });
        }

        // Define the insert query
        const insertQuery = 'INSERT INTO userdetails (email, password) VALUES (?, ?)';
        
        // Execute the insert query
        connection.query(insertQuery, [email, hashedPassword], (err, results) => {
          if (err) {
            console.log('Error executing insert query:', err);
            return res.status(500).send({ message: 'Error registering user' });
          }
          res.send({ message: 'User registered successfully' });
        });
      });
    });
  } else {
    res.status(400).send({ message: 'Request body is empty' });
  }
});

// Handle POST request for /login
// Handle POST request for /login
app.post('/login', (req, res) => {
  if (req.body) {
    const { email, password } = req.body;
    console.log(req.body)

    // Validate inputs
    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required' });
    }

    // Check if the email exists
    const checkQuery = 'SELECT * FROM userdetails WHERE email = ?';
    connection.query(checkQuery, [email], (err, results) => {
      if (err) {
        console.log('Error executing check query:', err);
        return res.status(500).send({ message: 'Error checking user existence' });
      }

      if (results.length === 0) {
        // Email does not exist
        return res.status(401).send({ message: 'Invalid credentials. Please check your email and password.' });
      }

      const user = results[0];

      // Compare the password with the hashed password in the database
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.log('Error comparing passwords:', err);
          return res.status(500).send({ message: 'Error logging in' });
        }

        if (!isMatch) {
          // Passwords do not match
          return res.status(401).send({ message: 'Invalid credentials. Please check your email and password.' });
        }

        // Generate a JWT token
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.send({ message: 'Login successful', token });
      });
    });
  } else {
    res.status(400).send({ message: 'Request body is empty' });
  }
});






// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'uploads' folder
app.use('/uploads', express.static('uploads'));

// API endpoint to handle image upload and metadata saving
app.post('/upload', upload.single('image'), (req, res) => {
  const { category_name, category_sequence } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(400).send('No image file uploaded.');
  }

  const imageUrl = `/uploads/${image.filename}`;
  const sql = 'INSERT INTO category_images (category_name, category_sequence, image_url) VALUES (?, ?, ?)';

  connection.query(sql, [category_name, category_sequence, imageUrl], (err, result) => {
    if (err) {
      console.error('Error inserting image data:', err);
      return res.status(500).send('Failed to save image data.');
    }
    res.send({ message: 'Image uploaded and data saved successfully!', imageUrl });
  });
});





// API endpoint to fetch categories
app.get('/fetch-categories', (req, res) => {
  const sql = 'SELECT * FROM category_images';
  
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).send('Failed to fetch categories.');
    }
    res.send(results);
  });
});


app.put('/update-category/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  console.log(id)
  const { category_name, category_sequence, status } = req.body;
  const image = req.file;

  // Validate inputs
  if (!category_name || !category_sequence || !status) {
    return res.status(400).send({ message: 'Category name, sequence, and status are required' });
  }

  // Prepare the SQL query to update category data
  let sql = 'UPDATE category_images SET category_name = ?, category_sequence = ?, status = ?';
  const params = [category_name, category_sequence, status];

  if (image) {
    // If there's an image file, update the image URL as well
    const imageUrl = `/uploads/${image.filename}`;
    sql += ', image_url = ?';
    params.push(imageUrl);
  }

  sql += ' WHERE id = ?';
  params.push(id);

  connection.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error updating category data:', err);
      return res.status(500).send({ message: 'Failed to update category data' });
    }
    res.send({ message: 'Category updated successfully!' });
  });
});




app.delete('/delete-category/:id', (req, res) => {
  const categoryId = req.params.id;
  
  // Delete the category from the database
  const query = 'DELETE FROM category_images WHERE id = ?';
  
  connection.query(query, [categoryId], (err, result) => {
    if (err) {
      console.error('Error deleting category:', err);
      return res.status(500).json({ error: 'Failed to delete category' });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Category deleted successfully' });
    } else {
      return res.status(404).json({ error: 'Category not found' });
    }
  });
});



app.get('/fetch-categories', (req, res) => {
  const searchQuery = req.query.q ? `%${req.query.q}%` : '%%'; // Search query param if present
  const query = 'SELECT * FROM category_images WHERE category_name LIKE ?';

  connection.query(query, [searchQuery], (error, results) => {
    if (error) {
      console.error('Error fetching categories:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});












