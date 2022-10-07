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

type Props = {
  data: ItemType;
  todo: TodoType;
  newItem?: boolean;
}

const Item: React.FC<Props> = ({ data, todo, newItem = false }) => {
  const [editing, setEditing] = useState(newItem);
  const theme = useTheme();
  const dispatch = useDispatch()
  const queryClient = useQueryClient();

  const allItems = useSelector<RootState, ItemType[]>((state) => state.todos.allItems);
  const date = dayjs(data.date).format('DD.MM.YYYY HH:mm');

  const { mutateAsync: mutateAsyncAddItem } = useMutation(addItem, {
    onError: () => queryClient.invalidateQueries('todo')
  });

  const { mutateAsync: mutateAsyncEditItem } = useMutation(editItem, {
    onError: () => queryClient.invalidateQueries('todo')
  });

  const { mutateAsync: mutateAsyncDeleteItem } = useMutation(deleteItem, {
    onError: () => queryClient.invalidateQueries('todo')
  });

  const afterDeadline = isAfterDeadline(data);
  const markColor = data.finished ? theme.palette.success.light : (afterDeadline ? theme.palette.error.light : null);
  
  const handleItemFinished = () => {
    saveItem({ ...data, finished: !data.finished });
  }

  const saveItem = (itemData: ItemType) => {
    if (newItem) {
      dispatch(addedItemReducer({ allItems: allItems, itemData: itemData }));
      dispatch(setAddingNewItemReducer(false));

      //with updated allItems state continue to update other states...
      const currentItems = store.getState().todos.allItems;
      dispatch(setFiltersCountReducer(currentItems));

      // send api request to add new item
      // in case of error, query will be invalidated and current items data refetched
      const promise = mutateAsyncAddItem({ ...todo, items: currentItems });
      notify('add', itemData.title, promise);

    } else {
      dispatch(editedItemReducer({ allItems: allItems, itemData: itemData }));

      //with updated allItems state continue to update other states...
      const currentItems = store.getState().todos.allItems;
      dispatch(setFiltersCountReducer(currentItems));

      // send api request to update item data, 
      // in case of error, query will be invalidated and current items data refetched
      const promise = mutateAsyncEditItem({ ...todo, items: currentItems });
      notify('edit', itemData.title, promise);
    }

  }

  const handleDeleteItem = () => {
    dispatch(removedItemReducer({ allItems: allItems, removeId: data.id }));

    //with updated allItems state continue to update other states...
    const currentItems = store.getState().todos.allItems;
    dispatch(setFiltersCountReducer(currentItems));

    // async deletion request to api, in case of error will be invalidated query to refetch current data via api
    // in case of success, we do not need to do anything
    const promise = mutateAsyncDeleteItem({ ...todo, items: currentItems });
    notify('delete', data.title, promise);
  }

  const Item = () => {
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
                <Typography color={markColor !== null ? markColor : ""} component="div" fontWeight={afterDeadline ? "600" : ""} >{date}</Typography>
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
                <Stack
                  direction="row"
                  divider={<Divider orientation="vertical" flexItem />}
                  spacing={2}
                >
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
                <Button
                  size="small"
                  color="error"
                  onClick={handleDeleteItem}
                >Delete</Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Grid>
    )
  };

  return (
    editing ? <ItemForm data={data} saveItem={saveItem} setEditing={setEditing} newItem={newItem} /> : <Item />
  );

}

export default Item;