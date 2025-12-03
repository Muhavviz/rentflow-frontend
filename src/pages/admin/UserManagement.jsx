import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, 
    Search, 
    Filter, 
    MoreVertical, 
    Edit, 
    Trash2, 
    Mail, 
    Building2,
    Shield,
    User,
    ChevronDown,
    ChevronUp,
    Download,
    Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data - replace with actual API call
const mockUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "owner", buildings: 3, status: "active", joined: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "tenant", buildings: 1, status: "active", joined: "2024-02-20" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "owner", buildings: 5, status: "active", joined: "2024-01-10" },
    { id: 4, name: "Alice Williams", email: "alice@example.com", role: "tenant", buildings: 1, status: "inactive", joined: "2024-03-05" },
];

const roleConfig = {
    owner: { icon: Building2, color: "text-blue-600", bg: "bg-blue-100", label: "Owner" },
    tenant: { icon: User, color: "text-purple-600", bg: "bg-purple-100", label: "Tenant" },
    admin: { icon: Shield, color: "text-indigo-600", bg: "bg-indigo-100", label: "Admin" },
};

export default function UserManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [expandedRows, setExpandedRows] = useState(new Set());

    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const toggleRow = (id) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

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
                        User Management
                    </h2>
                    <p className="text-slate-500 mt-1.5">Manage all platform users</p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                </motion.div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "Total Users", value: mockUsers.length, icon: Users, color: "from-blue-500 to-cyan-500" },
                    { label: "Owners", value: mockUsers.filter(u => u.role === "owner").length, icon: Building2, color: "from-purple-500 to-pink-500" },
                    { label: "Tenants", value: mockUsers.filter(u => u.role === "tenant").length, icon: User, color: "from-indigo-500 to-violet-500" },
                    { label: "Active", value: mockUsers.filter(u => u.status === "active").length, icon: Shield, color: "from-emerald-500 to-teal-500" },
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

            {/* Filters and Search */}
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
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-all"
                            >
                                <Download className="h-4 w-4" />
                            </motion.button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
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
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Buildings</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <AnimatePresence>
                                    {filteredUsers.map((user, index) => {
                                        const RoleIcon = roleConfig[user.role].icon;
                                        const isExpanded = expandedRows.has(user.id);
                                        
                                        return (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                                                onClick={() => toggleRow(user.id)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
                                                            {user.name[0]}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900">{user.name}</div>
                                                            <div className="text-sm text-slate-500 flex items-center gap-1">
                                                                <Mail className="h-3 w-3" />
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${roleConfig[user.role].bg} ${roleConfig[user.role].color}`}>
                                                        <RoleIcon className="h-3.5 w-3.5" />
                                                        {roleConfig[user.role].label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-slate-400" />
                                                        <span className="font-medium text-slate-900">{user.buildings}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                                                        user.status === "active"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                    {new Date(user.joined).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                            onClick={(e) => { e.stopPropagation(); }}
                                                        >
                                                            <Edit className="h-4 w-4 text-slate-600" />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                            onClick={(e) => { e.stopPropagation(); }}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                            onClick={(e) => { e.stopPropagation(); toggleRow(user.id); }}
                                                        >
                                                            {isExpanded ? (
                                                                <ChevronUp className="h-4 w-4 text-slate-600" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4 text-slate-600" />
                                                            )}
                                                        </motion.button>
                                                    </div>
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
        </div>
    );
}
