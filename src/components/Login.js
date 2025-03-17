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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
                        BSCL(TRP) Clarity Ticket
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Welcome back! Please enter your credentials.
                    </p>
                </div>
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                        <p>{error}</p>
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;