import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useMatch, useLocation } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import { CircularProgress, Alert, ToggleButtonGroup, ToggleButton, Typography, Grid, Box, Button, Divider } from '@mui/material';

import Item from './components/items/Item';
import NothingToShow from './components/NoResults';
import { useGetTodo, } from './assets/apiFetcher';
import { setFiltersCountReducer, setAllItemsReducer, setAddingNewItemReducer } from './store/todosSlice';

import type { RootState } from './store/store';
import type { ItemType, FiltersCountType } from './assets/types';

/**
 * Get todo items state from url parameter
 * 
 * @returns null or todo items state `filter` name
 */
const useFilterParamFromUrl = () => {
  const { search } = useLocation();
  const memo = useMemo(() => new URLSearchParams(search), [search]);
  return memo.get('state');
}

/**
 * Renders page of opened todo
 */
const TodoPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const match = useMatch('/todo/:id');

  /** Possible states of todo items ['all', 'active', 'finished', 'missed']*/
  const filterStates = ['all', 'active', 'finished', 'missed'];

  /** Parameter with state of todo items that will be displayed on page load */
  const paramState = useFilterParamFromUrl();

  // Currently selected states filter of todo items states `filter`
  const [filter, setFilter] = useState(paramState && filterStates.includes(paramState) ? paramState : 'all');

  // Check if data loaded from api are saved in global state - prevent rendering of <Screen> component with no results message before data dispatched to `allItems`
  const [dataDispatched, setDataDispatched] = useState(false);

  /** ID of currently opened todo page */
  const todoId = match !== null && match.params.id !== undefined ? match.params.id : "";

  /** All todo items of currently opened todo */
  const allItems = useSelector<RootState, ItemType[]>((state) => state.todos.allItems);

  /** Counts number of todo items for each state ['all', 'active', 'finished', 'missed'] */
  const filterCounts = useSelector<RootState, FiltersCountType>((state) => state.todos.filterCounts);

  /** Check if new todo item form should be displayed */
  const addingNewItem = useSelector<RootState, boolean>((state) => state.todos.addingNewItem);

  const { data: todo, error, isError, isLoading, isSuccess } = useGetTodo(todoId);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setAllItemsReducer(todo.items))
      dispatch(setFiltersCountReducer(todo.items))
      // define that data were stored in global state
      setDataDispatched(true);
    }
  }, [todo, dispatch, isSuccess])

  /**
   * Handle change of todo items state `filter`
   * 
   * @param e mouse event
   * @param value value of selected todo items state `filter`
   */
  const handleFilterChange = (e: React.MouseEvent, value: string | null) => {
    setFilter(value == null ? 'all' : value);
  };

  /**
   * Handle change of `addingNewItem` global state
   */
  const handleAddNewItem = () => {
    dispatch(setAddingNewItemReducer(true))
  }

  /**
    * Get default values for new todo item
    */
  const getNewItemData = () => {
    const newDate = new Date();
    // set new deadline date to tomorrow
    newDate.setDate(newDate.getDate() + 1);
    return {
      title: "",
      description: "",
      date: newDate.toString(),
      finished: false,
      id: allItems.length + 1
    }
  }

  /**
   * Filter todo items by currently selected states `filter`
   * 
   * @param items all available todo items
   * @returns filtered todo items
   */
  const getFilteredItems = (items: ItemType[]): ItemType[] => {
    switch (filter) {
      case 'all':
        return items
      case 'active':
        return items.filter((item) => {
          const afterDeadline = (Date.now() > new Date(item.date).getTime());
          return afterDeadline === false && item.finished === false;
        });
      case 'finished':
        return items.filter((item) => {
          return item.finished === true;
        });
      case 'missed':
        return items.filter((item) => {
          const afterDeadline = (Date.now() > new Date(item.date).getTime());
          return item.finished === false && afterDeadline === true;
        });
      default:
        return items;
    }
  }

  /**
    * Section to add new and filter displayed todo items
    */
  const Toolbar = () => {
    return (
      <Box sx={{ mb: theme.spacing(4) }}>
        <Grid container spacing={{ xs: 2, md: 1 }}>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" onClick={handleAddNewItem} sx={{ [theme.breakpoints.down('sm')]: { width: '100%' } }}>Add new item</Button>
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

  /**
    * Section with todo item title and additional information
    */
  const Title = () => {
    type FilterCountsKey = keyof typeof filterCounts;
    const currentCount = filterCounts[filter as FilterCountsKey];

    return isSuccess
      ? <Box>
        <Typography color="primary" variant="h1">{todo.title}</Typography>
        <Typography color="primary" sx={{ textTransform: "capitalize", mb: theme.spacing(4) }}>{filter} items: {currentCount}</Typography>
      </Box>
      : null;
  }

  /**
    * Main section with listed todo items
    */
  const Screen = () => {
    if (isLoading) {
      return <Box sx={{ textAlign: "center" }}><CircularProgress /></Box>
    }

    if (isError && error instanceof Error) {
      return <Box><Alert severity="error"><Typography>{error.message}</Typography></Alert></Box>
    }

    if (isSuccess && dataDispatched) {
      const filteredItems = getFilteredItems(allItems);
      if (filteredItems.length === 0) {
        return addingNewItem === false
          ? <NothingToShow />
          : <Grid container spacing={2}>
            <Item data={getNewItemData()} todo={todo} newItem />
          </Grid>
      }

      return (
        <Grid container spacing={2}>
          {addingNewItem && <Item data={getNewItemData()} todo={todo} newItem />}
          {Object.values(filteredItems).map((item) => <Item key={item.id} data={item} todo={todo} />)}
        </Grid>
      )

    } else {
      return null;
    }
  }

  return (
    <Box component="main">
      <Toolbar />
      <Title />
      <Screen />
    </Box>
  );

}


export default TodoPage;