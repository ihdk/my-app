import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { TextField, Button, Stack, Box } from '@mui/material';

import { setSearchTermReducer } from '../store/todosSlice'

import type { RootState } from '../store/store';

const SearchBar = () => {
  const searchTerm = useSelector<RootState, string>((state) => state.todos.searchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const dispatch = useDispatch();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInputRef.current === null) return;
      dispatch(setSearchTermReducer(debouncedSearchTerm))
      // prevent lose of focus after rerender
      searchInputRef.current.focus();
    }, 500)

    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, dispatch])

  const handleCancel = () => {
    dispatch(setSearchTermReducer(""))
    setDebouncedSearchTerm('');
  }

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
        <TextField
          label="Search in the list"
          variant="outlined"
          size="small"
          onChange={(e) => setDebouncedSearchTerm(e.target.value)}
          value={debouncedSearchTerm}
          inputRef={searchInputRef}
          focused
          sx={{ width: "100%" }}
          inputProps={{ autoComplete: "off" }} // maybe just hotfix to disable autocomplete
        />
        <Button onClick={handleCancel} >Cancel</Button>
      </Stack>
    </Box>
  );

}

export default SearchBar;