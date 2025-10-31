import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/items');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newItemName }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      const result = await response.json();
      setData([...data, result]);
      setNewItemName('');
      setEditingRowId(null);
      setError(null);
    } catch (err) {
      setError('Error adding item: ' + err.message);
      console.error('Error adding item:', err);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setData(data.filter(item => item.id !== itemId));
      setError(null);
    } catch (err) {
      setError('Error deleting item: ' + err.message);
      console.error('Error deleting item:', err);
    }
  };

  const handleAddClick = () => {
    setEditingRowId('new');
    setNewItemName('');
  };

  const handleSaveNew = async () => {
    if (!newItemName.trim()) return;

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newItemName }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      const result = await response.json();
      setData([result, ...data]);
      setNewItemName('');
      setEditingRowId(null);
      setError(null);
    } catch (err) {
      setError('Error adding item: ' + err.message);
      console.error('Error adding item:', err);
    }
  };

  const handleCancelAdd = () => {
    setEditingRowId(null);
    setNewItemName('');
  };

  // Prepare rows for DataGrid
  const rows = editingRowId === 'new' 
    ? [{ id: 'new', name: newItemName, isNew: true }, ...data]
    : data;

  // Define columns for DataGrid
  const columns = [
    {
      field: 'name',
      headerName: 'Item Name',
      flex: 1,
      editable: false,
      renderCell: (params) => {
        if (params.row.isNew) {
          return (
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                // Prevent DataGrid from handling these keys
                if (e.key === ' ' || e.key === 'Escape' || e.key === 'Enter' || e.key === 'Tab') {
                  e.stopPropagation();
                }
                // Handle Enter to save
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSaveNew();
                }
                // Handle Escape to cancel
                if (e.key === 'Escape') {
                  e.preventDefault();
                  handleCancelAdd();
                }
              }}
              placeholder="Enter item name"
              className="grid-input"
              autoFocus
            />
          );
        }
        return params.value;
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderHeader: () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Tooltip title="Add Item">
            <IconButton
              onClick={handleAddClick}
              size="small"
              disabled={editingRowId === 'new'}
              sx={{ 
                fontSize: '1.5rem',
                borderRadius: '4px',
                padding: '4px',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.2)',
                },
                '&:disabled': { 
                  opacity: 0.5 
                }
              }}
            >
              🎄
            </IconButton>
          </Tooltip>
        </div>
      ),
      renderCell: (params) => {
        if (params.row.isNew) {
          return (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Tooltip title="Save">
                <IconButton
                  onClick={handleSaveNew}
                  size="small"
                  sx={{ 
                    color: '#0B5345',
                    borderRadius: '4px'
                  }}
                >
                  <CheckIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancel">
                <IconButton
                  onClick={handleCancelAdd}
                  size="small"
                  sx={{ 
                    color: '#C0C0C0',
                    borderRadius: '4px'
                  }}
                >
                  ✕
                </IconButton>
              </Tooltip>
            </div>
          );
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => handleDelete(params.row.id)}
                size="small"
                sx={{ 
                  color: '#C41E3A',
                  borderRadius: '4px',
                  '&:hover': { 
                    color: '#8B0000',
                    backgroundColor: 'rgba(196, 30, 58, 0.1)'
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <img src="/images/header.png" alt="Christmas Holiday Header" className="header-image" />
      </header>

      <main>
        <section className="items-section">
          <h2>Holiday Gift List</h2>
          {error && <p className="error">{error}</p>}
          <div style={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              autoHeight
              disableRowSelectionOnClick
              hideFooter
              sx={{
                border: '3px solid #FFD700',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#D94452',
                  color: '#FFD700',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderBottom: '3px solid #FFD700',
                  minHeight: '56px !important',
                  maxHeight: '56px !important',
                  lineHeight: '56px !important',
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#D94452',
                  '&:focus': {
                    outline: 'none',
                  },
                  '&:focus-within': {
                    outline: 'none',
                  },
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold',
                  color: '#FFD700',
                  fontFamily: 'Georgia, Garamond, "Times New Roman", serif',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                },
                '& .MuiDataGrid-columnSeparator': {
                  color: '#FFD700',
                  opacity: 0.5,
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #C0C0C0',
                  fontSize: '1rem',
                  color: '#1B3E37',
                  padding: '12px 16px',
                },
                '& .MuiDataGrid-row': {
                  backgroundColor: '#FFFFFF',
                  '&:nth-of-type(even)': {
                    backgroundColor: '#F8F8F0',
                  },
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#FFE6E6 !important',
                  transition: 'background-color 0.2s ease',
                },
                '& .MuiDataGrid-row.Mui-selected': {
                  backgroundColor: 'transparent',
                },
                '& .MuiDataGrid-row.Mui-selected:hover': {
                  backgroundColor: '#FFE6E6 !important',
                },
                '& .MuiDataGrid-iconButtonContainer': {
                  visibility: 'visible',
                  width: 'auto',
                },
                '& .MuiDataGrid-sortIcon': {
                  color: '#FFD700',
                },
              }}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;