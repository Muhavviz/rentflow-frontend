import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ShieldX } from 'lucide-react';
import UserContext from '../context/UserContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { isLoggedIn, user } = useContext(UserContext);
    const hasToken = localStorage.getItem('token');


    if (!isLoggedIn && !hasToken) {
        return <Navigate to="/login" replace />;
    }


    if (!isLoggedIn && hasToken) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block mb-4"
                    >
                        <Loader2 className="h-8 w-8 text-green-600" />
                    </motion.div>
                    <p className="text-sm font-medium text-gray-600">Loading your account...</p>
                </motion.div>
            </div>
        );
    }


    if (isLoggedIn && !user && hasToken) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block mb-4"
                    >
                        <Loader2 className="h-8 w-8 text-green-600" />
                    </motion.div>
                    <p className="text-sm font-medium text-gray-600">Loading your account...</p>
                </motion.div>
            </div>
        );
    }


    if (isLoggedIn && user && allowedRoles && allowedRoles.length > 0) {
        const userRole = user.role?.toLowerCase();
        const hasPermission = allowedRoles.some(role => role.toLowerCase() === userRole);
        
        if (!hasPermission) {
            return (
                <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-block mb-6"
                        >
                            <ShieldX className="h-16 w-16 text-red-500" />
                        </motion.div>
                        <h1 className="text-5xl font-bold text-red-600 mb-3">403</h1>
                        <p className="text-xl font-semibold text-gray-800 mb-2">Unauthorized Access</p>
                        <p className="text-gray-500 max-w-md mx-auto">
                            You do not have permission to view this page.
                        </p>
                    </motion.div>
                </div>
            );
        }
    }

    return children;
};

export default ProtectedRoute;