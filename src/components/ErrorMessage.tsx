import React from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * Renders error message when data fetching failed
 */
const ErrorMessage: React.FC<{message: string}> = ({ message }) => {
  return <Box><Alert severity="error"><Typography>{message}</Typography></Alert></Box>
}

export default ErrorMessage;