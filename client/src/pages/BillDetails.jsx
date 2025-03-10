import { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Card, CardContent, Grid, Chip, IconButton, TextField, InputAdornment, Dialog, DialogTitle, 
  DialogContent, Tooltip, LinearProgress, Stack, Button, DialogActions 
} from '@mui/material';
import { 
  Search as SearchIcon, Visibility as ViewIcon, Print as PrintIcon, Download as DownloadIcon, 
  FilterList as FilterIcon, Cancel as CancelIcon, GetApp as ExportIcon, Warning as WarningIcon, 
  Person as PersonIcon, Delete as DeleteIcon, Check as CheckIcon 
} from '@mui/icons-material';
import { format, differenceInDays } from 'date-fns';
import { saveAs } from 'file-saver';

const BillPage = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dueSummary, setDueSummary] = useState({
    totalVendors: 0,
    totalAmount: 0,
    vendors: []
  });
  const [filter, setFilter] = useState({
    minAmount: '',
    maxAmount: '',
    dateFrom: '',
    dateTo: ''
  });
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [billsResponse, productsResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/bill/`),
          fetch(`${import.meta.env.VITE_API_URL}/api/product/`)
        ]);
        
        const billsResult = await billsResponse.json();
        const productsResult = await productsResponse.json();
        
        console.log('Fetched bills:', billsResult);
        
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
    const dueBills = bills.filter(bill => bill.paymentType?.toLowerCase() === 'due');
    const vendorMap = new Map();

    dueBills.forEach(bill => {
      const daysOverdue = differenceInDays(new Date(), new Date(bill.createdAt));
      if (!vendorMap.has(bill.vendorName)) {
        vendorMap.set(bill.vendorName, {
          totalAmount: bill.totalAmount,
          daysOverdue,
          billCount: 1
        });
      } else {
        const vendor = vendorMap.get(bill.vendorName);
        vendorMap.set(bill.vendorName, {
          totalAmount: vendor.totalAmount + bill.totalAmount,
          daysOverdue: Math.max(vendor.daysOverdue, daysOverdue),
          billCount: vendor.billCount + 1
        });
      }
    });

    const totalAmount = dueBills.reduce((sum, bill) => sum + bill.totalAmount, 0);

    setDueSummary({
      totalVendors: vendorMap.size,
      totalAmount,
      vendors: Array.from(vendorMap.entries()).map(([name, data]) => ({
        name,
        ...data
      }))
    });
  }, [bills]);

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
                <td>₱${bill.totalAmount.toFixed(2)}</td>
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
      `${bill.billNumber},${bill.productName},${bill.quantity},₱${bill.totalAmount.toFixed(2)},${new Date(bill.createdAt).toLocaleDateString()},${bill.vendorName || 'N/A'},${bill.paymentType || 'N/A'}`;
    
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

  // Delete Bill
  const deleteBill = async (billNumber) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this bill?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bill/delete/${billNumber}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Bill deleted successfully!');
        setBills(bills.filter(bill => bill.billNumber !== billNumber));
      } else {
        const { message } = await response.json();
        alert(`Error: ${message}`);
      }
    } catch (error) {
      console.error('Error deleting bill:', error);
      alert('Failed to delete the bill. Please try again.');
    }
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

  const handleDeleteBill = (billNumber) => {
    deleteBill(billNumber);
  };

  const handleMarkAsPaid = () => {
    setConfirmDialogOpen(true);
  };

  const confirmMarkAsPaid = async () => {
    await markBillAsPaid(selectedBill.billNumber);
    setConfirmDialogOpen(false);
  };

  const markBillAsPaid = async (billNumber) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bill/mark-paid/${billNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        await response.json();
  
        // Update the bill in the state
        setBills((prevBills) =>
          prevBills.map((bill) =>
            bill.billNumber === billNumber ? { ...bill, paymentType: 'Paid' } : bill
          )
        );
  
        // Update selected bill (if open)
        if (selectedBill?.billNumber === billNumber) {
          setSelectedBill((prev) => prev ? { ...prev, paymentType: 'Paid' } : null);
        }
  
        setConfirmDialogOpen(false);
      } else {
        const { message } = await response.json();
        alert(`Error: ${message}`);
      }
    } catch (error) {
      console.error('Error marking bill as paid:', error);
      alert('Failed to mark bill as paid. Please try again.');
    }
  };
  

  //New Functions
  
  return (
    <Box sx={{ 
      p: 4, 
      bgcolor: 'background.default', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Due Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: '16px',
              bgcolor: 'rgba(255, 72, 66, 0.08)', 
              p: 3,
              height: '75%',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px rgba(255, 72, 66, 0.15)'
              }
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <WarningIcon color="error" />
              <Typography variant="h6" color="error.main">Due Summary</Typography>
            </Stack>
            <Typography variant="h4" sx={{ mt: 3, mb: 1, color: 'error.main', fontWeight: 700 }}>
              {dueSummary.totalVendors}
            </Typography>
            <Typography variant="body1" color="error.main" sx={{ opacity: 0.8 }}>
              Vendors with Due Payments
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: '16px',
              bgcolor: 'rgba(255, 171, 0, 0.08)',
              p: 3,
              height: '75%',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px rgba(255, 171, 0, 0.15)'
              }
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              
              <Typography variant="h6" color="warning.main">Total Due Amount</Typography>
            </Stack>
            <Typography variant="h4" sx={{ mt: 3, mb: 1, color: 'warning.main', fontWeight: 700 }}>
              ₱{dueSummary.totalAmount.toFixed(2)}
            </Typography>
            <Typography variant="body1" color="warning.main" sx={{ opacity: 0.8 }}>
              Outstanding Payments
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: '16px', 
              bgcolor: 'rgba(24, 144, 255, 0.08)',
              p: 3,
              height: '75%',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px rgba(24, 144, 255, 0.15)'
              }
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <PersonIcon color="info" />
              <Typography variant="h6" color="info.main">Vendor Details</Typography>
            </Stack>
            <Box sx={{ mt: 3 }}>
              <Button
                startIcon={<PersonIcon />}
                onClick={() => setVendorDialogOpen(true)}
                variant="contained"
                color="info"
                fullWidth
                sx={{
                  borderRadius: '8px',
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                View All Vendors
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Card 
        elevation={0} 
        sx={{ 
          borderRadius: '24px',
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
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      transform: 'translateY(-2px)'
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff',
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                      transform: 'translateY(-2px)'
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
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: 'primary.softHover',
                        transform: 'translateY(-2px)'
                      }
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
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          bgcolor: 'error.softHover',
                          transform: 'translateY(-2px)'
                        }
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
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: 'success.softHover',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <ExportIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>

          {loading ? (
            <LinearProgress 
              sx={{ 
                borderRadius: '8px',
                height: '8px',
                '.MuiLinearProgress-bar': {
                  borderRadius: '8px'
                }
              }} 
            />
          ) : (
            <TableContainer 
              component={Paper} 
              elevation={0}
              sx={{ 
                borderRadius: '20px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                overflow: 'hidden'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Bill Number</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Product Name</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Total Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Date</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Actions</TableCell>
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
                            color={isDue ? 'error' : 'primary'} 
                            variant="outlined" 
                            size="small"
                            sx={{ 
                              borderRadius: '12px',
                              fontWeight: 500,
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
                              px: 2,
                              py: 1,
                              borderRadius: '12px',
                              fontSize: '0.875rem'
                            }}
                          >
                            ₱{bill.totalAmount.toFixed(2)}
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
                                  borderRadius: '10px',
                                  transition: 'all 0.3s ease',
                                  '&:hover': { 
                                    bgcolor: 'primary.softHover',
                                    transform: 'translateY(-2px)'
                                  }
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
                                  borderRadius: '10px',
                                  transition: 'all 0.3s ease',
                                  '&:hover': { 
                                    bgcolor: 'secondary.softHover',
                                    transform: 'translateY(-2px)'
                                  }
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
                                  borderRadius: '10px',
                                  transition: 'all 0.3s ease',
                                  '&:hover': { 
                                    bgcolor: 'success.softHover',
                                    transform: 'translateY(-2px)'
                                  }
                                }}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Bill">
                              <IconButton 
                                size="small"
                                onClick={() => handleDeleteBill(bill.billNumber)}
                                sx={{ 
                                  bgcolor: 'error.soft',
                                  color: 'error.main',
                                  borderRadius: '10px',
                                  transition: 'all 0.3s ease',
                                  '&:hover': { 
                                    bgcolor: 'error.softHover',
                                    transform: 'translateY(-2px)'
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
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
            borderRadius: '24px',
            backgroundImage: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #1976d2 30%, #2196f3 90%)',
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
        <DialogContent sx={{ p: 4  }}>
          {selectedBill && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                  Bill Information
                </Typography>
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 3, 
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.08)',
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
                        borderRadius: '12px',
                        borderColor: selectedBill.paymentType?.toLowerCase() === 'due' ? 'error.main' : 'primary.main'
                      }}
                    />
                  </Typography>
                  <Typography variant="body1">
                    <strong>Date:</strong> {format(new Date(selectedBill.createdAt), 'dd MMMM yyyy, hh:mm a')}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Vendor Name:</strong> {selectedBill.vendorName || 'N/A'}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Payment Type:</strong> {selectedBill.paymentType || 'N/A'}
                  </Typography>
                  {selectedBill.paymentType?.toLowerCase() === 'due' && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckIcon />}
                      onClick={handleMarkAsPaid}
                      fullWidth
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        mt: 2
                      }}
                    >
                      Mark as Paid
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                  Product Details
                </Typography>
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 3, 
                  borderRadius: '20px',
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
                  background: 'linear-gradient(135deg, #1976d2 30%, #2196f3 90%)',
                  p: 3, 
                  borderRadius: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#fff',
                  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)'
                }}>
                  <Typography variant="h6">Total Amount</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                   ₱{selectedBill.totalAmount.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Vendors Dialog */}
      <Dialog
        open={vendorDialogOpen}
        onClose={() => setVendorDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            backgroundImage: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #1976d2 30%, #2196f3 90%)',
            color: '#fff',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 3
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Vendor List
          </Typography>
          <IconButton 
            onClick={() => setVendorDialogOpen(false)}
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vendor Name</TableCell>
                  <TableCell align="right">Total Due Amount</TableCell>
                  <TableCell align="right">Days Overdue</TableCell>
                  <TableCell align="right">Bill Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dueSummary.vendors.map((vendor, index) => (
                  <TableRow key={index}>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell align="right">₱{vendor.totalAmount.toFixed(2)}</TableCell>
                    <TableCell align="right">{vendor.daysOverdue}</TableCell>
                    <TableCell align="right">{vendor.billCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to mark this bill as paid?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmMarkAsPaid} 
            variant="contained" 
            color="success"
          >
            Mark as Paid
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillPage;