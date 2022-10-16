import uuid from 'react-uuid';
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
 * Simple todos filter, search by keyword in todos and todo items
 * 
 * @param todos todos that will be filtered
 * @param searchTerm text that will be searched in `todos`
 * @returns array of filtered todos and count of found data
 */
export const filterTodos: (todos: TodoType[], searchTerm: string) => { filteredTodos: TodoType[], todos: number, items: number } = (todos, searchTerm) => {
  let todosCounter = 0;
  let itemsCounter = 0;

  const filteredTodos = todos.filter((todo) => {
    let found = false;
    if (todo.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      todosCounter++;
      found = true;
    } else {
      // check also todo items
      let foundInItem = false;
      for (let i = 0; i < todo.items.length; i++) {
        const item = todo.items[i];
        if (item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          itemsCounter++;
          found = true;
          foundInItem = true;
        }
      }
      // increment todos counter once if keyword was found in items list
      if (foundInItem) todosCounter++;
    }
    return found;
  })

  return { filteredTodos: filteredTodos, todos: todosCounter, items: itemsCounter };
}


/**
  * Filter todo items by currently selected states `filter`
  * 
  * @param items all available todo items
  * @returns filtered todo items
  */
export const getFilteredItems = (items: ItemType[], filter: string): ItemType[] => {
  switch (filter) {
    case 'all':
      return items
    case 'active':
      return items.filter((item) => {
        return isAfterDeadline(item) === false;
      });
    case 'finished':
      return items.filter((item) => {
        return item.finished === true;
      });
    case 'missed':
      return items.filter((item) => {
        return isAfterDeadline(item) === true;
      });
    default:
      return items;
  }
}


/**
* Get default values for new todo item
*/
export const getNewItemData = () => {
  const newDate = new Date();
  // set new deadline date to tomorrow
  newDate.setDate(newDate.getDate() + 1);
  return {
    id: uuid(),
    title: "",
    description: "",
    date: newDate.toString(),
    finished: false,
  }
}