import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import GroupsIcon from '@mui/icons-material/Groups';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useMutation } from '@apollo/client';
import { CREATE_READING_GROUP } from '../../GraphQl/Mutations';
import { LOAD_READING_GROUPS } from '../../GraphQl/Queries';
import { AGE_LEVEL_TIERS, AgeLevelTier } from '../../utils/ageLevelLadder';

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (groupName: string) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ open, onClose, onSuccess }) => {
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(1); // Default: 4-5 yrs (Level B)
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [createGroupMutation, { loading }] = useMutation(CREATE_READING_GROUP, {
    refetchQueries: [{ query: LOAD_READING_GROUPS }],
  });

  const selectedTier: AgeLevelTier = AGE_LEVEL_TIERS[selectedTierIndex];

  const handleTierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = Number(e.target.value);
    setSelectedTierIndex(idx);
    const tier = AGE_LEVEL_TIERS[idx];
    if (!name || AGE_LEVEL_TIERS.some((t) => name.includes(t.stageName))) {
      setName(`${tier.stageName} Group`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter a name for the reading group.');
      return;
    }

    setErrorMsg(null);
    try {
      await createGroupMutation({
        variables: {
          name: name.trim(),
          minAge: selectedTier.minAge,
          maxAge: selectedTier.maxAge,
          readingLevel: selectedTier.readingLevel,
          description: description.trim() || undefined,
        },
      });

      if (onSuccess) {
        onSuccess(name.trim());
      }
      setName('');
      setDescription('');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create reading group.';
      setErrorMsg(msg);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: '#5ACCCC',
              color: '#ffffff',
            }}
          >
            <GroupsIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#335C6E' }}>
              Create New Reading Group
            </Typography>
            <Typography variant="caption" sx={{ color: '#7b95a2' }}>
              Age and reading level coincide automatically
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          {/* Age Bracket Selector */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#335C6E', mb: 1 }}>
              Target Age Bracket & Reading Level
            </Typography>
            <TextField
              select
              fullWidth
              label="Select Age Tier"
              value={selectedTierIndex}
              onChange={handleTierChange}
              size="small"
            >
              {AGE_LEVEL_TIERS.map((tier, index) => (
                <MenuItem key={tier.readingLevel} value={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>
                      <strong>{tier.ageRangeLabel}</strong> — {tier.stageName}
                    </span>
                    <Chip
                      label={`Level ${tier.readingLevel}`}
                      size="small"
                      sx={{
                        backgroundColor: '#e6f7f7',
                        color: '#28B8B8',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Coincidence Info Banner */}
          <Alert
            severity="info"
            icon={<AutoAwesomeIcon sx={{ color: '#28B8B8' }} />}
            sx={{
              backgroundColor: '#eefaf9',
              border: '1px solid #c7f0ec',
              color: '#335C6E',
              '& .MuiAlert-message': { width: '100%' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Coinciding Level: Level {selectedTier.readingLevel} ({selectedTier.stageName})
              </Typography>
              <Chip
                label={`${selectedTier.ageRangeLabel} ➔ Level ${selectedTier.readingLevel}`}
                size="small"
                sx={{
                  backgroundColor: '#28B8B8',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: '#567d8d', display: 'block', mt: 0.5 }}>
              Books assigned to this group will align with Level {selectedTier.readingLevel}. Students aged {selectedTier.ageRangeLabel} will automatically be recommended for this group.
            </Typography>
          </Alert>

          {/* Group Name */}
          <TextField
            label="Reading Group Name"
            placeholder="e.g. Early Explorers"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            size="small"
          />

          {/* Description */}
          <TextField
            label="Description & Learning Goals (Optional)"
            placeholder="e.g. Focus on sight words, phonics adventures, and picture stories..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            size="small"
          />
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={onClose} sx={{ color: '#7b95a2', textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !name.trim()}
            sx={{
              backgroundColor: '#5ACCCC',
              color: '#ffffff',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              '&:hover': { backgroundColor: '#28B8B8' },
            }}
          >
            {loading ? 'Creating Group...' : 'Create Group'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateGroupModal;
