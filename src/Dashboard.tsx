import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Todo from './components/todos/Todo';
import Loader from './components/Loader';
import DemoData from './components/DemoData';
import ErrorMessage from './components/ErrorMessage';
import NothingToShow from './components/NoResults';
import Toolbar from './components/dashboard/Toolbar';
import SearchTitle from './components/dashboard/SearchTitle';
import { useGetTodos } from './assets/apiFetcher';
import { filterTodos } from './assets/helpers';
import type { RootState } from './store/store';
import { setAllTodosReducer } from './store/todosSlice';

import type { TodoType } from './assets/types';

/**
 * Renders dashboard page with all todos
 */
const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const allTodos = useSelector<RootState, TodoType[]>((state) => state.todos.allTodos);
  const searchTerm = useSelector<RootState, string>((state) => state.todos.searchTerm);

  // Fetch todos from api
  const { data: todos, error, isError, isLoading, isSuccess } = useGetTodos();

  // Set loaded todos to global state
  useEffect(() => {
    if (isSuccess) {
      dispatch(setAllTodosReducer(todos))
    }
  }, [todos, dispatch, isSuccess]); // satisfy Eslint warning missing deps? included also dispatch and isSuccess


  /**
    * Main section with listed todo lists
    */
  const Screen: React.FC = React.forwardRef((props, ref) => {

    if (isLoading) {
      return <Loader />
    }

    if (isError && error instanceof Error) {
      return <ErrorMessage message={error.message} />
    }

    if (isSuccess && todos !== undefined) {

      // maybe filter todos by search term
      let todosList = allTodos;
      let foundTodos = 0;
      let foundItems = 0;
      if (searchTerm !== "") {
        const filterResults = filterTodos(allTodos, searchTerm);
        todosList = filterResults.filteredTodos;
        foundTodos = filterResults.todos;
        foundItems = filterResults.items;
      }

      // list of Todos is empty
      if (Object.keys(todosList).length === 0) {
        return (
          <Box>
            {searchTerm !== "" && <SearchTitle todos={foundTodos} items={foundItems} />}
            <NothingToShow />
          </Box>
        )
      }

      return (
        <Box>
          {searchTerm !== "" && <SearchTitle todos={foundTodos} items={foundItems} />}
          <Grid container spacing={3}>
            {Object.values(todosList).reverse().map((todo) => <Todo key={todo.id} data={todo} />)}
          </Grid>
        </Box>
      )
    } else {
      return null;
    }

  })

  return (
    <Box component="main">
      <Toolbar />
      <Box sx={{ mt: theme.spacing(6) }}>
        <Screen />
      </Box>
      <DemoData />
    </Box>
  )
}

export default Dashboard;