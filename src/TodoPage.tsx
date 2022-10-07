import React, { useEffect, useState, useMemo  } from 'react';
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

const useFilterParamFromUrl = () => {
  const { search } = useLocation();
  const memo = useMemo( () => new URLSearchParams(search), [search] );
  return memo.get('state');
}

const TodoPage = () => {
  const paramState = useFilterParamFromUrl();
  const states = [ 'active', 'finished', 'missed' ];
  const [filter, setFilter ] = useState(paramState && states.includes(paramState) ? paramState : 'all');
  const dispatch = useDispatch();
  const theme = useTheme();
  const match = useMatch('/todo/:id');
  const todoId = match !== null && match.params.id !== undefined ? match.params.id : "";
  
  const allItems = useSelector<RootState, ItemType[]>((state) => state.todos.allItems);
  const filterCounts = useSelector<RootState, FiltersCountType>((state) => state.todos.filterCounts);
  const addingNewItem = useSelector<RootState, boolean>((state) => state.todos.addingNewItem);
  
  const { data: todo, error, isError, isLoading, isSuccess } = useGetTodo(todoId);

  // set loaded items, and information about current Todo to global state
  useEffect( () => {
    if( isSuccess ){
      dispatch(setAllItemsReducer(todo.items))
      dispatch(setFiltersCountReducer(todo.items))
    }
  }, [todo])
  
  const handleFilterChange = (e: React.MouseEvent, value: string | null) => {
    setFilter(value == null ? 'all' : value);
  };

  const handleAddNewItem = () => {
    dispatch(setAddingNewItemReducer(true))
  }

  const getNewItemData = () => {
    const newDate = new Date();
    newDate.setDate( newDate.getDate() + 1);
    return {
      title: "", 
      description: "", 
      date: newDate.toString(), 
      finished: false, 
      id: allItems.length + 1
    }
  }
  
  const getFilteredItems = (items: ItemType[]): ItemType[] => {
    switch (filter) {
      case 'all':
        return items
      case 'active':
        return items.filter( (item) => {
          const afterDeadline = ( Date.now() > new Date(item.date).getTime() );
          return afterDeadline === false && item.finished === false ;
        });
      case 'finished':
        return items.filter( (item) => {
          return item.finished === true;
        });
      case 'missed':
        return items.filter( (item) => {
          const afterDeadline = ( Date.now() > new Date(item.date).getTime() );
          return item.finished === false && afterDeadline === true ;
        });
      default:
        return items;
    }
  }
  
  const Toolbar = () => {
    return (
      <Box sx={{mb: theme.spacing(4)}}>
        <Grid container spacing={{ xs: 2, md: 1}}>
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
                  <ToggleButton value="missed"color="error">Missed ({filterCounts.missed})</ToggleButton>
                </ToggleButtonGroup>
            </Grid>
          </Grid>
          <Divider sx={{ mt: theme.spacing(4) }} />
      </Box>
    )
  }

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

  const Screen = () => {
    if(isLoading) {
      return <Box sx={{ textAlign: "center" }}><CircularProgress /></Box>
    }
    
    if(isError && error instanceof Error){
      return <Box><Alert severity="error"><Typography>{error.message}</Typography></Alert></Box>
    }
    
    // make sure allItems defined too, its null by default and dispatched later when fetched from db
    if(isSuccess && allItems !== null) {
      const filteredItems = getFilteredItems(allItems);
      if(filteredItems.length === 0){
        return addingNewItem === false
          ? <NothingToShow />
          : <Grid container spacing={2}>
              <Item data={getNewItemData()} todo={todo} newItem />
            </Grid>
      }

      return (
        <Grid container spacing={2}>
          {addingNewItem && <Item data={getNewItemData()} todo={todo} newItem /> }
          { Object.values(filteredItems).map((item) => <Item key={item.id} data={item} todo={todo} /> )}
        </Grid>
      )

    }else{
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