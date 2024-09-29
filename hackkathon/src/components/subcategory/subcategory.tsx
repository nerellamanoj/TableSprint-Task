import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
import { BiCategoryAlt } from 'react-icons/bi';
import { CiSearch } from 'react-icons/ci';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Modal, TextField, Button, Switch, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useTable, Column, HeaderGroup, Row } from 'react-table';
import "./Subcategory.module.css"

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
        const response = await axios.get('http://localhost:2030/fetch-subcategories');
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
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Subcategory Name',
        accessor: 'subcategory_name',
      },
      {
        Header: 'Image',
        accessor: 'image_url',
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <img src={`http://localhost:2030${value}`} alt="Subcategory" width={50} height={50} />
        ),
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <span className={value === 'Active' ? 'text-green-500' : 'text-red-500'}>{value}</span>
        ),
      },
      {
        Header: 'Sequence',
        accessor: 'subcategory_sequence',
      },
      {
        Header: 'Action',
        Cell: ({ row }: { row: Row<Subcategory> }) => (
          <div>
            <button onClick={() => handleEdit(row.original)} className="text-2xl px-2 py-1 rounded">
              <FaEdit />
            </button>
            <button onClick={() => openDeleteModal(row.original)} className="text-2xl px-2 py-1 rounded">
              <RiDeleteBin6Line />
            </button>
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
    setImagePreview(`http://localhost:2030${subcategory.image_url}`);
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
        await axios.delete(`http://localhost:2030/delete-subcategory/${subcategoryToDelete.id}`);
        // Refetch subcategories after deletion
        const response = await axios.get('http://localhost:2030/fetch-subcategories');
        setData(response.data);
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
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
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
        await axios.put(`http://localhost:2030/update-subcategory/${editingSubcategory.id}`, formData);
        alert('Subcategory updated successfully');
      } else {
        await axios.post('http://localhost:2030/upload', formData);
        alert('Subcategory added successfully');
      }
      handleClose();
      // Refetch subcategories after submission
      const response = await axios.get('http://localhost:2030/fetch-subcategories');
      setData(response.data);
    } catch (error) {
      console.error('Error saving subcategory:', error);
      alert('Failed to save subcategory');
    }
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
                  {headerGroup.headers.map((column: any) => (
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
              <h2 className="text-lg font-semibold">{isEditing ? 'Edit Subcategory' : 'Add Subcategory'}</h2>
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
                  value={subcategorySequence}
                  onChange={(e) => setSubcategorySequence(Number(e.target.value))}
                  fullWidth
                  type="number"
                  required
                />
                <div>
                  <label>
                    Status:
                    <Switch
                      checked={status === 'Active'}
                      onChange={(e) => setStatus(e.target.checked ? 'Active' : 'Inactive')}
                    />
                  </label>
                </div>
                <div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  {imagePreview && <img src={imagePreview} alt="Preview" width={100} />}
                </div>
                <Button type="submit" variant="contained" color="primary" className="mt-2">
                  {isEditing ? 'Update' : 'Add'}
                </Button>
              </form>
            </div>
          </Modal>

          {/* Delete Confirmation Modal */}
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
