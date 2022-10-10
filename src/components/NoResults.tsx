import React from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

/**
 * Renders "nothing found" information 
 */
const NothingToShow: React.FC = () => {
  const theme = useTheme();
  return (
    <Box textAlign="center">
      <SentimentVeryDissatisfiedIcon sx={{ color: theme.palette.grey[300], fontSize:"10rem" }} />
      <Typography component="div" variant="h1" sx={{ color: theme.palette.grey[300] }}>Nothing to show</Typography>
    </Box>
  );

}

export default NothingToShow;