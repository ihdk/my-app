import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { useTheme } from '@mui/material/styles';
import { Box, Grid, CircularProgress, Typography, Alert } from '@mui/material';

import NothingToShow from './components/NoResults';
import Todo from './components/todos/Todo';
import DashboardToolbar from './components/DashboardToolbar';
import DemoData from './components/DemoData';
import { useGetTodos } from './assets/apiFetcher';
import { getFilteredTodos } from './assets/helpers';
import { setAllTodosReducer } from './store/todosSlice';

import type { RootState } from './store/store';
import type { TodoType } from './assets/types';

/**
 * Renders dashboard page with all todos
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  
  /** All todos stored in global state */
  const allTodos = useSelector<RootState, TodoType[]>((state) => state.todos.allTodos);

  /** Search term typed by user */
  const searchTerm = useSelector<RootState, string>((state) => state.todos.searchTerm);
  
  // Check if data loaded from api are saved in global state - prevent rendering of <Screen> component with no results message before data dispatched to `allTodos`
  const [dataDispatched, setDataDispatched] = useState(false);
  
  const { data: todos, error, isError, isLoading, isSuccess } = useGetTodos();

  // set loaded todos to global state
  useEffect(() => {
    if (isSuccess) {
      dispatch(setAllTodosReducer(todos))
      // define that data were stored in global state
      setDataDispatched(true);
    }
  }, [todos, dispatch, isSuccess])

  /**
    * Main section with listed todo lists
    */
  const Screen = () => {

    if (isLoading) {
      return <Box sx={{ textAlign: "center" }}><CircularProgress /></Box>
    }

    if (isError && error instanceof Error) {
      return <Alert severity="error"><Typography>{error.message}</Typography></Alert>
    }

    if (isSuccess && dataDispatched) {
      // simple filter of todos by search keyword
      const filteredTodos = searchTerm ? getFilteredTodos(allTodos, searchTerm) : allTodos;

      // list of Todos is empty
      if (Object.keys(filteredTodos).length === 0) {
        return <NothingToShow />
      }

      return (
        <Grid container spacing={3}>
          {Object.values(filteredTodos).reverse().map((todo) => <Todo key={todo.id} data={todo} />)}
        </Grid>
      )
    } else {
      return null;
    }

  }

  return (
    <Box component="main">
      <DashboardToolbar />
      <Box sx={{ mt: theme.spacing(6) }}>
        <Screen />
      </Box>
      <DemoData />
    </Box>
  )
}

export default Dashboard;