import type { TodoType, ItemType } from '../assets/types';

/**
 * Check if todo item is after deadline date
 * 
 * @param item data of todo item to check
 * @returns boolean
 */
export const isAfterDeadline: (item: ItemType) => boolean = (item) => {
  return (Date.now() > new Date(item.date).getTime()) && (item.finished === false);
}



/**
 * Get Todos filtered by search term, search also through Item titles
 * 
 * @param todos todos that will be filtered
 * @param searchTerm text that will be searched in `todos`
 * @returns reduced list of `todos` that include `searchTerm`
 */
export const getFilteredTodos: (todos: TodoType[], searchTerm: string) => TodoType[] = (todos, searchTerm) => {
  return todos.filter((todo) => {
    if (todo.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    } else {
      // term not found in todo title, check also items titles
      for (let i = 0; i < todo.items.length; i++) {
        const item = todo.items[i];
        if (item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  })
}