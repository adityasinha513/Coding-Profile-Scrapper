import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { profilesAPI } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

const PLATFORMS = [
  { key: 'leetcode', label: 'LeetCode Username', placeholder: 'e.g. adityasinha513' },
  { key: 'github', label: 'GitHub Username', placeholder: 'e.g. torvalds' },
  { key: 'codeforces', label: 'Codeforces Handle', placeholder: 'e.g. tourist' },
  { key: 'codechef', label: 'CodeChef Username', placeholder: 'e.g. chandravo' },
  { key: 'gfg', label: 'GeeksforGeeks Username', placeholder: 'e.g. geeksforgeeks' },
];

const EditHandlesModal = ({ open, onClose, onUpdated, darkMode }) => {
  const { user, updateUser } = useAuth();
  const [handles, setHandles] = useState({
    leetcode: '',
    github: '',
    codeforces: '',
    codechef: '',
    gfg: '',
  });
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState({});
  const [verifyStatus, setVerifyStatus] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setHandles({
        leetcode: user.handles?.leetcode || '',
        github: user.handles?.github || '',
        codeforces: user.handles?.codeforces || '',
        codechef: user.handles?.codechef || '',
        gfg: user.handles?.gfg || '',
      });
      setVerifyStatus({});
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [user, open]);

  const handleChange = (platform, value) => {
    setHandles((prev) => ({ ...prev, [platform]: value }));
    // Reset verify status for modified input
    setVerifyStatus((prev) => ({ ...prev, [platform]: null }));
  };

  const handleVerify = async (platform) => {
    const handle = handles[platform]?.trim();
    if (!handle) return;

    setVerifying((prev) => ({ ...prev, [platform]: true }));
    try {
      const data = await profilesAPI.previewHandle(platform, handle);
      if (data && !data.error) {
        setVerifyStatus((prev) => ({
          ...prev,
          [platform]: { valid: true, message: `Found: ${data.name || data.username}` },
        }));
      } else {
        setVerifyStatus((prev) => ({
          ...prev,
          [platform]: { valid: false, message: data?.error || 'User not found' },
        }));
      }
    } catch (err) {
      setVerifyStatus((prev) => ({
        ...prev,
        [platform]: { valid: false, message: 'Could not reach platform API' },
      }));
    } finally {
      setVerifying((prev) => ({ ...prev, [platform]: false }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage('');
    try {
      const res = await profilesAPI.updateHandles({ ...handles, name });
      updateUser(res.user);
      setSuccessMessage('Handles updated successfully!');
      setTimeout(() => {
        if (onUpdated) onUpdated();
        onClose();
      }, 700);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update handles');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          bgcolor: darkMode ? '#1e293b' : '#ffffff',
          color: darkMode ? '#f8fafc' : '#0f172a',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Manage Coding Profiles
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" sx={{ color: darkMode ? '#94a3b8' : '#64748b', mb: 3 }}>
          Enter your handles on competitive coding & development platforms. Click "Verify" to test your username live!
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>
            {successMessage}
          </Alert>
        )}

        {/* Display Name */}
        <TextField
          fullWidth
          label="Display Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="dense"
          size="small"
          sx={{ mb: 2 }}
        />

        {/* Platforms */}
        {PLATFORMS.map(({ key, label, placeholder }) => {
          const status = verifyStatus[key];
          const isChecking = verifying[key];

          return (
            <Box key={key} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label={label}
                  placeholder={placeholder}
                  value={handles[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  margin="dense"
                  size="small"
                  InputProps={{
                    endAdornment: status ? (
                      <InputAdornment position="end">
                        {status.valid ? (
                          <SuccessIcon sx={{ color: '#10b981', fontSize: 20 }} />
                        ) : (
                          <ErrorIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                        )}
                      </InputAdornment>
                    ) : null,
                  }}
                />
                <Button
                  variant="outlined"
                  size="medium"
                  disabled={!handles[key]?.trim() || isChecking}
                  onClick={() => handleVerify(key)}
                  sx={{
                    minWidth: 90,
                    height: 40,
                    mt: 1,
                    textTransform: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                  }}
                >
                  {isChecking ? <CircularProgress size={18} /> : 'Verify'}
                </Button>
              </Box>
              {status && (
                <Typography
                  variant="caption"
                  sx={{
                    color: status.valid ? '#10b981' : '#ef4444',
                    fontWeight: 500,
                    ml: 1,
                    display: 'block',
                  }}
                >
                  {status.message}
                </Typography>
              )}
            </Box>
          );
        })}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button onClick={onClose} sx={{ color: darkMode ? '#94a3b8' : '#64748b', textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          }}
        >
          {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditHandlesModal;
