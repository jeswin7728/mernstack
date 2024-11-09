import { render, screen } from '@testing-library/react';
import App from './App';

test('renders To-Do List App title', () => {
  render(<App />);
  const titleElement = screen.getByText(/to-do list app/i); // Check for the correct title
  expect(titleElement).toBeInTheDocument();
});

test('renders TodoList component', () => {
  render(<App />);
  const todoListElement = screen.getByText(/todo/i); // Adjust this based on what TodoList renders
  expect(todoListElement).toBeInTheDocument();
});