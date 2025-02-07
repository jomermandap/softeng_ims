/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Fade,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ProductDialog = ({ open, onClose, product, onSave }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    stock: '',
    lowStockThreshold: '', 
    price: '',
    category: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        stock: product.stock || '',
        lowStockThreshold: product.lowStockThreshold || '',
        price: product.price || '',
        category: product.category || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!product) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/product/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const data = await response.json();
          onSave(data.product);
          setShowSuccess(true);
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          console.error('Failed to add product');
        }
      } catch (error) {
        console.error('Error adding product:', error);
      }
    } else {
      onSave(formData);
      onClose();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: theme.shadows[10],
            background: theme.palette.background.default,
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
          }
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            pb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h5" fontWeight={600} color="primary">
            {product ? 'Edit Product' : 'Add New Product'}
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 4 }}>
          <Box 
            component="form" 
            sx={{ 
              display: 'grid', 
              gap: 3,
              '& .MuiTextField-root': {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderWidth: '2px'
                  }
                }
              }
            }}
          >
            <TextField
              name="name"
              label="Product Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              placeholder="Enter product name"
              margin="normal"
            />

            <TextField
              name="sku"
              label="SKU"
              value={formData.sku}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              placeholder="Enter SKU"
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
              <TextField
                name="stock"
                label="Current Stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="0"
              />

              <TextField
                name="lowStockThreshold"
                label="Low Stock Alert"
                type="number"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="0"
              />
            </Box>

            <TextField
              name="price"
              label="Price"
              type="number"
              value={Math.floor(formData.price)}
              onChange={handleChange}
              required
              variant="outlined"
              placeholder="0.00"
              InputProps={{
                startAdornment: (
                  <Typography sx={{ mr: 1, color: theme.palette.text.secondary }}>
                    ₱
                  </Typography>
                )
              }}
            />

            <FormControl 
              fullWidth 
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  }
                }
              }}
            >
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value="Tables">Tables</MenuItem>
                <MenuItem value="Chairs">Chairs</MenuItem>
                <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions 
          sx={{ 
            px: 3, 
            py: 3, 
            borderTop: `1px solid ${theme.palette.divider}`,
            gap: 2
          }}
        >
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name || !formData.sku || !formData.stock || !formData.price || !formData.category}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              boxShadow: theme.shadows[2],
              '&:hover': {
                boxShadow: theme.shadows[4]
              }
            }}
          >
            {product ? 'Save Changes' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={showSuccess} 
        autoHideDuration={1500} 
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Product added successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductDialog;
