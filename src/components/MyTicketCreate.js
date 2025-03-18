import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Adjust path if needed
import Cookies from 'js-cookie';

const MyTicketCreate = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        issued_by: '',
        ticket_name: '',
        ticket_type: '',
        ticket_details: '',
        ticket_priority: 'Low', // Default value
        comments: '',
        send_to: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            console.log('Fetching CSRF cookie...');
            const csrfResponse = await api.get('http://localhost:8000/sanctum/csrf-cookie');
            console.log('CSRF Response:', csrfResponse);

            const xsrfToken = Cookies.get('XSRF-TOKEN');
            if (!xsrfToken) throw new Error('CSRF token not found');

            console.log('Sending ticket creation request...', formData);
            const response = await api.post('/tickets', formData, {
                headers: {
                    'X-XSRF-TOKEN': xsrfToken,
                },
            });
            console.log('Ticket Creation Response:', response.data);

            if (response.status === 201) {
                navigate('/home'); // Redirect back to home on success
            }
        } catch (err) {
            console.error('Ticket creation error:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Failed to create ticket. Please try again.');
        }
    };

    return (
        
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                    Create a New Ticket
                </h2>
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                        {error}
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="issued_by" className="block text-sm font-medium text-gray-700">
                                Issued By
                            </label>
                            <input
                                id="issued_by"
                                name="issued_by"
                                type="text"
                                value={formData.issued_by}
                                onChange={handleChange}
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label htmlFor="ticket_name" className="block text-sm font-medium text-gray-700">
                                Ticket Name
                            </label>
                            <input
                                id="ticket_name"
                                name="ticket_name"
                                type="text"
                                value={formData.ticket_name}
                                onChange={handleChange}
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Ticket title"
                            />
                        </div>
                        <div>
                            <label htmlFor="ticket_type" className="block text-sm font-medium text-gray-700">
                                Ticket Type
                            </label>
                            <input
                                id="ticket_type"
                                name="ticket_type"
                                type="text"
                                value={formData.ticket_type}
                                onChange={handleChange}
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="e.g., Bug, Feature Request"
                            />
                        </div>
                        <div>
                            <label htmlFor="ticket_details" className="block text-sm font-medium text-gray-700">
                                Ticket Details
                            </label>
                            <textarea
                                id="ticket_details"
                                name="ticket_details"
                                value={formData.ticket_details}
                                onChange={handleChange}
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Describe the issue or request"
                                rows="4"
                            />
                        </div>
                        <div>
                            <label htmlFor="ticket_priority" className="block text-sm font-medium text-gray-700">
                                Ticket Priority
                            </label>
                            <select
                                id="ticket_priority"
                                name="ticket_priority"
                                value={formData.ticket_priority}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                                Comments
                            </label>
                            <textarea
                                id="comments"
                                name="comments"
                                value={formData.comments}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Additional comments (optional)"
                                rows="3"
                            />
                        </div>
                        <div>
                            <label htmlFor="send_to" className="block text-sm font-medium text-gray-700">
                                Send To
                            </label>
                            <input
                                id="send_to"
                                name="send_to"
                                type="text"
                                value={formData.send_to}
                                onChange={handleChange}
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Recipient (e.g., team or user)"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                        >
                            Create Ticket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MyTicketCreate;