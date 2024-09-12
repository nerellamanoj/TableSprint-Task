import React, { useState } from 'react';
import { Modal, TextField, Button, IconButton } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import axios from 'axios';

const modalStyle = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-lg p-6 w-96';
const ImageUploadModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [numberValue, setNumberValue] = useState<number | ''>('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Image preview URL

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setImage(null);
    setImagePreview(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if there is an image selected
    if (!image) {
      alert('Please select an image');
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('category_name', textValue);
    formData.append('category_sequence', String(numberValue));
    formData.append('image', image);

    try {
      // Send a POST request to the backend using Axios
      const response = await axios.post('http://localhost:2030/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle the response
      if (response.status === 200) {
        alert('Image uploaded successfully!');
        console.log(response.data);
      } else {
        alert('Failed to upload image');
        console.error(response.data);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred while uploading the image');
    }

    handleClose();
  };

  return (
    <div className="flex justify-center">
      <Button variant="contained" color="primary" onClick={handleOpen} className="bg-blue-600 hover:bg-blue-700 text-white">
        Open Modal
      </Button>

      {/* Modal */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <div className={modalStyle}>
          <h2 id="modal-title" className="text-center text-xl font-bold mb-4">
            Upload Image & Enter Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Text Input */}
            <TextField label="Category Name" fullWidth variant="outlined" value={textValue} onChange={(e) => setTextValue(e.target.value)} required className="border-gray-300 rounded-lg" />

            {/* Number Input */}
            <TextField label="Category Sequence" type="number" fullWidth variant="outlined" value={numberValue} onChange={(e) => setNumberValue(parseFloat(e.target.value) || '')} required className="border-gray-300 rounded-lg" />

            {/* Image Upload */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {imagePreview ? (
                <div className="relative">
                  {/* Image Preview */}
                  <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
                </div>
              ) : (
                <IconButton color="primary" aria-label="upload picture" component="label">
                  <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
                  <ImageIcon className="text-blue-600" sx={{ fontSize: 40 }} />
                </IconButton>
              )}

              <Button variant="contained" component="label" className="bg-blue-600 hover:bg-blue-700 text-white">
                Upload New Image
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </Button>
            </div>

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary" fullWidth className="bg-green-600 hover:bg-green-700 text-white">
              Submit
            </Button>
          </form>

          <Button variant="outlined" color="secondary" fullWidth className="mt-4" onClick={handleClose}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ImageUploadModal;
