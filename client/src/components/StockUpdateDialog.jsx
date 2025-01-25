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
  Divider
} from '@mui/material';
import { Close, Inventory2 } from '@mui/icons-material';

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

  const handleClose = () => {
    setStockUpdateDialog(false);
    setSelectedProduct(null);
    setNewStockValue('');
  };

  return (
    <Dialog 
      open={stockUpdateDialog} 
      onClose={handleClose}
      maxWidth="xs"
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
          onClick={handleUpdateStock}
          variant="contained"
          disabled={!newStockValue}
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