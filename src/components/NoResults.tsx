import React, { useEffect, useState } from 'react';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
/**
 * Renders "nothing found" information 
 */
const NothingToShow: React.FC<{ text?: string, options?: { items: number, filter: string } }> = ({ text = "Nothing to show", options = null }) => {
  const theme = useTheme();
  const [iconType, setIconType] = useState("sad");
  const [title, setTitle] = useState(text);

  const icons = {
    sad: <SentimentVeryDissatisfiedIcon sx={{ color: theme.palette.grey[300], fontSize: "10rem" }} />,
    happy: <SentimentSatisfiedAltIcon sx={{ color: theme.palette.grey[300], fontSize: "10rem" }} />,
  };

  useEffect(() => {
    if (options && options.items === 0) {
      switch (options.filter) {
        case "missed":
          setIconType("happy");
          setTitle("Great, no missed items!!");
          break;
        case "finished":
          setIconType("sad");
          setTitle("There's no one finished item");
          break;
        default:
          break;
      }
    }
  }, [options]);


  return (
    <Box textAlign="center">
      {icons[iconType as keyof typeof icons]}
      <Typography component="div" variant="h1" sx={{ color: theme.palette.grey[300] }}>{title}</Typography>
    </Box>
  );

}

export default NothingToShow;