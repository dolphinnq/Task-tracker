import { client } from "../utils/fetchClient";

export const getTodos = () => {
  return client.get('/todos');
};

export const createTodo = (newTodo) => {
  return client.post('/todos', newTodo)
};

export const updateTodo = (data) => {
  return client.patch(`/todos/${data.id}`, data)
};

export const deleteTodo = (id) => {
  return client.delete(`/todos/${id}`)
};