import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Cookies from 'js-cookie';

const Home = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            console.log('Fetching CSRF cookie...');
            const csrfResponse = await api.get('http://localhost:8000/sanctum/csrf-cookie');
            console.log('CSRF Response:', csrfResponse);

            const xsrfToken = Cookies.get('XSRF-TOKEN');
            const sessionCookie = Cookies.get('laravel_session');
            if (!xsrfToken) throw new Error('CSRF token not found');
            console.log('XSRF-TOKEN:', xsrfToken);
            console.log('laravel_session:', sessionCookie);

            console.log('Sending logout request...');
            const response = await api.post('/logout', {}, {
                headers: {
                    'X-XSRF-TOKEN': xsrfToken,
                },
            });
            console.log('Logout Response:', response.data, 'Status:', response.status);

            if (response.status === 200) {
                console.log('Logout successful, updating state and navigating...');
                if (typeof setIsAuthenticated === 'function') {
                    setIsAuthenticated(false);
                } else {
                    console.warn('setIsAuthenticated is not a function');
                }
                navigate('/login');
            }
        } catch (err) {
            console.error('Logout error:', err.response ? err.response.data : err.message);
            console.error('Error Status:', err.response?.status || 'undefined');
        }
    };
    
    const handleMyTicketClick = () => {
        navigate('/my-ticket-create');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-gradient-to-r from-green-600 to-black-600 p-4 shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                  {/* Group the h1 elements in a flex container */}
                <div className="flex space-x-6">
                    <h1 className="text-white text-xl font-bold">ClarityTicket</h1>
                    <button
                            onClick={handleMyTicketClick}
                            className="text-white text-xl font-bold hover:text-gray-200 transition-colors duration-200"
                        >
                            My Ticket
                    </button>
                </div>
                {/* Logout button on the right */}
                    <button
                        onClick={handleLogout}
                        className="text-white bg-orange-400 hover:bg-red-600 px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                        Logout
                    </button>
                </div>
            </nav>
            <div className="flex items-center justify-center h-[calc(100vh-1vh)]">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                        Welcome to the Home Page!
                    </h2>
                    <p className="text-gray-600 text-lg">
                        You are logged in. Enjoy your stay!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;