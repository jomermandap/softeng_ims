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
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp,
  TrendingDown,
  Inventory2,
  Assessment,
  Refresh,
  Add,
  Warning,
  BarChart,
  Timeline,
  LocalShipping,
  Notifications,
  ErrorOutline,
  ArrowForward
} from '@mui/icons-material';

const Dashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [stockTrend, setStockTrend] = useState(5.2);
  const [showAlerts, setShowAlerts] = useState(false);
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

  const getStockPercentage = (stock, threshold) => (stock / threshold) * 100;

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

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
            {lowStockItems.map((item) => (
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
                {userRole === 'admin' && (
                  <Button 
                    variant="contained" 
                    color="warning" 
                    size="small"
                    sx={{ 
                      ml: 2,
                      borderRadius: 2,
                      boxShadow: '0 4px 14px 0 rgba(255, 171, 0, 0.39)'
                    }}
                    endIcon={<ArrowForward />}
                  >
                    Order More
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
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
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
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
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
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
                  <Typography variant="h3" sx={{ fontWeight: 600, color: 'success.main', mb: 1 }}>
                  ₹{Math.floor(totalValue).toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {stockTrend >= 0 ? 
                      <TrendingUp color="success" sx={{ fontSize: 20 }} /> : 
                      <TrendingDown color="error" sx={{ fontSize: 20 }} />
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
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
                    {Math.round(inventory.reduce((acc, item) => acc + item.stock, 0) / inventory.length)}
                  </Typography>
                  <Typography variant="body2" color="info.dark">
                    Units per product
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Low Stock Alerts */}
            <Grid item xs={12}>
              {lowStockItems.length > 0 && (
                <Alert 
                  severity="warning" 
                  icon={<Warning />}
                  sx={{ 
                    mb: 3, 
                    borderRadius: 3,
                    boxShadow: '0 4px 14px 0 rgba(255, 171, 0, 0.1)',
                    '.MuiAlert-message': {
                      width: '100%'
                    }
                  }}
                  action={
                    userRole === 'admin' && (
                      <Button 
                        color="warning" 
                        variant="contained"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          boxShadow: '0 4px 14px 0 rgba(255, 171, 0, 0.39)'
                        }}
                      >
                        Order More
                      </Button>
                    )
                  }
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Low Stock Alert!
                  </Typography>
                  {lowStockItems.length} items are running low on stock and need attention
                </Alert>
              )}
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventory.map((item) => (
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Enhanced Quick Actions */}
            <Grid item xs={12}>
              <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                <Card 
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 4,
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 14px 0 rgba(24, 144, 255, 0.39)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      cursor: 'pointer',
                      boxShadow: '0 6px 20px 0 rgba(24, 144, 255, 0.39)'
                    }
                  }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3 }}>
                    <BarChart sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Analytics Dashboard</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>View detailed analytics and trends</Typography>
                  </CardContent>
                </Card>

                <Card 
                  sx={{ 
                    bgcolor: 'success.main',
                    color: 'white',
                    borderRadius: 4,
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 14px 0 rgba(76, 175, 80, 0.39)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      cursor: 'pointer',
                      boxShadow: '0 6px 20px 0 rgba(76, 175, 80, 0.39)'
                    }
                  }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3 }}>
                    <Timeline sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Stock Forecasting</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Predict future inventory needs</Typography>
                  </CardContent>
                </Card>

                <Card 
                  sx={{ 
                    bgcolor: 'warning.main',
                    color: 'white',
                    borderRadius: 4,
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 14px 0 rgba(255, 171, 0, 0.39)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      cursor: 'pointer',
                      boxShadow: '0 6px 20px 0 rgba(255, 171, 0, 0.39)'
                    }
                  }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3 }}>
                    <LocalShipping sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Supplier Portal</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Manage supplier relationships</Typography>
                  </CardContent>
                </Card>

                <Card 
                  sx={{ 
                    bgcolor: 'error.main',
                    color: 'white',
                    borderRadius: 4,
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 14px 0 rgba(244, 67, 54, 0.39)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      cursor: 'pointer',
                      boxShadow: '0 6px 20px 0 rgba(244, 67, 54, 0.39)'
                    }
                  }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3 }}>
                    <Notifications sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Alert Center</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>View and manage notifications</Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Fade>
      )}
    </Box>
  );
};

export default Dashboard;