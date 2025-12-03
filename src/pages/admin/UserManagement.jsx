import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers } from "@/slices/users-slice";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, 
    Search, 
    Mail, 
    Building2,
    Shield,
    User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const roleConfig = {
    owner: { icon: Building2, color: "text-blue-600", bg: "bg-blue-100", label: "Owner" },
    tenant: { icon: User, color: "text-purple-600", bg: "bg-purple-100", label: "Tenant" },
    admin: { icon: Shield, color: "text-indigo-600", bg: "bg-indigo-100", label: "Admin" },
};

export default function UserManagement() {
    const dispatch = useDispatch();
    const { allUsers, usersLoading, usersError } = useSelector((state) => state.users);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState("all");

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const filteredUsers = (allUsers || []).filter(user => {
        if (!user) return false;
        const name = user.name || "";
        const email = user.email || "";
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                        User List
                    </h2>
                    <p className="text-slate-500 mt-1.5">View all platform users and their information</p>
                </div>
            </motion.div>

            {/* Error Message */}
            {usersError && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                >
                    <p className="text-red-600 text-sm">
                        Error loading users: {usersError?.error || usersError?.message || "Something went wrong"}
                    </p>
                </motion.div>
            )}

            {/* Loading State */}
            {usersLoading && (
                <div className="flex items-center justify-center py-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <Users className="h-12 w-12 text-indigo-600 animate-pulse" />
                        <p className="text-slate-500 text-sm">Loading users...</p>
                    </motion.div>
                </div>
            )}

            {/* Stats Cards */}
            {!usersLoading && (
                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        { label: "Total Users", value: allUsers?.length || 0, icon: Users, color: "from-blue-500 to-cyan-500" },
                        { label: "Owners", value: allUsers?.filter(u => u.role === "owner").length || 0, icon: Building2, color: "from-purple-500 to-pink-500" },
                        { label: "Tenants", value: allUsers?.filter(u => u.role === "tenant").length || 0, icon: User, color: "from-indigo-500 to-violet-500" },
                    ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    ))}
                </div>
            )}

            {/* Filters and Search */}
            {!usersLoading && (
            <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFilterRole("all")}
                                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                                    filterRole === "all"
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                            >
                                All
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFilterRole("owner")}
                                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                                    filterRole === "owner"
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                            >
                                Owners
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFilterRole("tenant")}
                                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                                    filterRole === "tenant"
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                            >
                                Tenants
                            </motion.button>
                            
                        </div>
                    </div>
                </CardContent>
            </Card>
            )}

            {/* Users Table */}
            {!usersLoading && (
            <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
                    <CardTitle className="text-xl font-semibold text-slate-900">All Users</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <AnimatePresence>
                                    {filteredUsers.map((user, index) => {
                                        if (!user) return null;
                                        const RoleIcon = roleConfig[user.role]?.icon || User;
                                        const userId = user._id || user.id;
                                        const userName = user.name || "Unknown";
                                        const userEmail = user.email || "No email";
                                        
                                        return (
                                            <motion.tr
                                                key={userId}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-slate-50/50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
                                                            {userName[0]?.toUpperCase() || "?"}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900">{userName}</div>
                                                            <div className="text-sm text-slate-500 flex items-center gap-1">
                                                                <Mail className="h-3 w-3" />
                                                                {userEmail}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${roleConfig[user.role]?.bg || "bg-slate-100"} ${roleConfig[user.role]?.color || "text-slate-600"}`}>
                                                        <RoleIcon className="h-3.5 w-3.5" />
                                                        {roleConfig[user.role]?.label || user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                    {user.createdAt || user.joined ? new Date(user.createdAt || user.joined).toLocaleDateString() : "N/A"}
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                    {filteredUsers.length === 0 && (
                        <div className="p-12 text-center">
                            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No users found matching your criteria</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            )}
        </div>
    );
}
