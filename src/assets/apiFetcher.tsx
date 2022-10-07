import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { TodoType } from './types';

const apiUrlBase = "https://631f480022cefb1edc48005f.mockapi.io/amcef";

export const useGetTodos = () => {
  const getTodos = (): Promise<TodoType[]> => axios.get(`${apiUrlBase}/test`).then(response => response.data);
  return useQuery('todos', getTodos) 
}

export const useGetTodo = (todoId: string): UseQueryResult<TodoType> => {
  const getTodo = (todoId: string):Promise<TodoType> => axios.get(`${apiUrlBase}/test/${todoId}`).then(response => response.data);
  return useQuery('todo', () => getTodo(todoId)) 
}

export const addItem = async (data: TodoType): Promise<void> => {
  await axios.put(`${apiUrlBase}/test/${data.id}`, data)
  .then((response) => {
    return response.data;
  }).catch((error) => {
    throw new Error(error);
  });
}

export const editItem = async (data: TodoType): Promise<void> => {
  await axios.put(`${apiUrlBase}/test/${data.id}`, data)
  .then((response) => {
    return response;
  }).catch((error)=>{
    throw new Error(error);
  })
}

export const deleteItem = async (data: TodoType): Promise<void> => {
  await axios.put(`${apiUrlBase}/test/${data.id}`, data)
  .then((response) => {
    return response;
  }).catch((error)=>{
    throw new Error(error);
  })
}

export const addTodo = async (data: TodoType): Promise<TodoType> => {
  const response = await axios.post(`${apiUrlBase}/test`, data)
  .then((response) => {
    return response.data;
  }).catch((error) => {
    throw new Error(error);
  });
  return response;
}

export const editTodo = async (data: TodoType): Promise<void> => {
  await axios.put(`${apiUrlBase}/test/${data.id}`, data)
  .then((response) => {
    return response;
  }).catch((error)=>{
    throw new Error(error);
  })
}

export const deleteTodo = async (data: TodoType): Promise<void> => {
  await axios.delete(`${apiUrlBase}/test/${data.id}`)
  .then((response) => {
    return response;
  }).catch((error)=>{
    throw new Error(error);
  })
}

export const importDemo = async (data: TodoType[], allTodos: TodoType[]) : Promise<TodoType[]> => {
  let requests = [];

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
  await axios.all(requests).catch(error => {
    throw new Error(error);
  })

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

  return await axios.all(requests).then( (response) => {
    return response;
  }).catch(error => {
    throw new Error(error);
  })
}