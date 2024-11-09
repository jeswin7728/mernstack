// AuthForm.js
import React, { useState } from 'react';
import axios from 'axios';

function AuthForm({ setAuth }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isRegistering ? 'register' : 'login';
            const response = await axios.post(`http://localhost:5000/${endpoint}`, {
                email,
                password
            });
            
            localStorage.setItem('token', response.data.token);
            setAuth(true); // Update auth state in App
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div>
            <h2>{isRegistering ? "Register" : "Login"}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleAuth}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isRegistering ? "Register" : "Login"}</button>
            </form>
            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? "Already have an account? Login" : "New user? Register"}
            </button>
        </div>
    );
}

export default AuthForm;