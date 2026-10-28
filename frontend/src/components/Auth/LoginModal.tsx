import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import FaceIcon from '@mui/icons-material/Face';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../GraphQl/Mutations';
import { useAuth } from '../../context/AuthContext';
import { DEMO_PERSONAS } from '../../context/demoPersonas';
import { User } from '../../types';
import { getTierByAge } from '../../utils/ageLevelLadder';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const { currentUser, switchPersona } = useAuth();
  const [emailInput, setEmailInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION);

  const handleSelectPersona = (persona: User) => {
    switchPersona(persona);
    onClose();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setErrorMessage(null);
    try {
      const response = await loginMutation({
        variables: { email: emailInput.trim() },
      });
      if (response.data?.login) {
        switchPersona(response.data.login);
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'User login failed.';
      setErrorMessage(msg);
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
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 2,
              backgroundColor: '#5ACCCC',
              color: '#ffffff',
            }}
          >
            <AutoStoriesIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#335C6E' }}>
              Switch User Persona
            </Typography>
            <Typography variant="caption" sx={{ color: '#7b95a2' }}>
              Test both Teacher and Student dashboards with 1-click
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Close modal">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {/* Section: Teachers */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 800,
            color: '#335C6E',
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
            mb: 1.5,
          }}
        >
          <SchoolIcon fontSize="small" sx={{ color: '#5ACCCC' }} />
          Teacher Accounts (Dashboard & Group Management)
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
          {DEMO_PERSONAS.filter((p) => p.role === 'TEACHER').map((persona) => {
            const isSelected = currentUser?.id === persona.id;
            return (
              <Box
                key={persona.id}
                onClick={() => handleSelectPersona(persona)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: 2,
                  border: isSelected ? '2px solid #5ACCCC' : '1px solid #e2ecf0',
                  backgroundColor: isSelected ? '#f0fbfb' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#5ACCCC',
                    backgroundColor: '#f7fdfd',
                    transform: 'translateX(3px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar src={persona.avatarUrl} alt={persona.name} sx={{ width: 42, height: 42 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#335C6E' }}>
                      {persona.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#7b95a2' }}>
                      {persona.email}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={isSelected ? 'Active Teacher' : 'Select'}
                  size="small"
                  color={isSelected ? 'primary' : 'default'}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    backgroundColor: isSelected ? '#5ACCCC' : undefined,
                    color: isSelected ? '#ffffff' : '#335C6E',
                  }}
                />
              </Box>
            );
          })}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Section: Students with Age and Coinciding Level */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 800,
            color: '#335C6E',
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
            mb: 1.5,
          }}
        >
          <FaceIcon fontSize="small" sx={{ color: '#F76434' }} />
          Student Accounts (Age & Reading Level Coincidence)
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
          {DEMO_PERSONAS.filter((p) => p.role === 'STUDENT').map((persona) => {
            const isSelected = currentUser?.id === persona.id;
            const tier = persona.age ? getTierByAge(persona.age) : null;
            return (
              <Box
                key={persona.id}
                onClick={() => handleSelectPersona(persona)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: 2,
                  border: isSelected ? '2px solid #F76434' : '1px solid #e2ecf0',
                  backgroundColor: isSelected ? '#fff7f4' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#F76434',
                    backgroundColor: '#fffaf9',
                    transform: 'translateX(3px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar src={persona.avatarUrl} alt={persona.name} sx={{ width: 42, height: 42 }} />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#335C6E' }}>
                        {persona.name}
                      </Typography>
                      {persona.age && (
                        <Chip
                          label={`Age ${persona.age}`}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            backgroundColor: '#fff0eb',
                            color: '#F76434',
                          }}
                        />
                      )}
                      {tier && (
                        <Chip
                          label={`Level ${tier.readingLevel}`}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            backgroundColor: '#e6f7f7',
                            color: '#28B8B8',
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: '#7b95a2' }}>
                      {tier?.stageName} • {persona.email}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={isSelected ? 'Active Student' : 'Select'}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    backgroundColor: isSelected ? '#F76434' : undefined,
                    color: isSelected ? '#ffffff' : '#335C6E',
                  }}
                />
              </Box>
            );
          })}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Section: Email Sign-In */}
        <Typography variant="caption" sx={{ fontWeight: 700, color: '#335C6E', display: 'block', mb: 1 }}>
          Or sign in with another email address:
        </Typography>
        <Box component="form" onSubmit={handleEmailLogin} sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. clara@ello.com or leo@student.ello.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !emailInput.trim()}
            sx={{
              backgroundColor: '#5ACCCC',
              color: '#ffffff',
              fontWeight: 700,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              '&:hover': { backgroundColor: '#28B8B8' },
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
