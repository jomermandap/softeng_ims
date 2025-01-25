/* eslint-disable react/prop-types */
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Button, 
  Stack, 
  Typography, 
  IconButton 
} from '@mui/material';
import { Warning, Close } from '@mui/icons-material';

const LowStockAlertsDialog = ({ 
  alertsDialog, 
  lowStockItems, 
  setAlertsDialog, 
  setSelectedProduct, 
  setStockUpdateDialog 
}) => {
  return (
    <Dialog
      open={alertsDialog}
      onClose={() => setAlertsDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Low Stock Alerts</Typography>
          <IconButton onClick={() => setAlertsDialog(false)}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <List>
          {lowStockItems.map((item) => (
            <ListItem key={item.id}>
              <ListItemIcon>
                <Warning color="warning" />
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                secondary={`Current Stock: ${item.stock} | Threshold: ${item.lowStockThreshold}`}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setSelectedProduct(item);
                  setStockUpdateDialog(true);
                  setAlertsDialog(false);
                }}
              >
                Update Stock
              </Button>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default LowStockAlertsDialog;