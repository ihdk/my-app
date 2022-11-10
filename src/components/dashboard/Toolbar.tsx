import React from 'react';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import SearchBar from './SearchBar';
import AddNewTodo from './AddNewTodo';


/**
 * Renders toolbar with add new todo button and search bar
 */
const Toolbar: React.FC = () => {
  return (
    <Box className="dashboard-toolbar">
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

export default Toolbar;