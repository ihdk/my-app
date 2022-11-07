import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { TodoType } from './types';
import { store } from '../store/store';

const apiUrlBase = "https://631f480022cefb1edc48005f.mockapi.io/demo-api";

/**
 * Get all todos for dashboard page
 * @returns react query
 */
export const useGetTodos = () => {
  const getTodos = (): Promise<TodoType[]> => axios.get(`${apiUrlBase}/test`).then(response => response.data);
  return useQuery('todos', getTodos)
}


/**
 * Get todo information on todo detail page
 * @param todoId ID of todo list to get
 * @returns react query
 */
export const useGetTodo = (todoId: number): UseQueryResult<TodoType> => {
  const getTodo = (): Promise<TodoType> => axios.get(`${apiUrlBase}/test/${todoId}`).then(response => response.data);
  return useQuery('todo', getTodo)
}


/**
 * Add new todo list
 * @param data data of new todo list
 * @return data of new todo list including ID parameter defined by db
 */
export const addTodo = async (data: TodoType): Promise<TodoType> => {
  const response = await axios.post(`${apiUrlBase}/test`, data)
    .then((response) => {
      return response.data;
    }).catch((error) => {
      throw new Error(error);
    });
  return response;
}


/**
 * Edit todo list
 * @param data data of todo list
 */
export const editTodo = async (data: TodoType): Promise<void> => {
  await axios.put(`${apiUrlBase}/test/${data.id}`, data)
    .catch((error) => {
      throw new Error(error);
    })
}


/**
 * Remove todo list
 * @param data data of todo list
 */
export const deleteTodo = async (data: TodoType): Promise<void> => {
  await axios.delete(`${apiUrlBase}/test/${data.id}`)
    .catch((error) => {
      throw new Error(error);
    })
}

/**
 * Update items in todo list
 * @param todo data of todo list
 */
export const updateTodoItems = async (todo: TodoType): Promise<void> => {
  // update todo with current todo items data, we'll use data stored in global state
  const newData = { ...todo, items: store.getState().todos.allItems };
  await axios.put(`${apiUrlBase}/test/${todo.id}`, newData)
    .catch((error) => {
      throw new Error(error);
    })
}


/**
 * Insert new demo todos
 * 
 * @param data new demo todos list
 * @param allTodos existing todos list
 */
export const importDemo = async (data: TodoType[], allTodos: TodoType[]): Promise<TodoType[]> => {
  /** store axios requests to resolve them all at once */
  let requests = [];

  // remove all existing todos
  for (let i = 0; i < allTodos.length; i++) {
    const todo = allTodos[i];
    requests.push(
      await axios.delete(`${apiUrlBase}/test/${todo.id}`)
        .then((response) => {
          return response;
        }).catch((error) => {
          throw new Error(error);
        })
    );
  }

  // no need to get response data, just check if error occurs to show appropriate notification
  await axios.all(requests).catch(error => {
    throw new Error(error);
  })

  // add new demo todos
  requests = [];
  for (let i = 0; i < data.length; i++) {
    const todo = data[i];
    requests.push(
      await axios.post(`${apiUrlBase}/test`, todo)
        .then((response) => {
          return response.data;
        }).catch((error) => {
          throw new Error(error);
        })
    );
  }

  // return response to resolve notification promise and show appropriate success message
  return await axios.all(requests).then((response) => {
    return response;
  }).catch(error => {
    throw new Error(error);
  })
}