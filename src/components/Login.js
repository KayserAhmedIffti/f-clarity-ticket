import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            // Step 1: Fetch CSRF cookie
            console.log('Fetching CSRF cookie...');
            const csrfResponse = await api.get('http://localhost:8000/sanctum/csrf-cookie');
            console.log('CSRF Response:', csrfResponse);

            // Step 2: Get the CSRF token from the cookie
            const xsrfToken = Cookies.get('XSRF-TOKEN');
            if (!xsrfToken) {
                throw new Error('CSRF token not found in cookies');
            }
            console.log('XSRF-TOKEN:', xsrfToken);

            // Step 3: Make login request with CSRF token in header
            console.log('Sending login request with:', { email, password });
            const response = await api.post('/login', { email, password }, {
                headers: {
                    'X-XSRF-TOKEN': xsrfToken, // Manually set the CSRF token header
                },
            });
            console.log('Login Response:', response.data);

            // Step 4: Handle successful login
            if (response.status === 200) {
                setIsAuthenticated(true);
                navigate('/home');
            }
        } catch (err) {
            // Step 5: Handle errors
            console.error('Login error:', err.response ? err.response.data : err.message);
            
            if (err.response) {
                if (err.response.status === 419) {
                    setError('CSRF token mismatch. Please try again.');
                } else if (err.response.status === 401) {
                    setError('Invalid email or password.');
                } else {
                    setError(err.response.data.message || 'An error occurred during login.');
                }
            } else {
                setError(err.message || 'Network error. Please check your connection and try again.');
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;