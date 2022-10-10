import React from 'react';

import { Stack, Divider, Box } from '@mui/material';

import SearchBar from './SearchBar';
import AddNewTodo from './todos/AddNewTodo';


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