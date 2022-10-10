import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useMutation, useQueryClient } from "react-query";

import { useTheme } from '@mui/material/styles';
import { Link, Stack, TextField, Typography, Grid, Box, Button, Divider, Paper, CardActionArea } from '@mui/material';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';

import Progress from './Progress';
import { deleteTodo, editTodo } from '../../assets/apiFetcher';
import { notify } from '../../assets/notifications';
import { isAfterDeadline } from '../../assets/helpers';
import { editedTodoReducer, removedTodoReducer } from '../../store/todosSlice'

import type { RootState } from '../../store/store';
import type { TodoType } from '../../assets/types';


/**
 * Renders todo in dashboard
 * 
 * @param data todo list data
 */
const Todo: React.FC<{ data: TodoType }> = ({ data }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // check if todo is currently in edit state to decide if edit form is displayed
  const [editing, setEditing] = useState(false);

  /** All todos stored in global state */
  const allTodos = useSelector<RootState, TodoType[]>((state) => state.todos.allTodos);

  /** Input field reference to edit todo name */
  const renameTodoInputRef = useRef<HTMLInputElement>(null);

  const { title, items, id } = data;

  /** Total number of items in todo list */
  const itemsCount = items.length;

  /** Total number of finished items in todo list */
  const finishedCount = items.filter((item) => item.finished).length;

  /** Total number of items in todo list after deadline*/
  const afterDeadlineCount = items.filter((item) => isAfterDeadline(item)).length;

  // Mutate todo delete function, displayed is notification message until promise resolved
  const { mutateAsync: mutateAsyncDeleteTodo } = useMutation(deleteTodo, {
    onError: () => {
      // invalidate query after thrown api error to refetch correct data in dashboard, 
      // error message displayed in notification
      queryClient.invalidateQueries('todos')
    }
  });

  // Mutate todo edit function, displayed is notification message until promise resolved
  const { mutateAsync: mutateAsyncEditTodo } = useMutation(editTodo, {
    onError: () => {
      // invalidate query after thrown api error to refetch correct data in dashboard, 
      // error message displayed in notification
      queryClient.invalidateQueries('todos')
    }
  });

  /**
   * Handle actions to delete todo
   */
  const handleDeleteTodo = () => {
    dispatch(removedTodoReducer({ allTodos: allTodos, removeId: id }));

    // delete todo and display appropriate message
    const promise = mutateAsyncDeleteTodo(data);
    notify('delete', data.title, promise);
  }

  /**
   * Handle actions to rename todo
   */
  const handleRenameTodo = () => {
    if (renameTodoInputRef.current === null) return;

    if (renameTodoInputRef.current.value !== "") {
      /** Edited todo data */
      const newData = { ...data, title: renameTodoInputRef.current.value };
      dispatch(editedTodoReducer({ allTodos: allTodos, todoData: newData }));
      setEditing(false);

      // save data and display appropriate message
      const promise = mutateAsyncEditTodo(newData);
      notify('edit', newData.title, promise);

    } else {
      // just focus name input if todo name not defined
      renameTodoInputRef.current.focus();
    }
  }

  /**
   * Renders edit form if todo is in edit state
   */
  const EditForm: React.FC = () => {
    return (
      <Box>
        <Typography gutterBottom color="primary" component="div" variant="h6" >New list name:</Typography>
        <TextField
          hiddenLabel
          variant="outlined"
          size="small"
          defaultValue={title}
          inputRef={renameTodoInputRef}
          sx={{ fontSize: ".9rem", width: "100%", mb: theme.spacing(1) }}
          inputProps={{ autoComplete: "off" }}
        />
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={handleRenameTodo} >Save</Button>
          <Button onClick={() => setEditing(false)} sx={{ color: theme.palette.grey[500] }}>Cancel</Button>
        </Stack>
      </Box>
    )
  }

  return (
    <Grid item xs={12} md={6}>
      <Paper elevation={3} sx={{ height: "100%", p: theme.spacing(1, 2) }}>
        <Stack
          direction="column"
          spacing={1}
          sx={{ justifyContent: editing ? "center" : "space-between", height: "100%" }}
        >
          {editing
            ? <EditForm />
            : <>
              <Box>
                <Link
                  underline="none"
                  color="inherit"
                  href={`/todo/${data.id}`}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", m: theme.spacing(1, 0) }}>
                    <SpeakerNotesIcon fontSize="medium" sx={{ color: theme.palette.primary.main }} />
                    <Typography component="h2" variant="h6" color="primary" >{title}</Typography>
                  </Stack>
                </Link>
                <Divider sx={{ mt: theme.spacing(1) }} />
              </Box>
              <Box>
                {itemsCount > 0
                  ?
                  <Grid container spacing={1} >
                    <Grid item xs={4} >
                      <CardActionArea>
                        <Box sx={{ m: theme.spacing(2, 0) }}>
                          <Link underline="none" color="inherit" href={`/todo/${data.id}?state=finished`} >
                            <Progress title={"Finished"} min={finishedCount} max={itemsCount} color={theme.palette.success.light} />
                          </Link>
                        </Box>
                      </CardActionArea>
                    </Grid>
                    <Grid item xs={4}>
                      <CardActionArea>
                        <Box sx={{ m: theme.spacing(2, 0) }}>
                          <Link underline="none" color="inherit" href={`/todo/${data.id}?state=missed`}>
                            <Progress title={"Missed"} min={afterDeadlineCount} max={itemsCount} color={theme.palette.error.light} />
                          </Link>
                        </Box>
                      </CardActionArea>
                    </Grid>
                    <Grid item xs={4}>
                      <CardActionArea>
                        <Box sx={{ m: theme.spacing(2, 0) }}>
                          <Link underline="none" color="inherit" href={`/todo/${data.id}`}>
                            <Typography textAlign="center" color="text.secondary" lineHeight="80px" fontSize={55} component="div" >{itemsCount}</Typography>
                            <Typography textAlign="center" color="text.secondary" sx={{ mt: theme.spacing(1) }}>{itemsCount === 1 ? "Item" : "Items"}</Typography>
                          </Link>
                        </Box>
                      </CardActionArea>
                    </Grid>
                  </Grid>
                  : <Typography textAlign="center" color={theme.palette.grey[200]} lineHeight="80px" fontSize={55} component="div" sx={{ m: theme.spacing(4, 0) }} >Empty list</Typography>
                }
              </Box>

              <Box>
                <Divider sx={{ mb: theme.spacing(1) }} />
                <Grid container spacing={0}>
                  <Grid item xs={6}>
                    <Button href={`/todo/${data.id}`} >Open list</Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack
                      direction="row"
                      divider={<Divider orientation="vertical" flexItem />}
                      spacing={2}
                      sx={{ alignItems: "center", justifyContent: "flex-end" }}
                    >
                      <Button onClick={() => setEditing(true)} >Rename</Button>
                      <Button color="error" onClick={handleDeleteTodo} >Delete</Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </>
          }
        </Stack>
      </Paper>
    </Grid>
  );

}

export default Todo;