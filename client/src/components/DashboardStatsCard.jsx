/* eslint-disable react/prop-types */

import { 
  Grid, 
  Card, 
  Stack, 
  Typography, 
  Avatar, 
  useTheme, 
  alpha 
} from '@mui/material';
import { 
  Inventory2, 
  LocalShipping, 
  AttachMoney, 
  BarChart, 
  TrendingUp, 
  TrendingDown 
} from '@mui/icons-material';

const DashboardStatsCards = ({ 
  inventory, 
  lowStockItems, 
  totalValue, 
  stockTrend 
}) => {
  const theme = useTheme();

  //PHP FORMAT
  const formatValue = (value) => {
    if (value >= 1e7) {
      return `${(value / 1e7).toFixed(2)}Cr`;
    } else if (value >= 1e5) {
      return `${(value / 1e5).toFixed(2)}L`;
    }
    return value.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
  };  

  const statsConfig = [
    {
      icon: <Inventory2 />,
      title: 'Total Products',
      value: inventory.length,
      subtitle: `Across ${new Set(inventory.map(item => item.category)).size} categories`,
      color: 'primary',
      bgColor: alpha(theme.palette.primary.main, 0.12)
    },
    {
      icon: <LocalShipping />,
      title: 'Low Stock Items',
      value: lowStockItems.length,
      subtitle: 'Require immediate attention',
      color: 'warning',
      bgColor: alpha(theme.palette.warning.light, 0.12)
    },
    {
      icon: <AttachMoney />,
      title: 'Total Stock Value',
      value: formatValue(totalValue),
      subtitle: `${Math.abs(stockTrend)}% from last month`,
      color: 'success',
      bgColor: alpha(theme.palette.success.light, 0.12),
      trend: stockTrend
    },
    {
      icon: <BarChart />,
      title: 'Average Stock Level',
      value: Math.round(inventory.reduce((acc, item) => acc + item.stock, 0) / inventory.length),
      subtitle: 'Units per product',
      color: 'info',
      bgColor: alpha(theme.palette.info.light, 0.12)
    }
  ];

  return (
    <Grid container spacing={2}> 
      {statsConfig.map((stat, index) => (
        <Grid item xs={12} md={3} key={index}>
          <Card
            elevation={0}
            sx={{
              p: 2, 
              borderRadius: 4,
              bgcolor: stat.bgColor,
              border: `1px solid ${alpha(theme.palette[stat.color].main, 0.24)}`,
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8]
              }
            }}
          >
            <Stack spacing={2}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette[stat.color].main, 0.24),
                  color: `${stat.color}.main`,
                  width: 40, 
                  height: 40
                }}
              >
                {stat.icon}
              </Avatar>

              <Stack spacing={0.5}>
                <Typography color={`${stat.color}.darker`} variant="overline">
                  {stat.title}
                </Typography>
                <Typography 
                  variant={"h4"} 
                  fontWeight={700} 
                  color={`${stat.color}.darker`}
                >
                  {stat.value}
                </Typography>
                {stat.trend !== undefined ? (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {stat.trend >= 0 ? 
                      <TrendingUp color="success" sx={{ fontSize: 16 }} /> : 
                      <TrendingDown color="error" sx={{ fontSize: 16 }} />
                    }
                    <Typography variant="subtitle2" color={`${stat.color}.darker`}>
                      {stat.subtitle}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography variant="subtitle2" color={`${stat.color}.darker`}>
                    {stat.subtitle}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStatsCards;