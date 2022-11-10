import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { setSearchTermReducer } from '../../store/todosSlice'

import type { RootState } from '../../store/store';

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
    }, 500)

    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, dispatch]); // satisfy Eslint warning missing deps? included also dispatch


  /**
   * Cancel the search 
   */
  const handleCancel = () => {
    dispatch(setSearchTermReducer(""))
    setDebouncedSearchTerm('');
  }

  return (
    <Box className="search-bar">
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
          inputProps={{ autoComplete: "off", className: "search-input" }}
        />
        <Button onClick={handleCancel} >Cancel</Button>
      </Stack>
    </Box>
  );

}

export default SearchBar;