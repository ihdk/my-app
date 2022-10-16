import React from 'react';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setAddingNewItemReducer, setFilterReducer } from '../../store/todosSlice';

import { FiltersCountType } from '../../assets/types';

/**
 * Renders toolbar section with filter and add new todo item button
 */
const Toolbar: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const filter = useSelector<RootState, string>((state) => state.todos.filter);
  const filterCounts = useSelector<RootState, FiltersCountType>((state) => state.todos.filterCounts);


  /**
   * Handle change of todo items state `filter`
   * 
   * @param e mouse event
   * @param value value of selected todo items state `filter`
   */
  const handleFilterChange = (e: React.MouseEvent, value: string | null) => {
    dispatch(setFilterReducer(value == null ? "all" : value))
  };


  /**
   * Handle change of `addingNewItem` global state to decide if display new item form
   */
  const handleAddingNewItem = () => {
    dispatch(setAddingNewItemReducer(true))
  }


  return (
    <Box sx={{ mb: theme.spacing(4) }}>
      <Grid container spacing={{ xs: 2, md: 1 }}>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" onClick={handleAddingNewItem} sx={{ [theme.breakpoints.down('sm')]: { width: '100%' } }}>Add new item</Button>
        </Grid>
        <Grid item xs={12} sm={8} sx={{ textAlign: "right", [theme.breakpoints.down('sm')]: { textAlign: "center" } }}>
          <ToggleButtonGroup
            size="small"
            color="primary"
            value={filter}
            onChange={handleFilterChange}
            exclusive
          >
            <ToggleButton value="all">All ({filterCounts.all})</ToggleButton>
            <ToggleButton value="active">Active ({filterCounts.active})</ToggleButton>
            <ToggleButton value="finished" color="success">Finished ({filterCounts.finished})</ToggleButton>
            <ToggleButton value="missed" color="error">Missed ({filterCounts.missed})</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <Divider sx={{ mt: theme.spacing(4) }} />
    </Box>
  )

}

export default Toolbar;
