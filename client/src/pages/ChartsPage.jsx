import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  LinearProgress
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend } from 'recharts';

const ChartsPage = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5017/api/product/');
        const result = await response.json();
        if (result.success) {
          const chartData = result.data.map(product => ({
            name: product.name,
            stock: product.stock,
            price: product.price
          }));
          setData(chartData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ p: 4, backgroundColor: theme.palette.background.default }}>

      {loading ? (
        <LinearProgress sx={{ mb: 4 }} />
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card 
              sx={{ 
                boxShadow: theme.shadows[3], 
                borderRadius: 4,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[6],
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: theme.palette.primary.main }}>
                  Stock Levels Overview
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: theme.palette.text.secondary }}
                      tickLine={{ stroke: theme.palette.divider }}
                    />
                    <YAxis 
                      tick={{ fill: theme.palette.text.secondary }}
                      tickLine={{ stroke: theme.palette.divider }}
                    />
                    <ChartTooltip 
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="stock" 
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      dot={{ fill: theme.palette.primary.main, strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card 
              sx={{ 
                boxShadow: theme.shadows[3], 
                borderRadius: 4,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[6],
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: theme.palette.secondary.main }}>
                  Price Trends Analysis
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: theme.palette.text.secondary }}
                      tickLine={{ stroke: theme.palette.divider }}
                    />
                    <YAxis 
                      tick={{ fill: theme.palette.text.secondary }}
                      tickLine={{ stroke: theme.palette.divider }}
                    />
                    <ChartTooltip 
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke={theme.palette.secondary.main}
                      strokeWidth={2}
                      dot={{ fill: theme.palette.secondary.main, strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ChartsPage;