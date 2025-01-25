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
          borderRadius: 4,
          boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
          background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
        }
      }}
    >
      <DialogTitle sx={{ pb: 3, pt: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                p: 1.5,
                borderRadius: 2,
                display: 'flex'
              }}
            >
              <Inventory sx={{ 
                color: theme.palette.primary.main,
                fontSize: 28
              }} />
            </Box>
            <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: -0.5 }}>
              Low Stock Alerts
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setAlertsDialog(false)}
            sx={{
              bgcolor: alpha(theme.palette.grey[500], 0.08),
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                transform: 'rotate(90deg)',
                transition: 'all 0.3s ease-in-out'
              }
            }}
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider sx={{ opacity: 0.5 }} />
      <DialogContent sx={{ pt: 3, pb: 4 }}>
        <List>
          {lowStockItems.map((item) => (
            <Paper
              key={item.id}
              elevation={0}
              sx={{
                mb: 2.5,
                p: 2.5,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}`,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.warning.light, 0.03),
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: alpha(theme.palette.warning.light, 0.08),
                  transform: 'translateX(4px)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.1)}`
                }
              }}
            >
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <Warning sx={{ 
                    color: theme.palette.warning.main,
                    fontSize: 28,
                    animation: 'pulse 2.5s infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 1, transform: 'scale(1)' },
                      '50%': { opacity: 0.6, transform: 'scale(0.95)' },
                      '100%': { opacity: 1, transform: 'scale(1)' }
                    }
                  }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                      {item.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: alpha(theme.palette.text.secondary, 0.85),
                          fontSize: '0.95rem'
                        }}
                      >
                        Current Stock: <Box component="span" sx={{ color: 'error.main', fontWeight: 600 }}>{item.stock}</Box>
                        {' • '}
                        Threshold: <Box component="span" sx={{ color: 'warning.main', fontWeight: 600 }}>{item.lowStockThreshold}</Box>
                      </Typography>
                    </Box>
                  }
                />
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    setSelectedProduct(item);
                    setStockUpdateDialog(true);
                    setAlertsDialog(false);
                  }}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.dark, 0.9)})`,
                    boxShadow: `0 8px 16px -4px ${alpha(theme.palette.primary.main, 0.25)}`,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 20px -4px ${alpha(theme.palette.primary.main, 0.3)}`
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