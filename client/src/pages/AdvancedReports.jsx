/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  alpha
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TableChartIcon from '@mui/icons-material/TableChart';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdvancedReports = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product/`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
      setLoading(false);
      showSnackbar('Failed to load products', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const downloadExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(products);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, 'products_report.xlsx');
      showSnackbar('Excel file downloaded successfully');
    } catch (error) {
      showSnackbar('Failed to download Excel file', 'error');
    }
  };
  
  const downloadCSV = () => {
    try {
      const headers = Object.keys(products[0]).join(',');
      const csvContent = [headers].concat(products.map(row => Object.values(row).join(','))).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'products_report.csv');
      showSnackbar('CSV file downloaded successfully');
    } catch (error) {
      showSnackbar('Failed to download CSV file', 'error');
    }
  };
  
  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      const headers = Object.keys(products[0]);
      const data = products.map(product => Object.values(product));
      
      doc.text('Products Report', 14, 15);
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 20,
      });
      
      doc.save('products_report.pdf');
      showSnackbar('PDF file downloaded successfully');
    } catch (error) {
      showSnackbar('Failed to download PDF file', 'error');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh" sx={{ background: alpha(theme.palette.primary.main, 0.03) }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        <Alert severity="error" variant="filled" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        <Alert severity="info" variant="filled" sx={{ mb: 2, borderRadius: 2 }}>
          No products available.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: alpha(theme.palette.primary.main, 0.03),
      pt: 4,
      pb: 8
    }}>
      <Container maxWidth="lg">
        
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 4,
                borderRadius: 4,
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }} color="primary">
                Advanced Reports
              </Typography>
              
              <Box sx={{ mb: 6 }}>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                  Generate and download comprehensive reports in various formats. Choose from Excel, CSV, or PDF formats.
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'all 0.3s ease-in-out',
                      borderRadius: 4,
                      '&:hover': { 
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[5]
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ 
                        mb: 3,
                        background: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: '50%',
                        width: 80,
                        height: 80,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <TableChartIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                      </Box>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 600, mb: 2 }}>
                        Excel Report
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Download detailed product data in Excel format with formatted tables and sheets
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 4, pt: 0 }}>
                      <Button 
                        startIcon={<DownloadIcon />}
                        onClick={downloadExcel}
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ 
                          borderRadius: 3,
                          py: 1.5,
                          textTransform: 'none',
                          fontSize: '1.1rem'
                        }}
                      >
                        Download Excel
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'all 0.3s ease-in-out',
                      borderRadius: 4,
                      '&:hover': { 
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[5]
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ 
                        mb: 3,
                        background: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: '50%',
                        width: 80,
                        height: 80,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                      </Box>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 600, mb: 2 }}>
                        CSV Report
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Export product data in CSV format for easy data manipulation
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 4, pt: 0 }}>
                      <Button 
                        startIcon={<DownloadIcon />}
                        onClick={downloadCSV}
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ 
                          borderRadius: 3,
                          py: 1.5,
                          textTransform: 'none',
                          fontSize: '1.1rem'
                        }}
                      >
                        Download CSV
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'all 0.3s ease-in-out',
                      borderRadius: 4,
                      '&:hover': { 
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[5]
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ 
                        mb: 3,
                        background: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: '50%',
                        width: 80,
                        height: 80,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                      </Box>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 600, mb: 2 }}>
                        PDF Report
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Generate comprehensive PDF report with formatted tables and charts
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 4, pt: 0 }}>
                      <Button 
                        startIcon={<DownloadIcon />}
                        onClick={downloadPDF}
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ 
                          borderRadius: 3,
                          py: 1.5,
                          textTransform: 'none',
                          fontSize: '1.1rem'
                        }}
                      >
                        Download PDF
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ mt: 8 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
                  Data Preview
                </Typography>
                <Paper 
                  sx={{ 
                    overflow: 'auto',
                    maxHeight: 400,
                    p: 4,
                    borderRadius: 4,
                    background: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        background: alpha(theme.palette.primary.main, 0.1),
                        textAlign: 'center'
                      }}>
                        <Typography variant="h2" color="primary" gutterBottom sx={{ fontWeight: 700 }}>
                          {products.length}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                          Total Products
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            variant="filled"
            sx={{ 
              borderRadius: 2,
              boxShadow: theme.shadows[10]
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdvancedReports;