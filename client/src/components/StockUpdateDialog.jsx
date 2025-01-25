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
  IconButton 
} from '@mui/material';
import { Close } from '@mui/icons-material';

const StockUpdateDialog = ({ 
  stockUpdateDialog, 
  selectedProduct, 
  newStockValue, 
  setStockUpdateDialog, 
  setSelectedProduct, 
  setNewStockValue, 
  handleUpdateStock 
}) => {
  return (
    <Dialog 
      open={stockUpdateDialog} 
      onClose={() => {
        setStockUpdateDialog(false);
        setSelectedProduct(null);
        setNewStockValue('');
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Update Stock</Typography>
          <IconButton
            onClick={() => {
              setStockUpdateDialog(false);
              setSelectedProduct(null);
              setNewStockValue('');
            }}
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label="Current Stock"
            value={selectedProduct?.stock || ''}
            disabled
            fullWidth
          />
          <TextField
            label="New Stock Value"
            value={newStockValue}
            onChange={(e) => setNewStockValue(e.target.value)}
            type="number"
            fullWidth
            autoFocus
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => {
            setStockUpdateDialog(false);
            setSelectedProduct(null);
            setNewStockValue('');
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleUpdateStock}
          variant="contained"
          disabled={!newStockValue}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockUpdateDialog;