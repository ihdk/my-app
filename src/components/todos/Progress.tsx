import React, { useEffect, useState  } from 'react';

import { useTheme } from '@mui/material/styles';
import { CircularProgress, Typography, Box } from '@mui/material';

type Props = {
  title: string;
  min: number;
  max: number;
  color: string;
}

const Progress: React.FC<Props> = ( { title = "", min, max, color } ) => {
  const [ finalValue, setFinalValue ] = useState(0);
  const percentageValue = max === 0 ? 0 : Math.round( ( min / max ) * 100 );
  const theme = useTheme();

  useEffect(() => {
    setFinalValue(percentageValue);
  }, [percentageValue]);
  
  return (
    <>
    <Box sx={{
      display: "flex",
      justifyContent: "center"
    }}>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress 
          variant="determinate"
          disableShrink={false}
          value={100}
          sx={{ color: theme.palette.grey[200] }}
          size={80}
          thickness={6} 
        />
        <CircularProgress 
          variant="determinate"
          disableShrink={false}
          value ={finalValue}
          sx={{ color: color, position: "absolute" }}
          size={80}
          thickness={6} 
        />
        <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }} >
          <Typography variant="h6" component="div" color="text.secondary">
            {`${min}/${max}`}
          </Typography>
        </Box>
      </Box>
    </Box>
    { title && <Typography color="text.secondary" textAlign="center" sx={{ mt: theme.spacing(1) }}>{title}</Typography> }
    </>
  );

}

export default Progress;

