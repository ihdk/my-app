import { useQuery } from 'react-query';
import axios from 'axios';
import { TodoType } from './types';
import { store } from '../store/store';

const apiUrlBase = "https://631f480022cefb1edc48005f.mockapi.io/demo-api";
const demoApiUrl = "https://my.api.mockaroo.com/todos.json?key=cb9ff710";

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
export const useGetTodo = (todoId: number) => {
  const getTodo = (): Promise<TodoType> => axios.get(`${apiUrlBase}/test/${todoId}`).then(response => response.data);
  return useQuery('todo', getTodo)
}


/**
 * Add new todo list
 * @param data data of new todo list
 * @return data of new todo list including ID parameter defined by db
 */
export const addTodo = async (data: TodoType) => {
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
export const editTodo = async (data: TodoType) => {
  await axios.put(`${apiUrlBase}/test/${data.id}`, data)
    .catch((error) => {
      throw new Error(error);
    })
}


/**
 * Remove todo list
 * @param data data of todo list
 */
export const deleteTodo = async (data: TodoType) => {
  await axios.delete(`${apiUrlBase}/test/${data.id}`)
    .catch((error) => {
      throw new Error(error);
    })
}

/**
 * Update items in todo list
 * @param todo data of todo list
 */
export const updateTodoItems = async (todo: TodoType) => {
  // update todo with current todo items data, we'll use data stored in global state
  const newData = { ...todo, items: store.getState().todos.allItems };
  await axios.put(`${apiUrlBase}/test/${todo.id}`, newData)
    .catch((error) => {
      throw new Error(error);
    })
}


/**
 * Insert new demo todos
 */
export const importDemo = async () => {

  const data: TodoType = await axios.get(demoApiUrl)
    .then((response) => {
      return response.data;
    }).catch((error) => {
      throw new Error(error);
    });

  return addTodo(data);

}