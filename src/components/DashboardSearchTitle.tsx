import React from 'react';
import { useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

import type { RootState } from '../store/store';

/**
 * Renders search title in dashboard with information about found results
 * 
 * @param props component properties
 * * `todos` - number of found todos
 * * `items` - number of found todo items
 */
const DashboardSearchTitle: React.FC<{ todos: number, items: number }> = (props) => {
  const theme = useTheme();
  const { todos, items } = props;
  const searchTerm = useSelector<RootState, string>((state) => state.todos.searchTerm);

  let subtitle = `Keyword found in ${todos} ` + (todos === 1 ? "todo" : "todos");
  if (items > 0) {
    subtitle += ` including ${items} ` + (items === 1 ? "item" : "items");
  }
  return (
    <Box sx={{ m: theme.spacing(4, 0) }}>
      <Typography color="primary" variant="h2" >Search results for: {searchTerm}</Typography>
      {(todos !== 0 || items !== 0) && <Typography color="primary">{subtitle}</Typography>}
    </Box>
  );

}

export default DashboardSearchTitle;