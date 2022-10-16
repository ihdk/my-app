import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';


/**
 * Renders loader while data are fetched
 */
const Loader: React.FC = () => {
  return <Box sx={{ textAlign: "center" }}><CircularProgress /></Box>
}

export default Loader;