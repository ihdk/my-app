import React, { useState } from 'react';
import { useDispatch } from 'react-redux'

import useTheme from '@mui/material/styles/useTheme';
import Button from '@mui/material/Button';

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
  const [disabledButton, setDisabledButton] = useState(false);


  /**
   * Handle import of demo data
   * * all todos are removed before import of demo data
   */
  const handleDemoImport = () => {
    setDisabledButton(true);
    const promise = importDemo()
      .then((response) => {
        dispatch(setAllTodosReducer(store.getState().todos.allTodos.concat(response)))
        setDisabledButton(false);
      }).catch((error) => {
        setDisabledButton(false);
        throw new Error(error);
      });
    demoNotify(promise);
  }

  return (
    <Button variant="contained" onClick={handleDemoImport} disabled={disabledButton} sx={{ position: "fixed", bottom: "0", right: "0", m: theme.spacing(2) }} >Insert Demo Todo</Button>
  );

}

export default DemoData;