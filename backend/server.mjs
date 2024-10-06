import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 2030;
const app = express();

app.use(express.json());
app.use(cors());

const JWT_SECRET = "kanna7266046";

// Create MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "kumar",
  password: "Manoj.@1997",
  database: "sys",
});

connection.connect((err) => {
  if (err) {
    console.log("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Category CRUD Operations
app.post("/upload", upload.single("image"), (req, res) => {
  const { category_name, category_sequence } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(400).send("No image file uploaded.");
  }

  const imageUrl = `/uploads/${image.filename}`;
  const sql =
    "INSERT INTO category_images (category_name, category_sequence, image_url) VALUES (?, ?, ?)";

  connection.query(
    sql,
    [category_name, category_sequence, imageUrl],
    (err, result) => {
      if (err) {
        console.error("Error inserting image data:", err);
        return res.status(500).send("Failed to save image data.");
      }
      res.send({
        message: "Image uploaded and data saved successfully!",
        imageUrl,
      });
    }
  );
});

app.get("/fetch-categories", (req, res) => {
  const sql = "SELECT * FROM category_images";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching categories:", err);
      return res.status(500).send("Failed to fetch categories.");
    }
    res.send(results);
  });
});

// Subcategory CRUD Operations
app.post("/add-subcategory", (req, res) => {
  const { subcategory_name, category_id, subcategory_sequence } = req.body;

  if (!subcategory_name || !category_id || !subcategory_sequence) {
    return res.status(400).send("All subcategory fields are required.");
  }

  const sql =
    "INSERT INTO subcategories (subcategory_name, category_id, subcategory_sequence) VALUES (?, ?, ?)";

  connection.query(
    sql,
    [subcategory_name, category_id, subcategory_sequence],
    (err, result) => {
      if (err) {
        console.error("Error inserting subcategory data:", err);
        return res.status(500).send("Failed to add subcategory.");
      }
      res.send({ message: "Subcategory added successfully!" });
    }
  );
});

app.get("/fetch-subcategories", (req, res) => {
  const { category_id } = req.query;

  if (!category_id) {
    return res.status(400).send("Category ID is required.");
  }

  const sql = "SELECT * FROM subcategories WHERE category_id = ?";
  connection.query(sql, [category_id], (err, results) => {
    if (err) {
      console.error("Error fetching subcategories:", err);
      return res.status(500).send("Failed to fetch subcategories.");
    }
    res.send(results);
  });
});

app.put("/update-subcategory/:id", (req, res) => {
  const { id } = req.params;
  const { subcategory_name, subcategory_sequence, status } = req.body;

  if (!subcategory_name || !subcategory_sequence || !status) {
    return res.status(400).send("All fields are required.");
  }

  const sql =
    "UPDATE subcategories SET subcategory_name = ?, subcategory_sequence = ?, status = ? WHERE id = ?";
  connection.query(
    sql,
    [subcategory_name, subcategory_sequence, status, id],
    (err, result) => {
      if (err) {
        console.error("Error updating subcategory:", err);
        return res.status(500).send("Failed to update subcategory.");
      }
      res.send({ message: "Subcategory updated successfully!" });
    }
  );
});

app.delete("/delete-subcategory/:id", (req, res) => {
  const subcategoryId = req.params.id;

  const sql = "DELETE FROM subcategories WHERE id = ?";
  connection.query(sql, [subcategoryId], (err, result) => {
    if (err) {
      console.error("Error deleting subcategory:", err);
      return res.status(500).send("Failed to delete subcategory.");
    }
    res.send({ message: "Subcategory deleted successfully!" });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
