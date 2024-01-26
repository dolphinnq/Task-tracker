import { useState, useEffect } from 'react';
import './styles/App.css';
import { TodoList } from './components/TodoList';
import * as todoService from './api/todos';
import { isTodoSkipped } from './helpers/isTodoSkipped';
import { v4 as uuidv4 } from 'uuid';

const filter = ['All', 'Active', 'Completed', 'Skipped'];

function filterTodos(
  todos,
  filterBy,
) {
  let filteredTodos = [...todos];

  switch (filterBy) {
    case 'Active':
      filteredTodos = todos.filter(todo => !todo.completed);
      break;

    case 'Completed':
      filteredTodos = todos.filter(todo => todo.completed);
      break;

    case 'Skipped':
      filteredTodos = todos
        .filter(todo => isTodoSkipped(todo.date));
      break;

    default:
      break;
  }

  return filteredTodos;
}

export default function App() {
  const [input, setInput] = useState('');
  const [date, setDate] = useState('');
  const [todos, setTodos] = useState([]);
  const [filterBy, setFilterBy] = useState('all')

  const preparedTodos = filterTodos(todos, filterBy);

  const addTodo = ({ id, text, completed, date }) => {
    if (!input.trim()) {
      console.warn('Task should not be empty');

      return;
    }

    if (!date) {
      console.warn('Please, choose a day');

      return;
    }

    todoService.createTodo({ id, text, completed, date })
      .then(newTodo => {
        setInput('');
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch((error) => console.warn(error));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    addTodo({
      id: uuidv4(),
      text: input.trim(),
      completed: false,
      date,
    });
  };

  const updateTodo = (updatedTodo) => {
    todoService.updateTodo(updatedTodo)
      .then(() => setTodos(prev => (
        prev.map(prevTodo => (
          prevTodo.id === updatedTodo.id
            ? updatedTodo
            : prevTodo
        ))
      )))
      .catch(error => {
        console.warn(error);
      })
  };

  const removeTodo = (id) => {
    todoService.deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id))
      })
      .catch(error => {
        console.warn(error);
      });
  };

  const checkTodo = (id, completed) => {
    setTodos(todos.map(t => t.id !== id ? t : { ...t, completed }));
  };

  useEffect(() => {
    todoService.getTodos()
      .then(setTodos)
      .catch((error) => console.warn(error))
  }, [])

  return (
    <div className="p-4">
      <form className="mb-3 input-group" onSubmit={onSubmit}>
        <input
          name="todo"
          className="form-control"
          placeholder="I'm going to..."
          value={input}
          onChange={event => setInput(event.target.value)}
        />
        <button className="btn btn-primary">Add</button>
        {
          !!input && <button
            type="button"
            className="fa fa-times"
            style={{
              background: 'none',
              border: 'none',
              position: 'absolute',
              right: 40,
              top: 0,
              bottom: 0,
              marginRight: 20,
              zIndex: 10
            }}
            onClick={() => setInput('')}
          />
        }
      </form>

      <div className="mb-3">
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={event => setDate(event.target.value)}
        />
      </div>

      <div className="btn-group mb-3">
        {filter.map(field => (
          <button
            key={field}
            className={`btn btn-sm btn-outline-primary ${(filterBy === field) && 'active'}`}
            onClick={() => setFilterBy(field)}
          >{field}</button>
        ))}
      </div>

      <TodoList
        todos={preparedTodos}
        onCheck={checkTodo}
        onRemove={removeTodo}
        onUpdate={updateTodo}
      />
    </div>
  );
}
