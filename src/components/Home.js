import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Ensure this is your Axios instance with withCredentials: true

const Home = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Call the logout endpoint on your Laravel backend
            const response = await api.post('/logout');
            if (response.status === 200) {
                // Update authentication state and redirect to login
                setIsAuthenticated(false);
                navigate('/login');
            }
        } catch (err) {
            console.error('Logout error:', err.response ? err.response.data : err.message);
            // Optionally handle logout failure (e.g., show an error message)
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Bar */}
            <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-white text-xl font-bold">ClarityTicket</h1>
                    <button
                        onClick={handleLogout}
                        className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
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