import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux'
import { useMutation, useQueryClient } from "react-query";

import { useTheme } from '@mui/material/styles';
import { TextField, Button, Typography, Dialog, DialogActions, DialogContent } from '@mui/material';

import { notify } from '../../assets/notifications';
import { addTodo } from '../../assets/apiFetcher';
import { store } from '../../store/store';
import { addedTodoReducer } from '../../store/todosSlice';

/**
 * Renders add new todo button 
 */
const AddNewTodo: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const queryClient = useQueryClient();
  
  // state of opened add new todo form
  const [opened, setOpened] = useState(false);

  /** Input field reference to set new todo name */
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  // Mutate todo add function, displayed is notification message until promise resolved
  const { mutateAsync: mutateAsyncAddTodo } = useMutation(addTodo, {
    // invalidate query after thrown api error to refetch correct data in dashboard, 
    // error message displayed in notification
    onError: () => queryClient.invalidateQueries('todos')
  });

  /**
   * Get data for new todo list
   * 
   * @param name name of new todo list
   * @returns data of new todo list
   */
  const getNewTodoData = (name: string): { title: string, items: [] } => {
    return {
      title: name,
      items: [],
    }
  }

  /**
   * Handle adding of new todo list
   */
  const handleInsert = () => {

    if( newTodoInputRef.current === null ) return;

    if (newTodoInputRef.current.value === "") {
      newTodoInputRef.current.focus();
      return null;
    }
    
    // close add new todo form
    setOpened(false);

    // add new todo and display appropriate message
    // wait for api response as we need to know todo ID defined in db, ID is used in react router
    const name = newTodoInputRef.current.value;
    const promise = mutateAsyncAddTodo(getNewTodoData(name))
      .then((newTodoData) => {
        // update `allTodos` state to display current todos
        dispatch(addedTodoReducer({ allTodos: store.getState().todos.allTodos, todoData: newTodoData }));
      });

    notify('add', name, promise);

    newTodoInputRef.current.value = "";
  }

  return (
    <>
      <Button variant="contained" onClick={() => setOpened(true)} >Add new list</Button>
      <Dialog maxWidth="sm" open={opened} onClose={() => setOpened(false)} fullWidth>
        <DialogContent>
          <Typography color="primary" component="div" variant="h6" sx={{ mb: theme.spacing(2) }} >Name your new list</Typography>
          <TextField
            variant="outlined"
            size="small"
            inputRef={newTodoInputRef}
            sx={{ width: "100%" }}
            autoFocus
            inputProps={{ autoComplete: "off" }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleInsert} >Insert</Button>
          <Button onClick={() => setOpened(false)} sx={{ color: theme.palette.grey[500] }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddNewTodo;