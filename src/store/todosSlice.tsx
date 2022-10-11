import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { TodoType, ItemType } from '../assets/types';

/** Initial global states and defined reducers */
export const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    /** All todo lists */
    allTodos: new Array<TodoType>(),
    /** All todo items */
    allItems: new Array<ItemType>(),
    /** Count of todo items in each filter state  */
    filterCounts: { all: 0, active: 0, finished: 0, missed: 0 },
    /** Flag if is adding new todo item */
    addingNewItem: false,
    /** Search keyword typed by user */
    searchTerm: "",
  },
  reducers: {
    /** Store all todos lists */
    setAllTodosReducer: (state, action: PayloadAction<TodoType[]>) => {
      state.allTodos = action.payload;
    },
    /** Store all todo items */
    setAllItemsReducer: (state, action: PayloadAction<ItemType[]>) => {
      state.allItems = action.payload;
    },
    /** Insert new todo into all todos state */
    addedTodoReducer: (state, action: PayloadAction<{ allTodos: TodoType[], todoData: TodoType }>) => {
      const { allTodos, todoData } = action.payload;
      state.allTodos = [...allTodos, todoData];
    },
    /** Remove todo from all todos state */
    removedTodoReducer: (state, action: PayloadAction<{ allTodos: TodoType[], removeId: number | undefined }>) => {
      const { allTodos, removeId } = action.payload;
      state.allTodos = allTodos.filter((todo) => {
        return todo.id !== removeId
      });
    },
    /** Update todo in all todos state*/
    editedTodoReducer: (state, action: PayloadAction<{ allTodos: TodoType[], todoData: TodoType }>) => {
      const { allTodos, todoData } = action.payload;
      state.allTodos = allTodos.map((todo) => {
        return todo.id === todoData.id ? todoData : todo;
      });
    },
    /** Remove todo item from all todo items state */
    removedItemReducer: (state, action: PayloadAction<{ allItems: ItemType[], removeId: number | undefined }>) => {
      const { allItems, removeId } = action.payload;
      state.allItems = allItems.filter((item) => {
        return item.id !== removeId
      });
    },
    /** Add new todo item into all todo items state */
    addedItemReducer: (state, action: PayloadAction<{ allItems: ItemType[], itemData: ItemType }>) => {
      const { allItems, itemData } = action.payload;
      state.allItems = [itemData, ...allItems];
    },
    /** Update todo item in all todo items state */
    editedItemReducer: (state, action: PayloadAction<{ allItems: ItemType[], itemData: ItemType }>) => {
      const { allItems, itemData } = action.payload;
      state.allItems = allItems.map((item) => {
        return item.id === itemData.id ? itemData : item;
      });
    },
    /** Calculate count of todo items in each filter state */
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
    /** Store flag if new todo item is currently added to show the new item form */
    setAddingNewItemReducer: (state, action: PayloadAction<boolean>) => {
      state.addingNewItem = action.payload;
    },
    /** Store search keyword typed by user */
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

export default todosSlice.reducer;