import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAgreementsByOwner } from "@/slices/agreement-slice";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, 
    Search, 
    Mail, 
    Building2,
    Home,
    IndianRupee,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Tenants() {
    const dispatch = useDispatch();
    const { ownerAgreements, isLoading, serverError } = useSelector((state) => state.agreements);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!ownerAgreements || ownerAgreements.length === 0) {
            dispatch(fetchAgreementsByOwner());
        }
    }, [dispatch, ownerAgreements]);

    // Extract unique tenants from agreements (filter active agreements only)
    const activeAgreements = (ownerAgreements || []).filter(
        agreement => agreement.isActive && agreement.status === 'active'
    );

    // Get unique tenants (in case same tenant has multiple agreements)
    const tenantMap = new Map();
    activeAgreements.forEach(agreement => {
        if (agreement.tenant && agreement.tenant._id) {
            const tenantId = agreement.tenant._id;
            if (!tenantMap.has(tenantId)) {
                tenantMap.set(tenantId, {
                    tenant: agreement.tenant,
                    agreements: []
                });
            }
            tenantMap.get(tenantId).agreements.push(agreement);
        }
    });

    const tenants = Array.from(tenantMap.values());

    const filteredTenants = tenants.filter(tenantData => {
        if (!tenantData.tenant) return false;
        const name = tenantData.tenant.name || "";
        const email = tenantData.tenant.email || "";
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    // Flatten for table display - show each agreement as a row
    const tableData = [];
    filteredTenants.forEach(tenantData => {
        tenantData.agreements.forEach(agreement => {
            const unit = agreement.unit || {};
            const building = unit.building || {};
            tableData.push({
                tenant: tenantData.tenant,
                agreement,
                buildingName: building.name || 'N/A',
                unitNumber: unit.unitNumber || 'N/A',
                rentAmount: agreement.rentAmount || 0,
            });
        });
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
                        Tenants
                    </h2>
                    <p className="text-slate-500 mt-1.5">View all your active tenants and their rental information</p>
                </div>
            </motion.div>

            {/* Error Message */}
            {serverError && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                >
                    <p className="text-red-600 text-sm">
                        Error loading tenants: {serverError?.error || serverError?.message || "Something went wrong"}
                    </p>
                </motion.div>
            )}

            {/* Loading State */}
            {isLoading && !ownerAgreements?.length && (
                <div className="flex items-center justify-center py-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <Users className="h-12 w-12 text-indigo-600 animate-pulse" />
                        <p className="text-slate-500 text-sm">Loading tenants...</p>
                    </motion.div>
                </div>
            )}

            {/* Stats Cards */}
            {!isLoading && (
                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        { 
                            label: "Total Tenants", 
                            value: tenants.length, 
                            icon: Users, 
                            color: "from-blue-500 to-cyan-500" 
                        },
                        { 
                            label: "Active Agreements", 
                            value: activeAgreements.length, 
                            icon: Home, 
                            color: "from-purple-500 to-pink-500" 
                        },
                        { 
                            label: "Total Monthly Rent", 
                            value: `₹${activeAgreements.reduce((sum, a) => sum + (a.rentAmount || 0), 0).toLocaleString()}`, 
                            icon: IndianRupee, 
                            color: "from-indigo-500 to-violet-500" 
                        },
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

            {/* Search */}
            {!isLoading && (
            <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tenants by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>
                </CardContent>
            </Card>
            )}

            {/* Tenants Table */}
            {!isLoading && (
            <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
                    <CardTitle className="text-xl font-semibold text-slate-900">Tenant List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tenant</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Building</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Unit</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Rent Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <AnimatePresence>
                                    {tableData.map((row, index) => {
                                        const tenant = row.tenant;
                                        if (!tenant) return null;
                                        const tenantId = tenant._id || tenant.id;
                                        const tenantName = tenant.name || "Unknown";
                                        const tenantEmail = tenant.email || "No email";
                                        
                                        return (
                                            <motion.tr
                                                key={`${tenantId}-${row.agreement._id}`}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-slate-50/50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
                                                            {tenantName[0]?.toUpperCase() || "?"}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900">{tenantName}</div>
                                                            <div className="text-sm text-slate-500 flex items-center gap-1">
                                                                <Mail className="h-3 w-3" />
                                                                {tenantEmail}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-slate-400" />
                                                        <span className="text-slate-900 font-medium">{row.buildingName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Home className="h-4 w-4 text-slate-400" />
                                                        <span className="text-slate-900 font-medium">{row.unitNumber}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-slate-900 font-semibold">₹{row.rentAmount.toLocaleString()}</span>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                    {tableData.length === 0 && (
                        <div className="p-12 text-center">
                            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">
                                {searchQuery ? "No tenants found matching your search" : "No active tenants found"}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
            )}
        </div>
    );
}

