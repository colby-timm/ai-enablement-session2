import React, { act } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock MUI DataGrid to simplify testing
jest.mock('@mui/x-data-grid', () => ({
  DataGrid: ({ rows, columns, loading }) => {
    if (loading) {
      return <div>Loading data...</div>;
    }
    return (
      <div data-testid="data-grid">
        <div data-testid="grid-header">
          {columns.map((col) => (
            <div key={col.field} data-testid={`header-${col.field}`}>
              {col.renderHeader ? col.renderHeader() : col.headerName}
            </div>
          ))}
        </div>
        <div data-testid="grid-rows">
          {rows.length === 0 ? (
            <div>No rows</div>
          ) : (
            rows.map((row) => (
              <div key={row.id} data-testid={`row-${row.id}`}>
                {columns.map((col) => (
                  <div key={col.field} data-testid={`cell-${row.id}-${col.field}`}>
                    {col.renderCell ? col.renderCell({ row, value: row[col.field] }) : row[col.field]}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    );
  },
}));

// Mock MUI components
jest.mock('@mui/material', () => ({
  IconButton: ({ children, onClick, disabled, ...props }) => (
    <button onClick={onClick} disabled={disabled} data-testid={props['data-testid']}>
      {children}
    </button>
  ),
  Tooltip: ({ children, title }) => (
    <div title={title}>{children}</div>
  ),
}));

jest.mock('@mui/icons-material/Check', () => ({
  __esModule: true,
  default: () => <span>✓</span>,
}));

jest.mock('@mui/icons-material/Delete', () => ({
  __esModule: true,
  default: () => <span>🗑</span>,
}));

// Mock server to intercept API requests
const server = setupServer(
  // GET /api/items handler
  rest.get('/api/items', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'Test Item 1', created_at: '2023-01-01T00:00:00.000Z' },
        { id: 2, name: 'Test Item 2', created_at: '2023-01-02T00:00:00.000Z' },
      ])
    );
  }),
  
  // POST /api/items handler
  rest.post('/api/items', (req, res, ctx) => {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Item name is required' })
      );
    }
    
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        name,
        created_at: new Date().toISOString(),
      })
    );
  }),

  // DELETE /api/items/:id handler
  rest.delete('/api/items/:id', (req, res, ctx) => {
    return res(ctx.status(204));
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the Christmas-themed header', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Check that the header image is rendered
    const headerImage = screen.getByAltText('Christmas Holiday Header');
    expect(headerImage).toBeInTheDocument();
    expect(headerImage).toHaveAttribute('src', '/images/header.png');
  });

  test('renders DataGrid with correct structure', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    // Check that DataGrid is rendered
    const grid = screen.getByTestId('data-grid');
    expect(grid).toBeInTheDocument();

    // Check that columns are present
    expect(screen.getByTestId('header-name')).toBeInTheDocument();
    expect(screen.getByTestId('header-actions')).toBeInTheDocument();
  });

  test('loads and displays items in DataGrid', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Initially shows loading state
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });

    // Check that rows are rendered
    expect(screen.getByTestId('row-1')).toBeInTheDocument();
    expect(screen.getByTestId('row-2')).toBeInTheDocument();
  });

  test('clicking Add button creates editable row', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });
    
    // Find and click the Add Item button (🎄)
    const addButton = screen.getByText('🎄');
    await act(async () => {
      await user.click(addButton);
    });
    
    // Check that editable row appears with input field
    await waitFor(() => {
      const input = screen.getByPlaceholderText('Enter item name');
      expect(input).toBeInTheDocument();
    });

    // Check that new row is at the top (row-new)
    expect(screen.getByTestId('row-new')).toBeInTheDocument();
  });

  test('entering item name and clicking Save adds item', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });
    
    // Click Add button
    const addButton = screen.getByText('🎄');
    await act(async () => {
      await user.click(addButton);
    });
    
    // Enter item name
    const input = await screen.findByPlaceholderText('Enter item name');
    await act(async () => {
      await user.type(input, 'New Christmas Gift');
    });
    
    // Click Save button (checkmark icon)
    const saveButton = screen.getByText('✓');
    await act(async () => {
      await user.click(saveButton);
    });
    
    // Check that the new item appears
    await waitFor(() => {
      expect(screen.getByText('New Christmas Gift')).toBeInTheDocument();
    });

    // Check that editable row is removed
    expect(screen.queryByPlaceholderText('Enter item name')).not.toBeInTheDocument();
  });

  test('pressing Enter key saves the item', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });
    
    // Click Add button
    const addButton = screen.getByText('🎄');
    await act(async () => {
      await user.click(addButton);
    });
    
    // Enter item name and press Enter
    const input = await screen.findByPlaceholderText('Enter item name');
    await act(async () => {
      await user.type(input, 'Holiday Item{Enter}');
    });
    
    // Check that the new item appears
    await waitFor(() => {
      expect(screen.getByText('Holiday Item')).toBeInTheDocument();
    });
  });

  test('clicking Cancel button removes editable row', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });
    
    // Click Add button
    const addButton = screen.getByText('🎄');
    await act(async () => {
      await user.click(addButton);
    });
    
    // Verify input field appears
    const input = await screen.findByPlaceholderText('Enter item name');
    expect(input).toBeInTheDocument();
    
    // Click Cancel button (✕)
    const cancelButton = screen.getByText('✕');
    await act(async () => {
      await user.click(cancelButton);
    });
    
    // Check that editable row is removed
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Enter item name')).not.toBeInTheDocument();
    });
  });

  test('clicking Delete icon removes item', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });
    
    // Find all delete buttons (🗑 icon)
    const deleteButtons = screen.getAllByText('🗑');
    
    // Click the first delete button
    await act(async () => {
      await user.click(deleteButtons[0]);
    });
    
    // Check that the item is removed
    await waitFor(() => {
      expect(screen.queryByText('Test Item 1')).not.toBeInTheDocument();
    });

    // Other item should still be there
    expect(screen.getByText('Test Item 2')).toBeInTheDocument();
  });

  test('handles API error on fetch', async () => {
    // Override the default handler to simulate an error
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data/)).toBeInTheDocument();
    });
  });

  test('handles API error on add item', async () => {
    const user = userEvent.setup();
    
    // Override POST handler to return error
    server.use(
      rest.post('/api/items', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });
    
    // Click Add button
    const addButton = screen.getByText('🎄');
    await act(async () => {
      await user.click(addButton);
    });
    
    // Enter item name
    const input = await screen.findByPlaceholderText('Enter item name');
    await act(async () => {
      await user.type(input, 'Test Item');
    });
    
    // Click Save button
    const saveButton = screen.getByText('✓');
    await act(async () => {
      await user.click(saveButton);
    });
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Error adding item/)).toBeInTheDocument();
    });
  });

  test('handles API error on delete item', async () => {
    const user = userEvent.setup();
    
    // Override DELETE handler to return error
    server.use(
      rest.delete('/api/items/:id', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });
    
    // Click delete button
    const deleteButtons = screen.getAllByText('🗑');
    await act(async () => {
      await user.click(deleteButtons[0]);
    });
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Error deleting item/)).toBeInTheDocument();
    });
  });

  test('shows no rows message when empty', async () => {
    // Override the default handler to return empty array
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for empty state
    await waitFor(() => {
      expect(screen.getByText('No rows')).toBeInTheDocument();
    });
  });

  test('Add button is disabled when editing', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });
    
    // Click Add button
    const addButton = screen.getByText('🎄');
    await act(async () => {
      await user.click(addButton);
    });
    
    // Verify Add button is disabled
    await waitFor(() => {
      expect(addButton.closest('button')).toBeDisabled();
    });
  });
});