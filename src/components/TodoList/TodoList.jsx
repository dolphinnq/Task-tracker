import { memo } from 'react';
import { TodoItem } from '../TodoItem';

export const TodoList = memo(({ todos, onCheck, onRemove, onUpdate }) => {

  return <ul className="list-group">
    {todos.map(todo => (
      <TodoItem 
        key={todo.id}
        id={todo.id}
        text={todo.text}
        completed={todo.completed}
        date={todo.date}
        onRemove={onRemove}
        onUpdate={onUpdate}
      />
    ))}
  </ul>
});