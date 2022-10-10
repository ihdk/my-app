import { useDispatch } from 'react-redux'

import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';

import data from '../assets/demo-data.json';
import { importDemo  } from '../assets/apiFetcher';
import { demoNotify } from '../assets/notifications';
import { setAllTodosReducer } from '../store/todosSlice';
import { store } from "../store/store";

/**
 * Renders button to import demo data
 */
const DemoData = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  /**
   * Handle import of demo data
   * - all todos are removed before import of demo data
   */
  const handleDemoImport = () => {
    const promise = importDemo(data, store.getState().todos.allTodos)
    .then( (demoData) => {
      dispatch(setAllTodosReducer(demoData))
    });
    demoNotify(promise);
  }
  
  return (
    <Button variant="contained" onClick={handleDemoImport} sx={{ position: "fixed", bottom: "0", right: "0", m: theme.spacing(2) }} >Insert Demo Data</Button>
  );

}

export default DemoData;