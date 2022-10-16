import React from 'react';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import SearchBar from './SearchBar';
import AddNewTodo from '../todos/AddNewTodo';


/**
 * Renders toolbar with add new todo button and search bar
 */
const DashboardToolbar: React.FC = () => {
  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 2, sm: 4 }}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <AddNewTodo />
        <SearchBar />
      </Stack>
    </Box>
  )
}

export default DashboardToolbar;