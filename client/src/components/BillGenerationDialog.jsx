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
  Paper
} from '@mui/material';
import { Close, Receipt, Print } from '@mui/icons-material';

const BillGenerationDialog = ({ 
  billDialog, 
  selectedProduct, 
  saleQuantity, 
  setBillDialog, 
  setSelectedProduct, 
  setSaleQuantity, 
  handleGenerateBill 
}) => {
  const [showBillDialog, setShowBillDialog] = useState(false);
  const [billNumber] = useState(`BILL-${Date.now()}-${Math.floor(Math.random() * 1000)}`); 
  const [billDetails, setBillDetails] = useState(null);
  const [vendorName, setVendorName] = useState(''); 
  const [paymentType, setPaymentType] = useState('paid'); 

  const handleCloseBillDialog = () => {
    setShowBillDialog(false);
    setBillDetails(null);
    setVendorName(''); 
    setPaymentType('paid'); 
  };

  const handleGenerateBillClick = () => {
    if (!selectedProduct || !saleQuantity || !vendorName) {
      return; // Early return if required fields are missing
    }

    const quantity = parseInt(saleQuantity);
    const total = Math.floor(selectedProduct.price * quantity);
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
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Generate Bill</Typography>
            <IconButton
              onClick={() => {
                setBillDialog(false);
                setSelectedProduct(null);
                setSaleQuantity('');
              }}
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Product"
              value={selectedProduct?.name || ''}
              disabled
              fullWidth
            />
            <TextField
              label="Available Stock"
              value={selectedProduct?.stock || ''}
              disabled
              fullWidth
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
            />
            <TextField
              label="Vendor Name" 
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              fullWidth
              required
              error={!vendorName}
              helperText={!vendorName ? "Vendor name is required" : ""}
            />
            <TextField
              label="Payment Type" 
              select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              fullWidth
              SelectProps={{
                native: true,
              }}
            >
              <option value="paid">Paid</option>
              <option value="due">Due</option>
            </TextField>
            {saleQuantity && selectedProduct && (
              <Typography variant="h6" align="right">
                Total: ₹{totalAmount > 0 ? totalAmount.toLocaleString() : '0'} 
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setBillDialog(false);
              setSelectedProduct(null);
              setSaleQuantity('');
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleGenerateBillClick}
            variant="contained"
            disabled={!saleQuantity || !vendorName ||
              (selectedProduct && parseInt(saleQuantity) > selectedProduct.stock)}
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
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            p: 3,
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}
        >
          <Box display="flex" alignItems="center">
            <Receipt sx={{ mr: 2 }} />
            Sales Invoice
          </Box>
          <Typography variant="subtitle1">
            Bill No: {billNumber}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {billDetails && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Product Details
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{billDetails.product.name}</TableCell>
                        <TableCell>{billDetails.product.sku}</TableCell>
                        <TableCell align="right">₹{Math.ceil(selectedProduct.price)}</TableCell> 
                        <TableCell align="right">{billDetails.quantity}</TableCell>
                        <TableCell align="right">₹{billDetails.total}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mb: 3,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2
              }}>
                <Typography variant="subtitle1">Date: {currentDate}</Typography>
                <Typography variant="h6">Total Amount: ₹{parseFloat(billDetails.total).toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button 
                  variant="contained" 
                  onClick={handleCloseBillDialog}
                  color="secondary"
                >
                  Close
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<Print />} 
                  onClick={handlePrint}
                  sx={{
                    bgcolor: 'success.main',
                    '&:hover': {
                      bgcolor: 'success.dark'
                    }
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