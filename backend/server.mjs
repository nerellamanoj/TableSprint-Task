import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/sidebar';
import Navbar2 from '../navbar/navbar';
import { BiCategoryAlt } from 'react-icons/bi';
import { CiSearch } from 'react-icons/ci';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Modal, TextField, Button, Switch, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useTable, Column, HeaderGroup, Row, Cell } from 'react-table';

interface Category {
  id: number;
  category_name: string;
  image_url: string;
  status: string;
  category_sequence: number;
  created_at: string;
}

const Navbar: React.FC = () => {
  // Modal States
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categorySequence, setCategorySequence] = useState<number | ''>('');
  const [status, setStatus] = useState<string>('Inactive');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Table Data
  const [data, setData] = useState<Category[]>([]);

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:2030/fetch-categories');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Table Columns
  const columns: Column<Category>[] = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Category Name',
        accessor: 'category_name',
      },
      {
        Header: 'Image',
        accessor: 'image_url',
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <img src={`http://localhost:2030${value}`} alt="Category" width={50} height={50} />
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
        accessor: 'category_sequence',
      },
      {
        Header: 'Action',
        Cell: ({ row }: { row: Row<Category> }) => (
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
  const tableInstance = useTable<Category>({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  // Event Handlers for Edit/Delete
  const handleEdit = (category: Category) => {
    setIsEditing(true);
    setEditingCategory(category);
    setCategoryName(category.category_name);
    setCategorySequence(category.category_sequence);
    setStatus(category.status);
    setImagePreview(`http://localhost:2030${category.image_url}`);
    setOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setCategoryToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await axios.delete(`http://localhost:2030/delete-category/${categoryToDelete.id}`);
        // Refetch categories after deletion
        const response = await axios.get('http://localhost:2030/fetch-categories');
        setData(response.data);
        closeDeleteModal();
        alert('Category deleted successfully');
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
    }
  };

  // Handlers for Modal
  const handleOpen = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setCategoryName('');
    setCategorySequence('');
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
    formData.append('category_name', categoryName);
    formData.append('category_sequence', String(categorySequence));
    formData.append('status', status);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = isEditing
        ? await axios.put(`http://localhost:2030/update-category/${editingCategory?.id}`, formData)
        : await axios.post('http://localhost:2030/upload', formData);

      if (response.status === 200 || response.status === 201) {
        alert(isEditing ? 'Category updated successfully!' : 'Category added successfully!');
        const dataResponse = await axios.get('http://localhost:2030/fetch-categories');
        setData(dataResponse.data);
      } else {
        alert('Failed to submit category');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred');
    }

    handleClose();
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden pr-1">
      <Navbar2 />
      <div className="flex gap-x-7 pl-2">
        <div> <Sidebar/> </div>
        
        <div className="h-screen w-full flex flex-col gap-4">
          <div className="flex items-center p-2 justify-between gap-x-8">
            <div className="flex items-center gap-x-3 w-full">
              <BiCategoryAlt className="text-4xl" />
              <b className="text-2xl">Category</b>
              <div className="max-w-90 border-3 flex items-center rounded-lg p-1">
                <CiSearch className="text-2xl" />
                <input className="border-none outline-none w-full" type="search" placeholder="Search Category" />
              </div>
            </div>
            <Button variant="contained" color="primary" onClick={handleOpen} className="bg-purple-950 whitespace-nowrap text-white border-2 p-2 rounded-lg">
              Add Category
            </Button>
          </div>

          {/* Modal */}
          <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-lg p-6 w-96">
              <h2 id="modal-title" className="text-center text-xl font-bold mb-4">
                {isEditing ? 'Edit Category' : 'Add Category'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <TextField label="Category Name" fullWidth variant="outlined" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
                <TextField label="Category Sequence" type="number" fullWidth variant="outlined" value={categorySequence} onChange={(e) => setCategorySequence(parseFloat(e.target.value) || '')} required />
                <div className="flex items-center mb-2">
                  <span className="mr-2">Status:</span>
                  <Switch checked={status === 'Active'} onChange={() => setStatus(status === 'Active' ? 'Inactive' : 'Active')} />
                  <span className="ml-2">{status}</span>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" width={100} height={100} className="mb-2" />
                  ) : (
                    <p>No image uploaded</p>
                  )}
                  <input type="file" onChange={handleImageUpload} accept="image/*" />
                </div>
                <Button type="submit" variant="contained" color="primary" className="w-full">
                  {isEditing ? 'Update' : 'Add'}
                </Button>
              </form>
            </div>
          </Modal>

          {/* Data Table */}
          <div className="overflow-auto rounded-lg">
            <table {...getTableProps()} className="min-w-full bg-white">
              <thead>
                {headerGroups.map((headerGroup: HeaderGroup<Category>) => (
                  <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200 text-gray-600">
                    {headerGroup.headers.map((column: Column<Category>) => (
                      <th {...column.getHeaderProps()} className="py-2 px-4 text-left">{column.render('Header')}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row: Row<Category>) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="border-b hover:bg-gray-100">
                      {row.cells.map((cell: Cell<Category>) => (
                        <td {...cell.getCellProps()} className="py-2 px-4">{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Delete Modal */}
          <Dialog open={isDeleteModalOpen} onClose={closeDeleteModal}>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the category "{categoryToDelete?.category_name}"?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDeleteModal} color="primary">Cancel</Button>
              <Button onClick={confirmDelete} color="secondary">Delete</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
