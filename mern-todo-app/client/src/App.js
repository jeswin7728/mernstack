// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import TodoList from './TodoList';
import AddTodo from './AddTodo';
import AuthForm from './AuthForm'; // Import AuthForm component
import './App.css';

function App() {
    const [todos, setTodos] = useState([]);
    const [auth, setAuth] = useState(false);

    // Check for token on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setAuth(true);
    }, []);

    // Fetch todos only if authenticated
    useEffect(() => {
        const fetchTodos = async () => {
            if (!auth) return;
            try {
                const result = await axios.get('http://localhost:5000/todos', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setTodos(result.data);
            } catch (err) {
                console.error("Error fetching todos:", err);
            }
        };
        fetchTodos();
    }, [auth]);
    
    const addTodo = async (text) => {
        try {
            const result = await axios.post('http://localhost:5000/todos', { text }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTodos([...todos, result.data]);
        } catch (err) {
            console.error("Error adding todo:", err.response.data); // This will log the specific error from the server
        }
    };
    

    const removeTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/todos/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (err) {
            console.error("Error deleting todo:", err);
        }
    };

    const editTodo = async (id, updatedText, updatedCompleted) => {
        try {
            const result = await axios.put(`http://localhost:5000/todos/${id}`, {
                text: updatedText,
                completed: updatedCompleted
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTodos(todos.map(todo => (todo._id === id ? result.data : todo)));
        } catch (err) {
            console.error("Error updating todo:", err);
        }
    };

    const toggleComplete = async (id, completed) => {
        try {
            const result = await axios.put(`http://localhost:5000/todos/${id}`, {
                completed
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTodos(todos.map(todo => (todo._id === id ? result.data : todo)));
        } catch (err) {
            console.error("Error toggling todo completion:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuth(false);
        setTodos([]); // Clear todos on logout
    };

    return (
        <div className="App">
            <h1>Todo App</h1>
            {auth ? (
                <>
                    <button onClick={handleLogout}>Logout</button>
                    <AddTodo onAddTodo={addTodo} />
                    <TodoList 
                        todos={todos} 
                        onRemoveTodo={removeTodo} 
                        onEditTodo={editTodo} 
                        onToggleComplete={toggleComplete} 
                    />
                </>
            ) : (
                <AuthForm setAuth={setAuth} /> // Show AuthForm if not authenticated
            )}
        </div>
    );
}

export default App;