import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminStats } from "@/slices/users-slice";
import { motion } from "framer-motion";
import { Users, UserCheck, UserCog, Shield } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const StatCard = ({ icon: Icon, label, value, gradient, delay }) => {
    return (
        <motion.div
            variants={itemVariants}
            custom={delay}
            whileHover={{ 
                scale: 1.02, 
                y: -4,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
            <motion.div 
                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                <Icon className="h-6 w-6 text-white" />
            </motion.div>
            <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </motion.div>
    );
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export default function AdminOverview() {
    const dispatch = useDispatch();
    const { adminStats, adminStatsLoading, adminStatsError } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchAdminStats());
    }, [dispatch]);

    if (adminStatsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Shield className="h-12 w-12 text-indigo-600 animate-pulse" />
                </motion.div>
            </div>
        );
    }

    if (adminStatsError) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <p className="text-red-600">Error loading statistics: {adminStatsError?.error || "Something went wrong"}</p>
                </div>
            </div>
        );
    }

    if (!adminStats) {
        return null;
    }

    // Prepare data for charts
    const pieChartData = [
        { name: 'Tenants', value: adminStats.totalTenants || 0 },
        { name: 'Owners', value: adminStats.totalOwners || 0 },
    ];

    const barChartData = [
        { name: 'Total Users', value: adminStats.totalUsers || 0 },
        { name: 'Tenants', value: adminStats.totalTenants || 0 },
        { name: 'Owners', value: adminStats.totalOwners || 0 },
    ];

    return (
        <div className="max-w-7xl mx-auto p-4">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-indigo-100 rounded-2xl">
                        <Shield className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900">Admin Dashboard</h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-gray-500 mt-1"
                        >
                            Platform statistics and user overview
                        </motion.p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        icon={Users} 
                        label="Total Users" 
                        value={adminStats.totalUsers || 0} 
                        gradient="from-blue-500 to-blue-600" 
                        delay={0.1} 
                    />
                    <StatCard 
                        icon={UserCheck} 
                        label="Total Tenants" 
                        value={adminStats.totalTenants || 0} 
                        gradient="from-green-500 to-emerald-600" 
                        delay={0.2} 
                    />
                    <StatCard 
                        icon={UserCog} 
                        label="Total Owners" 
                        value={adminStats.totalOwners || 0} 
                        gradient="from-purple-500 to-purple-600" 
                        delay={0.3} 
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pie Chart */}
                    <motion.div 
                        variants={itemVariants}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-4">User Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value) => [value, 'Count']}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Bar Chart */}
                    <motion.div 
                        variants={itemVariants}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-4">User Statistics</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis 
                                    dataKey="name" 
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis 
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                    {barChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
