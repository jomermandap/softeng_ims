/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Stack, 
  Typography, 
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  alpha,
  Divider,
  MenuItem
} from '@mui/material';
import { Close, Receipt, Print,Save, ShoppingCart, Person, Payments } from '@mui/icons-material';

const BillGenerationDialog = ({ 
  billDialog, 
  selectedProduct, 
  saleQuantity, 
  setBillDialog, 
  setSelectedProduct, 
  setSaleQuantity, 
  handleGenerateBill 
}) => {
  const theme = useTheme();
  const [showBillDialog, setShowBillDialog] = useState(false);
  const [billNumber] = useState(`BILL-${Date.now()}-${Math.floor(Math.random() * 1000)}`); 
  const [billDetails, setBillDetails] = useState(null);
  const [vendorName, setVendorName] = useState(''); 
  const [paymentType, setPaymentType] = useState('paid'); 
  const [saving, setSaving] = useState(false);

  const handleCloseBillDialog = () => {
    setShowBillDialog(false);
    setBillDetails(null);
    setVendorName(''); 
    setPaymentType('paid'); 
  };


//must save bill records to database
  const handleGenerateBillClick = async () => {
    if (!selectedProduct || !saleQuantity || !vendorName) {
      return;
    }

    const quantity = parseInt(saleQuantity);
    const total = Math.floor(selectedProduct.price * quantity);

    if (quantity > selectedProduct.stock) {
      alert("Sale quantity exceeds available stock.");
      return;
    }

    setBillDetails({
      billNumber: billNumber,
      product: selectedProduct,
      quantity: quantity,
      total: total, 
      vendorName, 
      paymentType
    });

  handleGenerateBill();
  setShowBillDialog(true);
};

  const handlePrint = () => {
    window.print();
  };

  //Saving the Bill
  const handleSaveBill = async () => {
    if (!billDetails) return;
    setSaving(true);
    try {
      const response = await fetch('http://localhost:5017/api/bill/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billNumber: billDetails.billNumber,
          productSku: billDetails.product.sku,
          quantity: billDetails.quantity,
          totalAmount: billDetails.total,
          vendorName: billDetails.vendorName,
          paymentType: billDetails.paymentType,
        }),
      });

      if (response.ok) {
        alert('Bill saved successfully!');
        handleCloseBillDialog();
      } else {
        alert('Failed to save the bill. Please try again.');
      }
    } catch (error) {
      console.error('Error saving bill:', error);
      alert('An error occurred while saving the bill.');
    } finally {
      setSaving(false);
    }
  };

  const totalAmount = selectedProduct ? selectedProduct.price * parseInt(saleQuantity) : 0;
  const currentDate = new Date().toLocaleDateString();

  return (
    <>
      <Dialog
        open={billDialog}
        onClose={() => {
          setBillDialog(false);
          setSelectedProduct(null);
          setSaleQuantity('');
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShoppingCart sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h5" fontWeight={600}>
                Generate Bill
              </Typography>
            </Box>
            <IconButton
              onClick={() => {
                setBillDialog(false);
                setSelectedProduct(null);
                setSaleQuantity('');
              }}
              sx={{
                '&:hover': {
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main
                }
              }}
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Product"
              value={selectedProduct?.name || ''}
              disabled
              fullWidth
              InputProps={{
                startAdornment: (
                  <ShoppingCart sx={{ mr: 1, color: theme.palette.text.secondary }} />
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05)
                }
              }}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Available Stock"
                value={selectedProduct?.stock || ''}
                disabled
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              />

              <TextField
                label="Sale Quantity"
                value={saleQuantity}
                onChange={(e) => setSaleQuantity(e.target.value)}
                type="number"
                fullWidth
                autoFocus
                required
                error={selectedProduct && parseInt(saleQuantity) > selectedProduct.stock}
                helperText={selectedProduct && parseInt(saleQuantity) > selectedProduct.stock ? 
                  "Quantity exceeds available stock" : ""}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main
                    }
                  }
                }}
              />
            </Box>

            <TextField
              label="Vendor Name"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              fullWidth
              required
              error={!vendorName}
              helperText={!vendorName ? "Vendor name is required" : ""}
              InputProps={{
                startAdornment: (
                  <Person sx={{ mr: 1, color: theme.palette.text.secondary }} />
                )
              }}
            />

            <TextField
              label="Payment Type"
              select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <Payments sx={{ mr: 1, color: theme.palette.text.secondary }} />
                )
              }}
            >
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="due">Due</MenuItem>
            </TextField>

            {saleQuantity && selectedProduct && (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2, 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" align="right" color="primary.main">
                  Total: ₱{totalAmount > 0 ? totalAmount.toLocaleString() : '0'} 
                </Typography>
              </Paper>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => {
              setBillDialog(false);
              setSelectedProduct(null);
              setSaleQuantity('');
            }}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleGenerateBillClick}
            variant="contained"
            disabled={!saleQuantity || !vendorName ||
              (selectedProduct && parseInt(saleQuantity) > selectedProduct.stock)}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
            }}
          >
            Generate Bill
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={showBillDialog} 
        onClose={handleCloseBillDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
            color: 'white',
            p: 3,
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}
        >
          <Box display="flex" alignItems="center">
            <Receipt sx={{ mr: 2 }} />
            <Typography variant="h5" fontWeight={600}>
              Sales Invoice
            </Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Bill No: {billNumber}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          {billDetails && (
            <>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
                  Product Details
                </Typography>
                <TableContainer 
                  component={Paper} 
                  variant="outlined"
                  sx={{ 
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                        <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Quantity</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{billDetails.product.name}</TableCell>
                        <TableCell>{billDetails.product.sku}</TableCell>
                        <TableCell align="right">₱{Math.ceil(selectedProduct.price)}</TableCell>
                        <TableCell align="right">{billDetails.quantity}</TableCell>
                        <TableCell align="right">₱{billDetails.total}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Paper
                elevation={0}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 3,
                  p: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2
                }}
              >
                <Typography variant="subtitle1">
                  Date: {currentDate}
                </Typography>
                <Typography variant="h6" color="primary.main" fontWeight={600}>
                  Total Amount: ₱{parseFloat(billDetails.total).toFixed(2)}
                </Typography>
              </Paper>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button 
                  variant="outlined"
                  onClick={handleCloseBillDialog}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 4
                  }}
                >
                  Close
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<Save />} 
                  onClick={handleSaveBill}
                  disabled={saving}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 4,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    ml: 53
                  }}
                >
                  Save
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<Print />} 
                  onClick={handlePrint}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 4,
                    background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                    boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)'
                  }}
                >
                  Print Invoice
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BillGenerationDialog;