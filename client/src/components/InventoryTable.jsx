/* eslint-disable react/prop-types */
import { 
  Card, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  Box, 
  Stack, 
  LinearProgress, 
  Chip, 
  Button, 
  useTheme, 
  alpha 
} from '@mui/material';
import { Receipt } from '@mui/icons-material';

const InventoryTable = ({ 
  paginatedInventory, 
  tablePage, 
  totalTablePages, 
  handleTablePrevPage, 
  handleTableNextPage, 
  setSelectedProduct, 
  setStockUpdateDialog, 
  setBillDialog, 
  getStockPercentage 
}) => {
  const theme = useTheme();

  const getStockColor = (stock, lowStockThreshold) => 
    stock < lowStockThreshold ? theme.palette.error.main : theme.palette.success.main;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
        overflow: 'hidden'
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
              <TableCell sx={{ py: 3, fontWeight: 600 }}>Product Name</TableCell>
              <TableCell sx={{ py: 3, fontWeight: 600 }}>SKU</TableCell>
              <TableCell sx={{ py: 3, fontWeight: 600 }}>Category</TableCell>
              <TableCell align="right" sx={{ py: 3, fontWeight: 600 }}>Stock Level</TableCell>
              <TableCell align="right" sx={{ py: 3, fontWeight: 600 }}>Price</TableCell>
              <TableCell sx={{ py: 3, fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ py: 3, fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedInventory.map((item) => (
              <TableRow 
                key={item.id}
                hover
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  transition: 'background-color 0.2s'
                }}
              >
                <TableCell sx={{ py: 2.5, fontWeight: 500 }}>{item.name}</TableCell>
                <TableCell sx={{ py: 2.5 }}>{item.sku}</TableCell>
                <TableCell sx={{ py: 2.5 }}>
                  <Chip 
                    label={item.category} 
                    size="small"
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      color: 'primary.main',
                      fontWeight: 600,
                      px: 1
                    }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ py: 2.5 }}>
                  <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
                    <Typography variant="body2" fontWeight={500}>
                      {item.stock}
                    </Typography>
                    <Box sx={{ width: 100 }}>
                      <LinearProgress
                        variant="determinate"
                        value={getStockPercentage(item.stock, item.lowStockThreshold)}
                        sx={{ 
                          height: 6,
                          borderRadius: 3,
                          bgcolor: alpha(
                            getStockColor(item.stock, item.lowStockThreshold),
                            0.12
                          )
                        }}
                        color={item.stock < item.lowStockThreshold ? "error" : "success"}
                      />
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell align="right" sx={{ py: 2.5, fontWeight: 600 }}>₱{Math.floor(item.price)}</TableCell>
                <TableCell sx={{ py: 2.5 }}>
                  <Chip
                    label={item.stock < item.lowStockThreshold ? "Low Stock" : "In Stock"}
                    color={item.stock < item.lowStockThreshold ? "error" : "success"}
                    size="small"
                    sx={{ 
                      borderRadius: 2,
                      fontWeight: 600,
                      px: 1
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: 2.5 }}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="soft"
                      size="small"
                      onClick={() => {
                        setSelectedProduct(item);
                        setStockUpdateDialog(true);
                      }}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.16)
                        }
                      }}
                    >
                      Update Stock
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Receipt />}
                      onClick={() => {
                        setSelectedProduct(item);
                        setBillDialog(true);
                      }}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        bgcolor: theme.palette.success.main,
                        '&:hover': {
                          bgcolor: theme.palette.success.dark
                        }
                      }}
                    >
                      Generate Bill
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          py: 3,
          px: 2,
          borderTop: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="soft"
            onClick={handleTablePrevPage}
            disabled={tablePage === 0}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: 'primary.main',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.16)
              }
            }}
          >
            Previous
          </Button>

          <Typography variant="body2" color="text.secondary">
            Page {tablePage + 1} of {totalTablePages}
          </Typography>

          <Button
            variant="soft"
            onClick={handleTableNextPage}
            disabled={tablePage >= totalTablePages - 1}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: 'primary.main',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.16)
              }
            }}
          >
            Next
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default InventoryTable;