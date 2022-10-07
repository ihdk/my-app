import type { TodoType, ItemType } from '../assets/types';

// check if Item is after deadline date
export const isAfterDeadline: (item: ItemType) => boolean = (item) => {
  return ( Date.now() > new Date(item.date).getTime() ) && ( item.finished === false );
}

// get Todos filtered by search term, search also through Item titles
export const getFilteredTodos: (todos: TodoType[], searchTerm: string) => TodoType[] = (todos, searchTerm) => {
  return todos.filter( (todo) => {
    if( todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ){
      return true;
    }else{
      // term not found in todo title, check also items titles
      for (let i = 0; i < todo.items.length; i++){
        const item = todo.items[i];
        if( item.title.toLowerCase().includes(searchTerm.toLowerCase()) ){
          return true;
        }
      }
    }
  })
}