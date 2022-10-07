import { useSelector } from 'react-redux'

import { useTheme } from '@mui/material/styles';
import { Stack, Divider, Box, Typography } from '@mui/material';

import SearchBar from './SearchBar';
import AddNewTodo from './todos/AddNewTodo';

import type { RootState } from '../store/store';

const DashboardToolbar = () => {
  const theme = useTheme();
  const searchTerm = useSelector<RootState, string>((state) => state.todos.searchTerm);

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
      { searchTerm !== "" &&
        <Typography color="primary" variant="h2" sx={{ m: theme.spacing(4, 0) }}>Search results for: {searchTerm}</Typography>
      }
    </Box>
  )
}

export default DashboardToolbar;