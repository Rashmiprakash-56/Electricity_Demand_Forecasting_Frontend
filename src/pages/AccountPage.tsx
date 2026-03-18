import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  Avatar,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  AccountCircle as AccountIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  VpnKey as KeyIcon,
} from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  name: string;
}

const AccountPage: React.FC = () => {
  // Mock user data - replace with actual user data from your auth system
  const [user] = useState<User>({
    email: 'user@example.com',
    name: 'John Doe',
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate()

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleResetPassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setSnackbarMessage('Please fill in all fields');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setSnackbarMessage('New passwords do not match');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (newPassword.length < 8) {
      setSnackbarMessage('Password must be at least 8 characters');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      // TODO: Replace with actual API call to reset password
      // const response = await fetch('/api/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ currentPassword, newPassword }),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSnackbarMessage('Password reset successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseDialog();
    } catch (error) {
      setSnackbarMessage('Failed to reset password. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

return (
  <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: 4 }}>
    <Container maxWidth="md">
      {/* Back to Dashboard Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{
          mb: 3,
          color: 'text.secondary',
          '&:hover': {
            bgcolor: 'background.paper',
          },
        }}
      >
        Back to Dashboard
      </Button>

      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.25)',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AccountIcon sx={{ fontSize: 36 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Account Settings
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
              Manage your account information and security
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Profile Section */}
      <Card 
        sx={{ 
          mb: 3,
          borderRadius: 3,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" fontWeight="600">
              Profile Information
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          <Stack spacing={4}>
            {/* Avatar and Name */}
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar
                sx={{
                  width: 88,
                  height: 88,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 14px rgba(102, 126, 234, 0.3)',
                }}
              >
                {getInitials(user.name)}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="600" gutterBottom>
                  {user.name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Active Account
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            {/* Email */}
            <Box
              sx={{
                bgcolor: 'grey.50',
                borderRadius: 2,
                p: 2.5,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                <EmailIcon color="primary" fontSize="small" />
                <Typography variant="body2" color="text.secondary" fontWeight="600">
                  Email Address
                </Typography>
              </Stack>
              <Typography variant="body1" fontWeight="500" sx={{ pl: 4 }}>
                {user.email}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Security
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              bgcolor: 'grey.50',
              borderRadius: 2,
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              <LockIcon color="primary" fontSize="small" />
              <Typography variant="body1" fontWeight="600">
                Password
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Keep your account secure by using a strong password and updating it regularly.
            </Typography>

            <Button
              variant="contained"
              startIcon={<KeyIcon />}
              onClick={handleOpenDialog}
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                },
              }}
            >
              Reset Password
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Reset Password Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                bgcolor: 'primary.lighter',
                borderRadius: 1.5,
                p: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <KeyIcon color="primary" />
            </Box>
            <Typography variant="h6" fontWeight="600">
              Reset Password
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText sx={{ mb: 3 }}>
            Enter your current password and choose a new password. Your new password must be at least 8 characters long.
          </DialogContentText>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              helperText="Minimum 8 characters"
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined"
            color="inherit"
            size="large"
          >
            Cancel
          </Button>
          <Button
            onClick={handleResetPassword}
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              minWidth: 140,
            }}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  </Box>
);
};

export default AccountPage;