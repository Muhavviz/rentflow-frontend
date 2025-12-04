import { Link, useLocation, Outlet } from "react-router-dom";
import { Home, CreditCard, LogOut, MessageSquare } from "lucide-react";
import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserContext from "../../context/UserContext";
import { clsx } from "clsx";
import rentflowLogo from "@/assets/rentflow.png";

export default function TenantLayout() {
    const location = useLocation();
    const { handleLogout, user } = useContext(UserContext);

    const navItems = [
        { name: "My Home", icon: Home, path: "/tenant/home" },
        // { name: "Payments", icon: CreditCard, path: "/tenant/payments" },
        // { name: "Contact", icon: MessageSquare, path: "/tenant/contact" },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Premium Tenant Sidebar */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 h-screen flex flex-col fixed left-0 top-0 z-40 shadow-lg"
            >
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 border-b border-gray-200/50"
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-3"
                    >
                        <img src={rentflowLogo} alt="RentFlow Logo" className="h-12 w-auto" />
                        <div>
                            <h1 className="text-2xl font-bold text-primary tracking-tight">
                                RentFlow
                            </h1>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5 font-medium">
                                Resident Portal
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <AnimatePresence>
                        {navItems.map((item, index) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <motion.div
                                    key={item.path}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link to={item.path}>
                                        <motion.div
                                            whileHover={{ 
                                                scale: 1.02, 
                                                x: 4
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            animate={{
                                                scale: 1,
                                                x: 0
                                            }}
                                            transition={{ 
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 25
                                            }}
                                            className={clsx(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium relative",
                                                isActive
                                                    ? "bg-primary/10 text-primary shadow-sm"
                                                    : "text-gray-600"
                                            )}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeNav"
                                                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                            <motion.div
                                                whileHover={{
                                                    scale: 1.1,
                                                    rotate: 5
                                                }}
                                                transition={{ 
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 15
                                                }}
                                            >
                                                <item.icon 
                                                    size={20}
                                                    className={clsx(
                                                        isActive ? "text-primary" : "text-gray-500"
                                                    )}
                                                />
                                            </motion.div>
                                            <span className="relative z-10">{item.name}</span>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </nav>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 border-t border-gray-200/50 bg-gradient-to-b from-gray-50/50 to-white/50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mb-4 px-3 py-2 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200/50"
                    >
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "User"}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email || ""}</p>
                    </motion.div>
                    <motion.button
                        whileHover={{ 
                            scale: 1.02, 
                            backgroundColor: "#fee2e2",
                            borderColor: "#fecaca"
                        }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ 
                            backgroundColor: "transparent", 
                            borderColor: "rgb(254, 226, 226)",
                            scale: 1
                        }}
                        animate={{ 
                            backgroundColor: "transparent", 
                            borderColor: "rgb(254, 226, 226)"
                        }}
                        transition={{ 
                            type: "spring",
                            stiffness: 300,
                            damping: 25
                        }}
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 w-full text-sm font-medium text-red-600 rounded-xl border"
                    >
                        <motion.div
                            whileHover={{ rotate: -10, x: -2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                            <LogOut size={18} />
                        </motion.div>
                        <span>Logout</span>
                    </motion.button>
                </motion.div>
            </motion.div>

            <main className="flex-1 ml-64">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ 
                            duration: 0.2, 
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                        className="p-8"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}