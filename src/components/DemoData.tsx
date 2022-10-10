import React, { useState } from 'react';
import { useDispatch } from 'react-redux'

import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';

import data from '../assets/demo-data.json';
import { importDemo } from '../assets/apiFetcher';
import { demoNotify } from '../assets/notifications';
import { setAllTodosReducer } from '../store/todosSlice';
import { store } from "../store/store";

/**
 * Renders button to import demo data
 */
const DemoData: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [opened, setOpened] = useState(false);

  /**
   * Handle import of demo data
   * * all todos are removed before import of demo data
   */
  const handleDemoImport = () => {
    setOpened(false)
    const promise = importDemo(data, store.getState().todos.allTodos)
      .then((demoData) => {
        dispatch(setAllTodosReducer(demoData))
      });
    demoNotify(promise);
  }

  return (
    <>
      <Button variant="contained" onClick={() => setOpened(true)} sx={{ position: "fixed", bottom: "0", right: "0", m: theme.spacing(2) }} >Import Demo Data</Button>
      <Dialog
        open={opened}
        onClose={() => setOpened(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Import demo data
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography>All existing todo lists will be removed before demo import.</Typography>
            <Typography fontWeight={600}>Are you sure to continue?</Typography>
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