import React from 'react';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

import { FiltersCountType, TodoType } from '../../assets/types';

/**
 * Renders title section on todo page
 */
const Title: React.FC<{ todo: TodoType | undefined }> = ({ todo }) => {
  const theme = useTheme();
  const filter = useSelector<RootState, string>((state) => state.todos.filter);
  const filterCounts = useSelector<RootState, FiltersCountType>((state) => state.todos.filterCounts);

  type FilterCountsKey = keyof typeof filterCounts;
  const currentCount = filterCounts[filter as FilterCountsKey];

  return todo !== undefined
    ? <Box>
      <Typography color="primary" variant="h1">{todo.title}</Typography>
      <Typography color="primary" sx={{ textTransform: "capitalize", mb: theme.spacing(4) }}>{filter} items: {currentCount}</Typography>
    </Box>
    : null;

}

export default Title;