import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useMatch, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';

import Title from './components/todo-page/Title';
import Toolbar from './components/todo-page/Toolbar';
import Loader from './components/Loader';
import Item from './components/items/Item';
import NothingToShow from './components/NoResults';
import ErrorMessage from './components/ErrorMessage';
import { useGetTodo, } from './assets/apiFetcher';
import { getFilteredItems, getNewItemData } from './assets/helpers';
import { RootState } from './store/store';
import { setAllItemsReducer, setFilterReducer, setFiltersCountReducer } from './store/todosSlice';

import type { ItemType } from './assets/types';

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
const TodoPage: React.FC = () => {
  const dispatch = useDispatch();
  const match = useMatch('/todo/:id');
  const paramState = useFilterParamFromUrl();
  const todoId = match !== null && match.params.id !== undefined ? parseInt(match.params.id) : -1;
  const allItems = useSelector<RootState, ItemType[]>((state) => state.todos.allItems);
  const filter = useSelector<RootState, string>((state) => state.todos.filter);

  /** Check if new todo item form should be displayed */
  const addingNewItem = useSelector<RootState, boolean>((state) => state.todos.addingNewItem);

  const { data: todo, error, isError, isLoading, isSuccess, isRefetching } = useGetTodo(todoId);

  // Set current filter to global state on page load
  useEffect(() => {
    dispatch(setFilterReducer(paramState && ['all', 'active', 'finished', 'missed'].includes(paramState) ? paramState : "all"))
  }, [dispatch, paramState]); // satisfy Eslint warning missing deps ? maybe should be used empty array per docs

  // Set needed data to global states
  useEffect(() => {
    if (isSuccess) {
      dispatch(setAllItemsReducer(todo.items));
      dispatch(setFiltersCountReducer());
    }
  }, [todo, dispatch, isSuccess]); // satisfy Eslint warning missing deps? included also dispatch and isSuccess

  // Update list with current data after query invalidation
  useEffect(() => {
    if (isSuccess && isRefetching) {
      dispatch(setAllItemsReducer(todo.items));
    }
  });

  /**
   * Main section with listed todo items
   */
  const Screen: React.FC = () => {
    if (isLoading) {
      return <Loader />
    }

    if (isError && error instanceof Error) {
      return <ErrorMessage message={error.message} />
    }

    if (isSuccess && todo !== undefined) {
      const filteredItems = getFilteredItems(allItems, filter);

      if (filteredItems.length === 0) {
        return addingNewItem === false
          ? <NothingToShow options={{items: filteredItems.length, filter: filter}} />
          : <Item data={getNewItemData()} todo={todo} newItem />
      }

      return (
        <Box>
          {addingNewItem && <Item data={getNewItemData()} todo={todo} newItem />}
          {Object.values(filteredItems).map((item) => <Item key={item.id} data={item} todo={todo} />)}
        </Box>
      )

    } else {
      return null;
    }
  }

  return (
    <Box component="main">
      <Toolbar />
      <Title todo={todo} />
      <Screen />
    </Box>
  );

}


export default TodoPage;