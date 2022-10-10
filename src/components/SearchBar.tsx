import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { TextField, Button, Stack, Box } from '@mui/material';

import { setSearchTermReducer } from '../store/todosSlice'

import type { RootState } from '../store/store';

/**
 * Component renders search bar in dashboard
 */
const SearchBar: React.FC = () => {
  const dispatch = useDispatch();

  /** Search term typed by user */
  const searchTerm = useSelector<RootState, string>((state) => state.todos.searchTerm);

  // Store search term with some delay as user typing
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  /** Search field input reference */
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // process search of todos with some delay as user typing
    const timer = setTimeout(() => {
      if (searchInputRef.current === null) return;
      // store search term in global state
      dispatch(setSearchTermReducer(debouncedSearchTerm))
      // prevent lose of focus after rerender
      searchInputRef.current.focus();
    }, 500)

    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, dispatch])


  /**
   * Cancel the search 
   */
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
          inputProps={{ autoComplete: "off" }}
        />
        <Button onClick={handleCancel} >Cancel</Button>
      </Stack>
    </Box>
  );

}

export default SearchBar;