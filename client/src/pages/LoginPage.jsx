import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box,
  useTheme,
  useMediaQuery,
  Stack,
  InputAdornment 
} from '@mui/material';
import axios from 'axios';
import InventoryIcon from '@mui/icons-material/Inventory';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const LoginPage = () => {
  const [loginType, setLoginType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { //test on render
        email,
        password,
        role: loginType,
      });
      localStorage.setItem('jwtToken', response.data.token);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('userRole', loginType);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
      color: 'white',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          borderRadius: '24px',
          overflow: 'hidden',
          minHeight: '650px',
          width: '100%',
          background: theme.palette.background.default,
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Left Side - Product Info */}
        <Box
          sx={{
            flex: '1 1 50%',
            p: 6,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <InventoryIcon sx={{ fontSize: 80, mb: 3 }} />
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Welcome Back to Envirotech
          </Typography>
          <Typography variant="h4" sx={{ mt: 2, fontWeight: 500 }}>
            Your all-in-one Inventory Management Solution 
          </Typography>
          <Typography variant="body1" sx={{ mt: 4, maxWidth: '80%' }}>
            Easily manage stock, generate insights, and improve your business efficiency with our cutting-edge tools.
          </Typography>
        </Box>

        {/* Right Side - Login Form */}
        <Box
          sx={{
            flex: '1 1 50%',
            p: 6,
            background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.grey[200]})`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: '400px' }}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <InputLabel id="login-type-label">Select Role</InputLabel>
              <Select
                labelId="login-type-label"
                value={loginType}
                label="Select Role"
                onChange={(e) => setLoginType(e.target.value)}
                sx={{ borderRadius: '12px' }}
              >
                <MenuItem value="user">Inventory Staff</MenuItem>
                <MenuItem value="admin">Inventory Manager</MenuItem>
              </Select>
            </FormControl>

            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3, borderRadius: '12px' }}
            />

            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 4, borderRadius: '12px' }}
            />

            <Stack spacing={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!loginType}
                sx={{
                  py: 1.8,
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                Sign In to Dashboard
              </Button>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
