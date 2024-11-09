import React from 'react';

const TodoList = ({ todos }) => (
  <ul>
    {todos.map(todo => (
      <li key={todo._id}>{todo.title}</li>
    ))}
  </ul>
);

export default TodoList;