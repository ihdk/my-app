import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation, useQueryClient } from "react-query";
import dayjs from 'dayjs';

import useTheme from '@mui/material/styles/useTheme';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import { CollapseProps } from '@mui/material/Collapse';
import ScheduleIcon from '@mui/icons-material/Schedule';

import ItemForm from './ItemForm'
import { notify } from '../../assets/notifications';
import { isAfterDeadline } from '../../assets/helpers';
import { updateTodoItems } from '../../assets/apiFetcher';
import { setFiltersCountReducer, removedItemReducer, addedItemReducer, setAddingNewItemReducer, editedItemReducer } from '../../store/todosSlice';

import type { ItemType, TodoType } from '../../assets/types';

/** Component props type */
type ItemProps = {
  data: ItemType;
  todo: TodoType;
  newItem?: boolean;
}

/** Customized Collapse component to render as Box */
const CollapsibleBox: React.FC<CollapseProps> = (props) => {
  return <Collapse component={Box} {...props}>{props.children}</Collapse>
}

/**
 * Renders todo item
 * 
 * @param Props.data item data
 * @param Props.todo todo data
 * @param Props.newItem if item is new currently added item
 */
const Item: React.FC<ItemProps> = ({ data, todo, newItem = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch()
  const queryClient = useQueryClient();

  // check if would be displayed edit form or todo item 
  const [editing, setEditing] = useState(newItem);

  // check if item was deleted to perform slide out animation
  const [deleted, setDeleted] = useState(false);

  /** Check if todo item is after deadline date */
  const afterDeadline = isAfterDeadline(data);

  /** Color that describe current todo item state (finished or after deadline) */
  const markColor = data.finished ? theme.palette.success.light : (afterDeadline ? theme.palette.error.light : null);


  // Mutate item functions, displayed are notification messages until promises are resolved
  // In case of error, invalidate query to refetch correct data from api
  // In case of success, displayed are data from current state
  const { mutateAsync: mutateAsyncUpdateItem } = useMutation(updateTodoItems, {
    onError: () => queryClient.invalidateQueries('todo')
  });

  /**
   * Delete todo item
   */
  const handleDeleteItem = () => {
    // update state see removed item immediately
    dispatch(removedItemReducer(data.id));
    dispatch(setFiltersCountReducer());

    //finally send data via api
    const promise = mutateAsyncUpdateItem(todo);
    notify('delete', data.title, promise);
  }


  /**
   * Mark todo item as finished, save updated data
   */
  const handleItemFinished = () => {
    saveItem({ ...data, finished: !data.finished });
  }


  /**
    * Save todo item data for new item or edited existing item
    * 
    * @param itemData data of todo item that will be saved
    */
  const saveItem = (itemData: ItemType) => {
    if (newItem) {
      // update state to show new data immediately
      dispatch(addedItemReducer(itemData));
      dispatch(setAddingNewItemReducer(false));
      dispatch(setFiltersCountReducer());

      //finally send data via api, used is already updated allItems list
      const promise = mutateAsyncUpdateItem(todo);
      notify('add', itemData.title, promise);
    } else {
      // update state to show new data immediately
      dispatch(editedItemReducer(itemData));
      dispatch(setFiltersCountReducer());

      //finally send data via api, used is already updated allItems list
      const promise = mutateAsyncUpdateItem(todo);
      notify('edit', itemData.title, promise);
    }
  }

  // Decide if render edit form or todo item data
  return (
    editing
      ? <ItemForm data={data} saveItem={saveItem} setEditing={setEditing} newItem={newItem} />
      : <CollapsibleBox onExited={handleDeleteItem} in={!deleted} sx={{ width: "100%" }}>
        <Card sx={{ mb: theme.spacing(2), borderLeft: markColor !== null ? `5px solid ${markColor}` : "" }}>
          <CardContent>
            <Grid container spacing={0}>
              <Grid item xs={12} md={8}>
                <Typography gutterBottom variant="h6" component="h2" color="primary" fontWeight={600}>{data.title}</Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", [theme.breakpoints.down('md')]: { justifyContent: 'flex-start' } }}>
                <ScheduleIcon sx={{ color: markColor !== null ? markColor : "", mr: theme.spacing(1) }} fontSize="inherit" />
                <Typography color={markColor !== null ? markColor : ""} component="div" fontWeight={afterDeadline ? "600" : ""} >{dayjs(data.date).format('DD.MM.YYYY HH:mm')}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" component="div" color="text.secondary" sx={{ whiteSpace: "pre-line", mt: theme.spacing(1) }}>{data.description}</Typography>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Grid container spacing={0}>
              <Grid item xs={8} md={8}>
                <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
                  <Button
                    size="small"
                    color={data.finished ? "error" : "success"}
                    onClick={handleItemFinished}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {data.finished ? "Undone" : "Mark done"}
                  </Button>
                  <Button size="small" onClick={() => setEditing(true)}>Edit</Button>
                </Stack>
              </Grid>
              <Grid item xs={4} md={4} sx={{ textAlign: "right" }}>
                <Button size="small" color="error" onClick={() => setDeleted(true)}>Delete</Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </CollapsibleBox>
  );

}

export default Item;