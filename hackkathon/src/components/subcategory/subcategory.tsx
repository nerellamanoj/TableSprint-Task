import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
import { CiSearch } from 'react-icons/ci';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Modal, TextField, Button, Switch, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useTable, Column, HeaderGroup, Row } from 'react-table';
import './Subcategory.module.css';

const API_BASE_URL = 'http://localhost:2030';

interface Subcategory {
  id: number;
  category_id: number;
  subcategory_name: string;
  image_url: string;
  status: string;
  subcategory_sequence: number;
  created_at: string;
}

const Subcategory: React.FC = () => {
  // Modal States
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [subcategoryName, setSubcategoryName] = useState('');
  const [subcategorySequence, setSubcategorySequence] = useState<number | ''>('');
  const [status, setStatus] = useState<string>('Inactive');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Table Data
  const [data, setData] = useState<Subcategory[]>([]);

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<Subcategory | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/fetch-subcategories`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Table Columns
  const columns: Column<Subcategory>[] = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Subcategory Name', accessor: 'subcategory_name' },
      {
        Header: 'Image',
        accessor: 'image_url',
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <img src={`${API_BASE_URL}${value}`} alt="Subcategory" width={50} height={50} />
        ),
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <span className={value === 'Active' ? 'text-green-500' : 'text-red-500'}>{value}</span>
        ),
      },
      { Header: 'Sequence', accessor: 'subcategory_sequence' },
      {
        Header: 'Action',
        Cell: ({ row }: { row: Row<Subcategory> }) => (
          <div>
            <Button onClick={() => handleEdit(row.original)} className="text-2xl px-2 py-1 rounded">
              <FaEdit />
            </Button>
            <Button onClick={() => openDeleteModal(row.original)} className="text-2xl px-2 py-1 rounded">
              <RiDeleteBin6Line />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  // Initialize Table
  const tableInstance = useTable<Subcategory>({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  // Event Handlers for Edit/Delete
  const handleEdit = (subcategory: Subcategory) => {
    setIsEditing(true);
    setEditingSubcategory(subcategory);
    setSubcategoryName(subcategory.subcategory_name);
    setSubcategorySequence(subcategory.subcategory_sequence);
    setStatus(subcategory.status);
    setImagePreview(`${API_BASE_URL}${subcategory.image_url}`);
    setOpen(true);
  };

  const openDeleteModal = (subcategory: Subcategory) => {
    setSubcategoryToDelete(subcategory);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSubcategoryToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (subcategoryToDelete) {
      try {
        await axios.delete(`${API_BASE_URL}/delete-subcategory/${subcategoryToDelete.id}`);
        await refreshData(); // Refetch subcategories after deletion
        closeDeleteModal();
        alert('Subcategory deleted successfully');
      } catch (error) {
        console.error('Error deleting subcategory:', error);
        alert('Failed to delete subcategory');
      }
    }
  };

  // Handlers for Modal
  const handleOpen = () => {
    setIsEditing(false);
    setEditingSubcategory(null);
    setSubcategoryName('');
    setSubcategorySequence('');
    setStatus('Inactive');
    setImagePreview(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImage(null);
    setImagePreview(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('category_id', '1'); // Set category_id as needed
    formData.append('subcategory_name', subcategoryName);
    formData.append('subcategory_sequence', subcategorySequence.toString());
    formData.append('status', status);
    if (image) {
      formData.append('image', image);
    }

    try {
      if (isEditing && editingSubcategory) {
        await axios.put(`${API_BASE_URL}/update-subcategory/${editingSubcategory.id}`, formData);
        alert('Subcategory updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/upload`, formData);
        alert('Subcategory added successfully');
      }
      handleClose();
      await refreshData(); // Refetch subcategories after submission
    } catch (error) {
      console.error('Error saving subcategory:', error);
      alert('Failed to save subcategory');
    }
  };

  const refreshData = async () => {
    const response = await axios.get(`${API_BASE_URL}/fetch-subcategories`);
    setData(response.data);
  };

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <h1 className="text-xl font-bold">Subcategories</h1>
          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <CiSearch className="text-xl mr-2" />
              <input type="text" placeholder="Search..." className="border p-2 rounded" />
            </div>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Add Subcategory
            </Button>
          </div>
          <table {...getTableProps()} className="min-w-full border-collapse border border-gray-200">
            <thead>
              {headerGroups.map((headerGroup: HeaderGroup<Subcategory>) => (
                <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-100">
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} className="border border-gray-300 px-4 py-2">
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="border border-gray-200">
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="border border-gray-300 px-4 py-2">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Add/Edit Modal */}
          <Modal open={open} onClose={handleClose}>
            <div className="p-4 bg-white rounded shadow-md">
              <h2 className="text-lg font-bold">{isEditing ? 'Edit' : 'Add'} Subcategory</h2>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Subcategory Name"
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Subcategory Sequence"
                  type="number"
                  value={subcategorySequence}
                  onChange={(e) => setSubcategorySequence(Number(e.target.value))}
                  fullWidth
                  required
                />
                <div className="flex items-center">
                  <span>Status: </span>
                  <Switch
                    checked={status === 'Active'}
                    onChange={() => setStatus((prev) => (prev === 'Active' ? 'Inactive' : 'Active'))}
                  />
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {imagePreview && <img src={imagePreview} alt="Preview" width={100} height={100} />}
                <Button type="submit" variant="contained" color="primary" className="mt-2">
                  {isEditing ? 'Update' : 'Add'}
                </Button>
              </form>
            </div>
          </Modal>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteModalOpen} onClose={closeDeleteModal}>
            <DialogTitle>Delete Subcategory</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this subcategory?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDeleteModal} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmDelete} color="secondary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Subcategory;
