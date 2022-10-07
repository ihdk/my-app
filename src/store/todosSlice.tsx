import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { TodoType, ItemType } from '../assets/types';

export const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    allTodos: new Array<TodoType>(),
    allItems: new Array<ItemType>(),
    filterCounts: { all: 0, active: 0, finished: 0, missed: 0 },
    addingNewItem: false,
    searchTerm: "",
  },
  reducers: {
    setAllTodosReducer: (state, action: PayloadAction<TodoType[]>) => {
      state.allTodos = action.payload;
    },
    setAllItemsReducer: (state, action: PayloadAction<ItemType[]>) => {
      state.allItems = action.payload;
    },
    addedTodoReducer: (state, action: PayloadAction<{ allTodos: TodoType[], todoData: TodoType }>) => {
      const { allTodos, todoData } = action.payload;
      state.allTodos = [...allTodos, todoData];
    },
    removedTodoReducer: (state, action: PayloadAction<{ allTodos: TodoType[], removeId: number | undefined }>) => {
      const { allTodos, removeId } = action.payload;
      state.allTodos = allTodos.filter((todo) => {
        return todo.id !== removeId
      });
    },
    editedTodoReducer: (state, action: PayloadAction<{ allTodos: TodoType[], todoData: TodoType }>) => {
      const { allTodos, todoData } = action.payload;
      state.allTodos = allTodos.map((todo) => {
        return todo.id === todoData.id ? todoData : todo;
      });
    },
    removedItemReducer: (state, action: PayloadAction<{ allItems: ItemType[], removeId: number | undefined }>) => {
      const { allItems, removeId } = action.payload;
      state.allItems = allItems.filter((item) => {
        return item.id !== removeId
      });
    },
    addedItemReducer: (state, action: PayloadAction<{ allItems: ItemType[], itemData: ItemType}>) => {
      const { allItems, itemData } = action.payload;
      state.allItems = [itemData, ...allItems];
    },
    editedItemReducer: (state, action: PayloadAction<{ allItems: ItemType[], itemData: ItemType}>) => {
      const { allItems, itemData } = action.payload;
      state.allItems = allItems.map((item) => {
        return item.id === itemData.id ? itemData : item;
      });
    },
    setFiltersCountReducer: (state, action: PayloadAction<ItemType[]>) => {
      const allItems = action.payload;
      const filterCounts = { all: allItems.length, active: 0, finished: 0, missed: 0 };
      allItems.forEach((item) => {
        const itemDate = new Date(item.date);
        if (item.finished === true) {
          filterCounts.finished += 1;
        } else {
          const afterDeadline = (Date.now() > itemDate.getTime());
          if (afterDeadline === true) {
            filterCounts.missed += 1;
          } else {
            filterCounts.active += 1;
          }
        }
      })
      state.filterCounts = filterCounts;
    },
    setAddingNewItemReducer: (state, action: PayloadAction<boolean>) => {
      state.addingNewItem = action.payload;
    },
    setSearchTermReducer: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  }
})

export const {
  setAllTodosReducer,
  setAllItemsReducer,
  setAddingNewItemReducer,
  setSearchTermReducer,
  setFiltersCountReducer,
  addedTodoReducer,
  removedTodoReducer,
  editedTodoReducer,
  addedItemReducer,
  removedItemReducer,
  editedItemReducer,
} = todosSlice.actions

export default todosSlice.reducer