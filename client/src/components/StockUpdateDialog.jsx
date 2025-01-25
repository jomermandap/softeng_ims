/* eslint-disable react/prop-types */
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
  useTheme,
  alpha,
  Divider,
  Chip,
  Alert,
  Collapse
} from '@mui/material';
import { Close, Inventory2, TrendingUp, ShoppingCart } from '@mui/icons-material';
import { useState, useEffect } from 'react';

const StockUpdateDialog = ({ 
  stockUpdateDialog, 
  selectedProduct, 
  newStockValue, 
  setStockUpdateDialog, 
  setSelectedProduct, 
  setNewStockValue, 
  handleUpdateStock 
}) => {
  const theme = useTheme();
  const [recommendations, setRecommendations] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/inventory-recommendations');
        const data = await response.json();
        const productRec = data.find(rec => rec.sku === selectedProduct?.sku);
        setRecommendations(productRec);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    if (selectedProduct?.sku) {
      fetchRecommendations();
    }
  }, [selectedProduct]);

  const handleClose = () => {
    setStockUpdateDialog(false);
    setSelectedProduct(null);
    setNewStockValue('');
    setRecommendations(null);
    setShowSuccess(false);
  };

  const handleStockUpdate = async () => {
    await handleUpdateStock();
    setShowSuccess(true);
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  return (
    <Dialog 
      open={stockUpdateDialog} 
      onClose={handleClose}
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
            <Inventory2 sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h5" fontWeight={600}>
              Update Stock
            </Typography>
          </Box>
          <IconButton 
            onClick={handleClose}
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

      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={3}>
          <Collapse in={showSuccess}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Stock updated successfully for {selectedProduct?.name}
            </Alert>
          </Collapse>

          <TextField
            label="Current Stock"
            value={selectedProduct?.stock || ''}
            disabled
            fullWidth
            variant="outlined"
            InputProps={{
              sx: {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2
              }
            }}
          />

          {recommendations && (
            <Box sx={{ 
              p: 2, 
              bgcolor: alpha(theme.palette.info.main, 0.1),
              borderRadius: 2
            }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TrendingUp sx={{ color: theme.palette.info.main }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Recommendations
                  </Typography>
                </Stack>
                
                <Stack direction="row" spacing={2}>
                  <Chip
                    icon={<ShoppingCart />}
                    label={`Predicted Demand: ${Math.floor(recommendations.predicted_demand * 10) || 'N/A'} units`}
                    sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}
                  />
                  <Chip
                    icon={<TrendingUp />}
                    label={`Market Demand: ${recommendations.market_demand_score || 'N/A'}%`}
                    sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}
                  />
                </Stack>
              </Stack>
            </Box>
          )}

          <TextField
            label="New Stock Value"
            value={newStockValue}
            onChange={(e) => setNewStockValue(e.target.value)}
            type="number"
            fullWidth
            autoFocus
            variant="outlined"
            placeholder="Enter new stock value"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                }
              }
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 3, borderTop: `1px solid ${theme.palette.divider}`, gap: 2 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.1),
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleStockUpdate}
          variant="contained"
          disabled={!newStockValue || showSuccess}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1e88e5 30%, #1bb8e5 90%)',
            }
          }}
        >
          Update Stock
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockUpdateDialog;