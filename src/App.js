import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'; // Adjust path as needed
import Home from './components/Home';   // Adjust path as needed
import MyTicketCreate from './components/MyTicketCreate';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={<Login setIsAuthenticated={setIsAuthenticated} />}
                />
                <Route
                    path="/home"
                    element={
                        isAuthenticated ? (
                            <Home setIsAuthenticated={setIsAuthenticated} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route
                    path="/my-ticket-create"
                    element={
                        isAuthenticated ? (
                            <MyTicketCreate setIsAuthenticated={setIsAuthenticated} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;