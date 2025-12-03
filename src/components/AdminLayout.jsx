import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, Shield, LogOut, ChevronRight } from "lucide-react";
import { useContext } from "react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import UserContext from "../context/UserContext";

export default function AdminLayout() {
    const location = useLocation();
    const { handleLogout, user } = useContext(UserContext);

    const navItems = [
        { name: "Platform Overview", icon: LayoutDashboard, path: "/admin/overview" },
        { name: "User List", icon: Users, path: "/admin/users" },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* ADMIN SIDEBAR (Premium Dark Theme) */}
            <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white h-screen flex flex-col fixed left-0 top-0 z-40 shadow-2xl border-r border-slate-800/50"
            >
                {/* Logo Section */}
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="p-6 border-b border-slate-800/50"
                >
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                            className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg"
                        >
                            <Shield className="h-6 w-6 text-white" />
                        </motion.div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                RentFlow
                            </h1>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5 font-semibold">
                                Super Admin
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <motion.div
                                key={item.path}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                            >
                                <Link
                                    to={item.path}
                                    className={clsx(
                                        "group flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
                                        isActive
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                                            : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <item.icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"} />
                                        </motion.div>
                                        <span>{item.name}</span>
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        >
                                            <ChevronRight size={16} className="text-white" />
                                        </motion.div>
                                    )}
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* User Section */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="p-4 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm"
                >
                    <div className="mb-4 px-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                                {(user?.name || "A")[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{user?.name || "Admin"}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 w-full text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-xl transition-all duration-300 border border-red-900/30 hover:border-red-800/50"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Main Content */}
            <motion.main 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 ml-72 p-8"
            >
                <AnimatePresence mode="wait">
                    <Outlet />
                </AnimatePresence>
            </motion.main>
        </div>
    );
}