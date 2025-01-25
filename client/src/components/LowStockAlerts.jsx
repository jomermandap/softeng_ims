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
  IconButton,
  Box,
  useTheme,
  alpha,
  Divider,
  Paper
} from '@mui/material';
import { Warning, Close, Inventory } from '@mui/icons-material';

const LowStockAlertsDialog = ({ 
  alertsDialog, 
  lowStockItems, 
  setAlertsDialog, 
  setSelectedProduct, 
  setStockUpdateDialog 
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={alertsDialog}
      onClose={() => setAlertsDialog(false)}
      maxWidth="md"
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
            <Inventory sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h5" fontWeight={600}>
              Low Stock Alerts
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setAlertsDialog(false)}
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
      <DialogContent sx={{ pt: 2 }}>
        <List>
          {lowStockItems.map((item) => (
            <Paper
              key={item.id}
              elevation={0}
              sx={{
                mb: 2,
                p: 2,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.warning.main, 0.02),
                '&:hover': {
                  bgcolor: alpha(theme.palette.warning.main, 0.05),
                }
              }}
            >
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <Warning sx={{ 
                    color: theme.palette.warning.main,
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.5 },
                      '100%': { opacity: 1 }
                    }
                  }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={500}>
                      {item.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Current Stock: <Box component="span" sx={{ color: 'error.main', fontWeight: 500 }}>{item.stock}</Box>
                        {' | '}
                        Threshold: <Box component="span" sx={{ color: 'warning.main', fontWeight: 500 }}>{item.lowStockThreshold}</Box>
                      </Typography>
                    </Box>
                  }
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setSelectedProduct(item);
                    setStockUpdateDialog(true);
                    setAlertsDialog(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                    boxShadow: `0 3px 5px 2px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Update Stock
                </Button>
              </ListItem>
            </Paper>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default LowStockAlertsDialog;