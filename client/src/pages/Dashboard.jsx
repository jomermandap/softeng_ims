/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { 
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Button,
  Box,
  IconButton,
  LinearProgress,
  Tooltip,
  Chip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  alpha,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp,
  TrendingDown,
  Refresh,
  Warning,
  ErrorOutline,
  ArrowForward,
  Search as SearchIcon,
  Receipt
} from '@mui/icons-material';

const Dashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [stockTrend, setStockTrend] = useState(5.2);
  const [showAlerts, setShowAlerts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [tablePage, setTablePage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockUpdateDialog, setStockUpdateDialog] = useState(false);
  const [newStockValue, setNewStockValue] = useState('');
  const [billDialog, setBillDialog] = useState(false);
  const [saleQuantity, setSaleQuantity] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const theme = useTheme();

  useEffect(() => {
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
          setLowStockItems(products.filter(item => item.stock < item.lowStockThreshold));
          setTotalValue(products.reduce((acc, item) => acc + (item.stock * item.price), 0));
        } else {
          console.error('Error fetching inventory:', result.message);
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();

    const interval = setInterval(() => {
      // TODO: Replace with actual WebSocket implementation
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || item.category === category;
      return matchesSearch && matchesCategory;
    });
    setFilteredInventory(filtered);
    setTablePage(0); // Reset table page when filters change
  }, [searchTerm, category, inventory]);

  const getStockPercentage = (stock, threshold) => (stock / threshold) * 100;

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < lowStockItems.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleTableNextPage = () => {
    if ((tablePage + 1) * itemsPerPage < filteredInventory.length) {
      setTablePage(tablePage + 1);
    }
  };

  const handleTablePrevPage = () => {
    if (tablePage > 0) {
      setTablePage(tablePage - 1);
    }
  };

  const handleUpdateStock = async () => {
    if (!selectedProduct || !newStockValue) return;

    try {
      const response = await fetch(`http://localhost:5017/api/product/update/${selectedProduct.sku}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock: parseInt(newStockValue)
        })
      });

      if (response.ok) {
        // Update local state
        const updatedInventory = inventory.map(item => 
          item.sku === selectedProduct.sku ? {...item, stock: parseInt(newStockValue)} : item
        );
        setInventory(updatedInventory);
        setStockUpdateDialog(false);
        setSelectedProduct(null);
        setNewStockValue('');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const generateBillNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BILL-${timestamp}-${random}`;
  };

  const handleGenerateBill = async () => {
    if (!selectedProduct || !saleQuantity) return;

    const newBillNumber = generateBillNumber();
    setBillNumber(newBillNumber);

    try {
      // Update stock after sale
      const newStock = selectedProduct.stock - parseInt(saleQuantity);
      const response = await fetch(`http://localhost:5017/api/product/update/${selectedProduct.sku}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock: newStock
        })
      });

      if (response.ok) {
        // Update local state
        const updatedInventory = inventory.map(item => 
          item.sku === selectedProduct.sku ? {...item, stock: newStock} : item
        );
        setInventory(updatedInventory);
        setBillDialog(false);
        setSelectedProduct(null);
        setSaleQuantity('');
        
        // Here you could also save the bill details to your database
        // and/or open a print dialog
      }
    } catch (error) {
      console.error('Error generating bill:', error);
    }
  };

  const totalPages = Math.ceil(lowStockItems.length / itemsPerPage);
  const totalTablePages = Math.ceil(filteredInventory.length / itemsPerPage);
  
  const paginatedInventory = filteredInventory.slice(
    tablePage * itemsPerPage,
    (tablePage + 1) * itemsPerPage
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f5f5f9', minHeight: '100vh' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Button
          variant="contained"
          sx={{
            background: theme.palette.warning.light,
            color: theme.palette.warning.dark,
            '&:hover': {
              background: alpha(theme.palette.warning.light, 0.9)
            },
            borderRadius: 3,
            boxShadow: '0 4px 14px 0 rgba(255, 171, 0, 0.39)'
          }}
          startIcon={<Warning />}
          onClick={() => setShowAlerts(true)}
          disabled={lowStockItems.length === 0}
        >
          View Low Stock Alerts ({lowStockItems.length})
        </Button>
        <Tooltip title="Refresh Data">
          <IconButton 
            onClick={refreshData} 
            sx={{ 
              bgcolor: 'white',
              boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
              '&:hover': {
                bgcolor: 'white',
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s'
              }
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stock Update Dialog */}
      <Dialog open={stockUpdateDialog} onClose={() => setStockUpdateDialog(false)}>
        <DialogTitle>Update Stock</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Stock Value"
            type="number"
            fullWidth
            value={newStockValue}
            onChange={(e) => setNewStockValue(e.target.value)}
          />
          <Button onClick={handleUpdateStock} variant="contained" sx={{ mt: 2 }}>
            Update Stock
          </Button>
        </DialogContent>
      </Dialog>

      {/* Generate Bill Dialog */}
      <Dialog open={billDialog} onClose={() => setBillDialog(false)}>
        <DialogTitle>Generate Bill</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Product: {selectedProduct?.name}
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Available Stock: {selectedProduct?.stock}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Sale Quantity"
            type="number"
            fullWidth
            value={saleQuantity}
            onChange={(e) => setSaleQuantity(e.target.value)}
            inputProps={{ max: selectedProduct?.stock }}
          />
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Total Amount: ₹{selectedProduct?.price * saleQuantity || 0}
          </Typography>
          <Button 
            onClick={handleGenerateBill} 
            variant="contained" 
            sx={{ mt: 2 }}
            disabled={!saleQuantity || saleQuantity > selectedProduct?.stock}
          >
            Generate Bill
          </Button>
        </DialogContent>
      </Dialog>

      {/* Low Stock Alerts Dialog */}
      <Dialog 
        open={showAlerts} 
        onClose={() => setShowAlerts(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            bgcolor: 'warning.light', 
            color: 'warning.dark',
            p: 3
          }}
        >
          <Box display="flex" alignItems="center">
            <ErrorOutline sx={{ mr: 1 }} />
            Low Stock Alerts
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <List>
            {lowStockItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((item) => (
              <ListItem 
                key={item.id}
                sx={{ 
                  mb: 2, 
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <ListItemIcon>
                  <Warning color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Current Stock: {item.stock} | Threshold: {item.lowStockThreshold}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={getStockPercentage(item.stock, item.lowStockThreshold)}
                        sx={{ 
                          mt: 1,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha(theme.palette.error.main, 0.1)
                        }}
                        color="error"
                      />
                    </Box>
                  }
                />
                
              </ListItem>
            ))}
          </List>
          {lowStockItems.length > (currentPage + 1) * itemsPerPage && (
            <Button 
              variant="outlined" 
              onClick={handleNextPage} 
              sx={{ mt: 2 }}
            >
              Next
            </Button>
          )}
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <LinearProgress 
          sx={{ 
            mb: 4,
            height: 10,
            borderRadius: 5
          }} 
        />
      ) : (
        <Fade in={!isLoading}>
          <Grid container spacing={3}>
            {/* Summary Cards */}
            <Grid item xs={12} md={3}>
              <Card 
                sx={{ 
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
                  borderRadius: 4,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography color="text.secondary" gutterBottom variant="subtitle2">
                    Total Products
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {inventory.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Across {new Set(inventory.map(item => item.category)).size} categories
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card 
                sx={{ 
                  bgcolor: alpha(theme.palette.warning.light, 0.1),
                  boxShadow: '0 4px 14px 0 rgba(255, 171, 0, 0.1)',
                  borderRadius: 4,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography color="warning.main" gutterBottom variant="subtitle2">
                    Low Stock Items
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                    {lowStockItems.length}
                  </Typography>
                  <Typography variant="body2" color="warning.dark">
                    Require immediate attention
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card 
                sx={{ 
                  bgcolor: alpha(theme.palette.success.light, 0.1),
                  boxShadow: '0 4px 14px 0 rgba(76, 175, 80, 0.1)',
                  borderRadius: 4,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography color="success.main" gutterBottom variant="subtitle2">
                    Total Stock Value
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main', mb: 1 }}>
                  ₹{Math.floor(totalValue).toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {stockTrend >= 0 ? 
                      <TrendingUp color="success" sx={{ fontSize: 18 }} /> : 
                      <TrendingDown color="error" sx={{ fontSize: 18 }} />
                    }
                    <Typography variant="body2" color="success.dark" sx={{ ml: 1 }}>
                      {Math.abs(stockTrend)}% from last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card 
                sx={{ 
                  bgcolor: alpha(theme.palette.info.light, 0.1),
                  boxShadow: '0 4px 14px 0 rgba(33, 150, 243, 0.1)',
                  borderRadius: 4,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography color="info.main" gutterBottom variant="subtitle2">
                    Average Stock Level
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
                    {Math.round(inventory.reduce((acc, item) => acc + item.stock, 0) / inventory.length)}
                  </Typography>
                  <Typography variant="body2" color="info.dark">
                    Units per product
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Search and Filter */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  size="small"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                  sx={{ 
                    width: 300,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'background.paper',
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
                      bgcolor: 'background.paper'
                    }}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="Electronics">Electronics</MenuItem>
                    <MenuItem value="Accessories">Accessories</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Inventory Table */}
            <Grid item xs={12}>
              <TableContainer 
                component={Paper} 
                sx={{ 
                  borderRadius: 4, 
                  boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
                  overflow: 'hidden'
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                      <TableCell sx={{ fontWeight: 600, py: 2 }}>Product Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, py: 2 }}>SKU</TableCell>
                      <TableCell sx={{ fontWeight: 600, py: 2 }}>Category</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Stock Level</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedInventory.map((item) => (
                      <TableRow 
                        key={item.id}
                        hover
                        sx={{ 
                          '&:last-child td, &:last-child th': { border: 0 },
                          transition: 'background-color 0.2s',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.02)
                          }
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500, py: 2 }}>{item.name}</TableCell>
                        <TableCell sx={{ py: 2 }}>{item.sku}</TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Chip 
                            label={item.category} 
                            size="small"
                            sx={{ 
                              borderRadius: '8px',
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                              fontWeight: 500,
                              px: 1
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {item.stock}
                            <LinearProgress
                              variant="determinate"
                              value={getStockPercentage(item.stock, item.lowStockThreshold)}
                              sx={{ 
                                ml: 2, 
                                width: 100,
                                height: 8,
                                borderRadius: 4,
                                bgcolor: alpha(
                                  item.stock < item.lowStockThreshold 
                                    ? theme.palette.error.main 
                                    : theme.palette.success.main,
                                  0.1
                                )
                              }}
                              color={item.stock < item.lowStockThreshold ? "error" : "success"}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500, py: 2 }}>₹{item.price}</TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Chip
                            label={item.stock < item.lowStockThreshold ? "Low Stock" : "In Stock"}
                            color={item.stock < item.lowStockThreshold ? "error" : "success"}
                            size="small"
                            sx={{ 
                              borderRadius: '8px',
                              fontWeight: 500,
                              px: 1
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => {
                                setSelectedProduct(item);
                                setStockUpdateDialog(true);
                              }}
                              sx={{
                                borderRadius: 2,
                                textTransform: 'none'
                              }}
                            >
                              Update Stock
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<Receipt />}
                              onClick={() => {
                                setSelectedProduct(item);
                                setBillDialog(true);
                              }}
                              sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                bgcolor: theme.palette.success.main,
                                '&:hover': {
                                  bgcolor: theme.palette.success.dark
                                }
                              }}
                            >
                              Generate Bill
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Pagination */}
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleTablePrevPage}
                  disabled={tablePage === 0}
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
                  Page {tablePage + 1} of {totalTablePages}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleTableNextPage}
                  disabled={tablePage >= totalTablePages - 1}
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
            </Grid>
          </Grid>
        </Fade>
      )}
    </Box>
  );
};

export default Dashboard;