import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation, useQueryClient } from "react-query";
import dayjs from 'dayjs';

import { useTheme } from '@mui/material/styles';
import { Typography, Card, Button, Divider, Grid, Stack, CardContent, CardActions } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';

import ItemForm from './ItemForm'
import { notify } from '../../assets/notifications';
import { store } from '../../store/store';
import { isAfterDeadline } from '../../assets/helpers';
import { addItem, editItem, deleteItem } from '../../assets/apiFetcher';
import { setAddingNewItemReducer, setFiltersCountReducer, removedItemReducer, addedItemReducer, editedItemReducer } from '../../store/todosSlice';

import type { RootState } from '../../store/store';
import type { ItemType, TodoType } from '../../assets/types';

/** Component props type */
type Props = {
  data: ItemType;
  todo: TodoType;
  newItem?: boolean;
}

/**
 * Renders todo item
 * 
 * @param Props.data item data
 * @param Props.todo todo data
 * @param Props.newItem if item is new currently added item
 */
const Item: React.FC<Props> = ({ data, todo, newItem = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch()
  const queryClient = useQueryClient();
  const allItems = useSelector<RootState, ItemType[]>((state) => state.todos.allItems);

  // check if would be displayed edit form or todo item 
  const [editing, setEditing] = useState(newItem);


  // Mutate item functions, displayed are notification messages until promises are resolved
  // In case of error, invalidate query to refetch correct data from api, 
  const { mutateAsync: mutateAsyncAddItem } = useMutation(addItem, {
    onError: () => queryClient.invalidateQueries('todo')
  });

  const { mutateAsync: mutateAsyncEditItem } = useMutation(editItem, {
    onError: () => queryClient.invalidateQueries('todo')
  });

  const { mutateAsync: mutateAsyncDeleteItem } = useMutation(deleteItem, {
    onError: () => queryClient.invalidateQueries('todo')
  });

  /** Check if todo item is after deadline date */
  const afterDeadline = isAfterDeadline(data);

  /** Color that describe current todo item state (finished or after deadline) */
  const markColor = data.finished ? theme.palette.success.light : (afterDeadline ? theme.palette.error.light : null);


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
      dispatch(addedItemReducer({ allItems: allItems, itemData: itemData }));
      dispatch(setAddingNewItemReducer(false));

      //with updated allItems state continue to update other states...
      const currentItems = store.getState().todos.allItems;
      dispatch(setFiltersCountReducer(currentItems));

      //finally send data via api
      const promise = mutateAsyncAddItem({ ...todo, items: currentItems });
      notify('add', itemData.title, promise);

    } else {
      // update state to show new data immediately
      dispatch(editedItemReducer({ allItems: allItems, itemData: itemData }));

      //with updated allItems state continue to update other states...
      const currentItems = store.getState().todos.allItems;
      dispatch(setFiltersCountReducer(currentItems));

      //finally send data via api
      const promise = mutateAsyncEditItem({ ...todo, items: currentItems });
      notify('edit', itemData.title, promise);
    }

  }


  /**
   * Delete todo item
   */
  const handleDeleteItem = () => {
    // update state see removed item immediately
    dispatch(removedItemReducer({ allItems: allItems, removeId: data.id }));

    //with updated allItems state continue to update other states...
    const currentItems = store.getState().todos.allItems;
    dispatch(setFiltersCountReducer(currentItems));

    //finally send data via api
    const promise = mutateAsyncDeleteItem({ ...todo, items: currentItems });
    notify('delete', data.title, promise);
  }


  /**
   * Renders todo item 
   */
  const Item: React.FC = () => {
    return (
      <Grid item xs={12}>
        <Card key={`id-${data.id}`} className="item-wrapper" sx={{ borderLeft: markColor !== null ? `5px solid ${markColor}` : "" }}>
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
                <Button size="small" color="error" onClick={handleDeleteItem}>Delete</Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Grid>
    )
  };

  // decide if render edit form or todo item data
  return (
    editing ? <ItemForm data={data} saveItem={saveItem} setEditing={setEditing} newItem={newItem} /> : <Item />
  );

}

export default Item;