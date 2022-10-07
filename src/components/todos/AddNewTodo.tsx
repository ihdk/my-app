import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux'
import { useMutation, useQueryClient } from "react-query";

import { useTheme } from '@mui/material/styles';
import { TextField, Button, Typography, Dialog, DialogActions, DialogContent } from '@mui/material';

import { notify } from '../../assets/notifications';
import { addTodo } from '../../assets/apiFetcher';
import { store } from '../../store/store';
import { addedTodoReducer } from '../../store/todosSlice';

const AddNewTodo = () => {
  const [opened, setOpened] = useState(false);

  const dispatch = useDispatch();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: mutateAsyncAddTodo } = useMutation(addTodo, {
    // invalidate query after thrown api error to refetch correct data in dashboard, 
    // error message displayed in notification
    onError: () => queryClient.invalidateQueries('todos')
  });

  const getNewTodoData = (name: string): { title: string, items: [] } => {
    return {
      title: name,
      items: [],
    }
  }

  const handleInsert = () => {
    if( newTodoInputRef.current === null ) return;

    if (newTodoInputRef.current.value === "") {
      newTodoInputRef.current.focus();
      return null;
    }
    
    setOpened(false);

    // async add request to api, in case of error will be invalidated query to refetch current data via api
    const promise = mutateAsyncAddTodo(getNewTodoData(newTodoInputRef.current.value))
      .then((newTodoData) => {
        dispatch(addedTodoReducer({ allTodos: store.getState().todos.allTodos, todoData: newTodoData }));
      });

    notify('add', newTodoInputRef.current.value, promise);
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
            inputProps={{ autoComplete: "off" }} // maybe just hotfix to disable autocomplete
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