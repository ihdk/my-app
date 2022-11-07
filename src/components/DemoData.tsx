import React, { useState } from 'react';
import { useDispatch } from 'react-redux'

import useTheme from '@mui/material/styles/useTheme';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import { importDemo } from '../assets/apiFetcher';
import { demoNotify } from '../assets/notifications';
import { setAllTodosReducer } from '../store/todosSlice';
import { store } from "../store/store";

/**
 * Renders button and dialog to import demo data
 */
const DemoData: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [opened, setOpened] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);


  /**
   * Handle import of demo data
   * * all todos are removed before import of demo data
   */
  const handleDemoImport = () => {
    setOpened(false);
    setDisabledButton(true);
    const promise = importDemo(store.getState().todos.allTodos)
      .then((response) => {
        dispatch(setAllTodosReducer(response))
        setDisabledButton(false);
      }).catch((error) => {
        setDisabledButton(false);
        throw new Error(error);
      });
    demoNotify(promise);
  }

  return (
    <>
      <Button variant="contained" onClick={() => setOpened(true)} disabled={disabledButton} sx={{ position: "fixed", bottom: "0", right: "0", m: theme.spacing(2) }} >Import Demo Data</Button>
      <Dialog open={opened} onClose={() => setOpened(false)}>
        <DialogTitle color="primary">Import demo data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            All existing todo lists will be removed before demo import.<br />
            <Typography component="span" fontWeight={600}>Are you sure to continue?</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpened(false)} sx={{ color: theme.palette.grey[500] }}>Cancel</Button>
          <Button variant="outlined" onClick={handleDemoImport}>Import demo</Button>
        </DialogActions>
      </Dialog>
    </>
  );

}

export default DemoData;