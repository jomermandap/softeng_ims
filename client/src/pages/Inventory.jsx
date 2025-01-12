/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  NotificationsActive,
  Download as DownloadIcon
} from '@mui/icons-material';
import ProductDialog from '../components/ProductDialog';

const Inventory = () => {
  const theme = useTheme();
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5017/api/product/');
      const result = await response.json();
      
      if (result.success) {
        const products = result.data.map(product => ({
          id: product._id,
          name: product.name,
          sku: product.sku,
          stock: product.stock,
          lowStockThreshold: product.lowStockThreshold,
          price: product.price,
          category: product.category
        }));
        setInventory(products);
        setFilteredInventory(products);
      } else {
        console.error('Error fetching inventory:', result.message);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || item.category === category;
      return matchesSearch && matchesCategory;
    });
    setFilteredInventory(filtered);
  }, [searchTerm, category, inventory]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5017/api/product/delete/${product.sku}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          const updatedInventory = inventory.filter(item => item.sku !== product.sku);
          setInventory(updatedInventory);
        } else {
          console.error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleSaveProduct = async (formData) => {
    if (selectedProduct) {
      try {
        const response = await fetch(`http://localhost:5017/api/product/update/${selectedProduct.sku}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const result = await response.json();
          const updatedProduct = result.product;
          
          const updatedInventory = inventory.map(item => 
            item.sku === selectedProduct.sku ? {
              id: updatedProduct._id,
              name: updatedProduct.name,
              sku: updatedProduct.sku,
              stock: updatedProduct.stock,
              lowStockThreshold: updatedProduct.lowStockThreshold,
              price: updatedProduct.price,
              category: updatedProduct.category
            } : item
          );
          setInventory(updatedInventory);
        }
      } catch (error) {
        console.error('Error updating product:', error);
      }
    } else {
      try {
        const response = await fetch('http://localhost:5017/api/product/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const result = await response.json();
          const newProduct = {
            id: result.product._id,
            ...formData
          };
          setInventory([...inventory, newProduct]);
        }
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
    setOpenDialog(false);
  };

  const downloadProductList = () => {
    // Convert inventory data to CSV format
    const headers = ['Product Name', 'SKU', 'Category', 'Stock Level', 'Price'];
    const csvData = [
      headers,
      ...filteredInventory.map(product => [
        product.name,
        product.sku,
        product.category,
        product.stock,
        product.price
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_inventory.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
  };

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedInventory = filteredInventory.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <Box sx={{ p: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'white' }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Inventory Management
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={downloadProductList}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1,
              }}
            >
              Export List
            </Button>
            
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddProduct}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                }}
              >
                Add Product
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ 
              width: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'background.paper',
                '&:hover': {
                  '& > fieldset': {
                    borderColor: theme.palette.primary.main,
                  }
                }
              }
            }}
          />
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
              sx={{ 
                borderRadius: 2, 
                bgcolor: 'background.paper',
                '&:hover': {
                  '& > fieldset': {
                    borderColor: theme.palette.primary.main,
                  }
                }
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Accessories">Accessories</MenuItem>
            </Select>
          </FormControl>
          <IconButton 
            onClick={fetchInventory} 
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2)
              }
            }}
          >
            <RefreshIcon color="primary" />
          </IconButton>
        </Box>

        <Card sx={{ 
          boxShadow: 'none', 
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Stock Level</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                  {isAdmin && <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedInventory.map((product) => (
                  <TableRow 
                    key={product.id} 
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                  >
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      <Chip 
                        label={product.category}
                        size="small"
                        sx={{ 
                          bgcolor: product.category === 'Electronics' ? 
                            alpha(theme.palette.primary.main, 0.1) : 
                            alpha(theme.palette.secondary.main, 0.1),
                          color: product.category === 'Electronics' ?
                            theme.palette.primary.main :
                            theme.palette.secondary.main,
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {product.stock}
                        {product.stock < product.lowStockThreshold && (
                          <Chip
                            icon={<WarningIcon sx={{ fontSize: '1rem !important' }} />}
                            label="Low Stock"
                            size="small"
                            sx={{ 
                              bgcolor: alpha(theme.palette.warning.main, 0.1),
                              color: theme.palette.warning.main,
                              fontWeight: 500
                            }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        <IconButton 
                          onClick={() => handleEditProduct(product)}
                          sx={{ 
                            color: theme.palette.primary.main,
                            '&:hover': { 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s'
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDeleteProduct(product)}
                          sx={{ 
                            color: theme.palette.error.main,
                            '&:hover': { 
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s'
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, gap: 2 }}>
          <Button
            variant="contained"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            Prev
          </Button>
          <Typography variant="body1">
            Page {currentPage + 1} of {totalPages}
          </Typography>
          <Button
            variant="contained"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            Next
          </Button>
        </Box>

        {isAdmin && (
          <ProductDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            product={selectedProduct}
            onSave={handleSaveProduct}
          />
        )}
      </Paper>
    </Box>
  );
};

export default Inventory;