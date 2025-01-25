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
  Paper, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  IconButton, 
  TextField, 
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  LinearProgress
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Visibility as ViewIcon, 
  Print as PrintIcon, 
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Cancel as CancelIcon,
  GetApp as ExportIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';

const BillPage = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    minAmount: '',
    maxAmount: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [billsResponse, productsResponse] = await Promise.all([
          fetch('http://localhost:5017/api/bill/'),
          fetch('http://localhost:5017/api/product/')
        ]);
        
        const billsResult = await billsResponse.json();
        const productsResult = await productsResponse.json();
        
        setBills(billsResult);
        setProducts(productsResult.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = bills.filter(bill => {
      const product = products.find(p => p.sku === bill.productSku);
      const matchesSearch = 
        (product && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (bill.billNumber && bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesAmountFilter = 
        (!filter.minAmount || bill.totalAmount >= parseFloat(filter.minAmount)) &&
        (!filter.maxAmount || bill.totalAmount <= parseFloat(filter.maxAmount));
      
      const matchesDateFilter = 
        (!filter.dateFrom || new Date(bill.createdAt) >= new Date(filter.dateFrom)) &&
        (!filter.dateTo || new Date(bill.createdAt) <= new Date(filter.dateTo));
      
      return matchesSearch && matchesAmountFilter && matchesDateFilter;
    });
    
    setFilteredBills(filtered);
  }, [searchTerm, bills, products, filter]);

  const handlePrint = (bill) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            body { font-family: 'Inter', sans-serif; }
            .bill { margin: 20px; }
            .bill h1 { text-align: center; }
            .bill table { width: 100%; border-collapse: collapse; }
            .bill th, .bill td { border: 1px solid #e0e0e0; padding: 12px; text-align: left; }
          </style>
        </head>
        <body>
          <div class="bill">
            <h1>Bill Details</h1>
            <p>Bill Number: ${bill.billNumber}</p>
            <p>Date: ${new Date(bill.createdAt).toLocaleDateString()}</p>
            <table>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Vendor Name</th>
                <th>Payment Type</th>
              </tr>
              <tr>
                <td>${bill.productName}</td>
                <td>${bill.quantity}</td>
                <td>₹${bill.totalAmount.toFixed(2)}</td>
                <td>${bill.vendorName || 'N/A'}</td>
                <td>${bill.paymentType || 'N/A'}</td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = (bill) => {
    const csvContent = `data:text/csv;charset=utf-8,` +
      `Bill Number,Product Name,Quantity,Total Amount,Date,Vendor Name,Payment Type\n` +
      `${bill.billNumber},${bill.productName},${bill.quantity},₹${bill.totalAmount.toFixed(2)},${new Date(bill.createdAt).toLocaleDateString()},${bill.vendorName || 'N/A'},${bill.paymentType || 'N/A'}`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bill_${bill.billNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewDetails = (bill) => {
    const product = products.find(p => p.sku === bill.productSku);
    setSelectedBill({ 
      ...bill, 
      productName: product ? product.name : 'Unknown Product' 
    });
  };

  const clearFilters = () => {
    setFilter({
      minAmount: '',
      maxAmount: '',
      dateFrom: '',
      dateTo: ''
    });
    setSearchTerm('');
  };

  const exportToCSV = () => {
    const csvData = filteredBills.map(bill => ({
      BillNumber: bill.billNumber,
      ProductName: products.find(p => p.sku === bill.productSku)?.name || 'Unknown Product',
      Quantity: bill.quantity,
      TotalAmount: bill.totalAmount.toFixed(2),
      Date: format(new Date(bill.createdAt), 'dd MMM yyyy'),
      VendorName: bill.vendorName || 'N/A',
      PaymentType: bill.paymentType || 'N/A'
    }));

    const csvContent = [
      ['Bill Number', 'Product Name', 'Quantity', 'Total Amount', 'Date', 'Vendor Name', 'Payment Type'],
      ...csvData.map(item => [item.BillNumber, item.ProductName, item.Quantity, item.TotalAmount, item.Date, item.VendorName, item.PaymentType])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'bills.csv');
  };

  return (
    <Box sx={{ 
      p: 4, 
      bgcolor: 'background.default', 
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)'
    }}>
      <Card 
        elevation={0} 
        sx={{ 
          borderRadius: 4,
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search bills by product name or bill number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff',
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Tooltip title="Filter Bills">
                  <IconButton 
                    sx={{ 
                      bgcolor: 'primary.soft',
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'primary.softHover' }
                    }}
                  >
                    <FilterIcon />
                  </IconButton>
                </Tooltip>
                {(filter.minAmount || filter.maxAmount || filter.dateFrom || filter.dateTo) && (
                  <Tooltip title="Clear Filters">
                    <IconButton 
                      onClick={clearFilters}
                      sx={{ 
                        bgcolor: 'error.soft',
                        color: 'error.main',
                        '&:hover': { bgcolor: 'error.softHover' }
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Export to CSV">
                  <IconButton 
                    onClick={exportToCSV}
                    sx={{ 
                      bgcolor: 'success.soft',
                      color: 'success.main',
                      '&:hover': { bgcolor: 'success.softHover' }
                    }}
                  >
                    <ExportIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>

          {loading ? (
            <LinearProgress sx={{ borderRadius: 1 }} />
          ) : (
            <TableContainer 
              component={Paper} 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: '1px solid rgba(0, 0, 0, 0.08)',
                overflow: 'hidden'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Bill Number</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Total Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBills.map((bill) => {
                    const product = products.find(p => p.sku === bill.productSku);
                    const isDue = bill.paymentType?.toLowerCase() === 'due';
                    return (
                      <TableRow 
                        key={bill.billNumber} 
                        hover 
                        sx={{ 
                          transition: 'all 0.3s ease',
                          backgroundColor: isDue ? 'error.soft' : 'inherit',
                          '&:hover': { 
                            backgroundColor: isDue ? 'error.softHover' : 'action.hover',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                          }
                        }}
                      >
                        <TableCell>
                          <Chip 
                            label={bill.billNumber} 
                            color={isDue ? 'error.main' : 'primary.main'} 
                            variant="outlined" 
                            size="small"
                            sx={{ 
                              borderRadius: 2,
                              fontWeight: 500,
                              borderColor: isDue ? 'error.main' : 'primary.main', 
                              '& .MuiChip-label': { px: 2 }
                            }}
                          />
                        </TableCell>
                        <TableCell>{product ? product.name : 'Unknown Product'}</TableCell>
                        <TableCell align="right">{bill.quantity}</TableCell>
                        <TableCell align="right">
                          <Typography 
                            component="span" 
                            sx={{ 
                              color: isDue ? 'error.main' : 'success.main',
                              fontWeight: 600,
                              bgcolor: isDue ? 'error.soft' : 'success.soft',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 2,
                              fontSize: '0.875rem'
                            }}
                          >
                            ₹{bill.totalAmount.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.secondary',
                              fontWeight: 500 
                            }}
                          >
                            {format(new Date(bill.createdAt), 'dd MMM yyyy')}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small"
                                onClick={() => handleViewDetails(bill)}
                                sx={{ 
                                  bgcolor: 'primary.soft',
                                  color: 'primary.main',
                                  '&:hover': { bgcolor: 'primary.softHover' }
                                }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Print Bill">
                              <IconButton 
                                size="small"
                                onClick={() => handlePrint(bill)}
                                sx={{ 
                                  bgcolor: 'secondary.soft',
                                  color: 'secondary.main',
                                  '&:hover': { bgcolor: 'secondary.softHover' }
                                }}
                              >
                                <PrintIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download Bill">
                              <IconButton 
                                size="small"
                                onClick={() => handleDownload(bill)}
                                sx={{ 
                                  bgcolor: 'success.soft',
                                  color: 'success.main',
                                  '&:hover': { bgcolor: 'success.softHover' }
                                }}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog 
        open={!!selectedBill} 
        onClose={() => setSelectedBill(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundImage: 'linear-gradient(to right, #fff 0%, #f8f9fa 100%)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            color: '#fff',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 3
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Bill Details
          </Typography>
          <IconButton 
            onClick={() => setSelectedBill(null)}
            sx={{ 
              color: '#fff',
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.2)' 
              }
            }}
          >
            <CancelIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {selectedBill && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                  Bill Information
                </Typography>
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 3, 
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.08)'
                }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Bill Number:</strong> 
                    <Chip 
                      label={selectedBill.billNumber} 
                      color="primary" 
                      variant="outlined" 
                      size="small" 
                      sx={{ 
                        ml: 2, 
                        borderRadius: 2,
                        borderColor: selectedBill.paymentType?.toLowerCase() === 'due' ? 'error.main' : 'primary.main' // Change border color if due
                      }}
                    />
                  </Typography>
                  <Typography variant="body1">
                    <strong>Date:</strong> {format(new Date(selectedBill.createdAt), 'dd MMMM yyyy, hh:mm a')}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Vendor Name:</strong> {selectedBill.vendorName || 'N/A'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Payment Type:</strong> {selectedBill.paymentType || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                  Product Details
                </Typography>
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 3, 
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.08)'
                }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Product:</strong> {selectedBill.productName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Quantity:</strong> {selectedBill.quantity}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ 
                  background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                  p: 3, 
                  borderRadius: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#fff',
                  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)'
                }}>
                  <Typography variant="h6">Total Amount</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    ₹{selectedBill.totalAmount.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BillPage;