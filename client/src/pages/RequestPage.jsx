/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  useTheme,
  alpha,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Business, Send, ArrowBack } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequestPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    email: '',
    phone: '',
    description: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const industries = [
    'Retail',
    'Manufacturing',
    'Wholesale',
    'Restaurant',
    'Healthcare',
    'Technology',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5017/api/request', formData);
      if (response.status === 201) {
        setSuccess(true);
        setOpenDialog(true);
        setTimeout(() => {
          setOpenDialog(false);
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      setError('Failed to submit request. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{
          mb: 3,
          textTransform: 'none',
          color: theme.palette.text.secondary,
          '&:hover': {
            color: theme.palette.primary.main,
            bgcolor: alpha(theme.palette.primary.main, 0.1)
          }
        }}
      >
        Back to Login
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          background: `linear-gradient(to bottom right, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.95)})`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`
        }}
      >
        <Stack spacing={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 2,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                mb: 3
              }}
            >
              <Business sx={{ fontSize: 40, color: theme.palette.primary.main }} />
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Request Business Access
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tell us about your business to get started with our inventory management system
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              Request submitted successfully! Redirecting...
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                variant="outlined"
              />

              <TextField
                select
                fullWidth
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                variant="outlined"
              >
                {industries.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Business Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Business Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
                variant="outlined"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                endIcon={<Send />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                  }
                }}
              >
                Submit Request
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>

      <Dialog 
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={600}>
            Request Submitted Successfully!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" textAlign="center">
            Thank you for your interest. We will review your request and notify you soon through email at {formData.email}.
          </Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default RequestPage;
