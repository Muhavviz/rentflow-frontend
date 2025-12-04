import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAgreementsByOwner } from "@/slices/agreement-slice";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FileText, 
    Search, 
    Building2,
    Home,
    IndianRupee,
    Calendar,
    User,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const getStatusBadge = (status, isActive) => {
    if (!isActive || status === 'terminated') {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                <XCircle className="h-3 w-3" />
                Terminated
            </span>
        );
    }
    if (status === 'active') {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3" />
                Active
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3" />
            {status || 'Pending'}
        </span>
    );
};

export default function Agreements() {
    const dispatch = useDispatch();
    const { ownerAgreements, isLoading, serverError } = useSelector((state) => state.agreements);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!ownerAgreements || ownerAgreements.length === 0) {
            dispatch(fetchAgreementsByOwner());
        }
    }, [dispatch, ownerAgreements]);

    const filteredAgreements = (ownerAgreements || []).filter((agreement) => {
        if (!searchQuery) return true;
        
        const tenant = agreement.tenant || {};
        const tenantName = tenant.name || "";
        const tenantEmail = tenant.email || "";
        const building = (agreement.unit?.building || {});
        const buildingName = building.name || "";
        const unitNumber = agreement.unit?.unitNumber || "";
        
        const searchLower = searchQuery.toLowerCase();
        return (
            tenantName.toLowerCase().includes(searchLower) ||
            tenantEmail.toLowerCase().includes(searchLower) ||
            buildingName.toLowerCase().includes(searchLower) ||
            unitNumber.toLowerCase().includes(searchLower)
        );
    });

    const activeAgreements = filteredAgreements.filter(
        (agreement) => agreement.isActive && agreement.status === 'active'
    );
    const totalRent = activeAgreements.reduce((sum, a) => sum + (a.rentAmount || 0), 0);
    const totalDeposit = activeAgreements.reduce((sum, a) => sum + (a.securityDeposit || 0), 0);

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                        Agreements
                    </h2>
                    <p className="text-slate-500 mt-1.5">View all rental agreements and their details</p>
                </div>
            </motion.div>


            {serverError && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                >
                    <p className="text-red-600 text-sm">
                        Error loading agreements: {serverError?.error || serverError?.message || "Something went wrong"}
                    </p>
                </motion.div>
            )}


            {isLoading && !ownerAgreements?.length && (
                <div className="flex items-center justify-center py-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <FileText className="h-12 w-12 text-indigo-600 animate-pulse" />
                        <p className="text-slate-500 text-sm">Loading agreements...</p>
                    </motion.div>
                </div>
            )}


            {!isLoading && (
                <div className="grid gap-4 md:grid-cols-4">
                    {[
                        { 
                            label: "Total Agreements", 
                            value: filteredAgreements.length, 
                            icon: FileText, 
                            color: "from-blue-500 to-cyan-500" 
                        },
                        { 
                            label: "Active Agreements", 
                            value: activeAgreements.length, 
                            icon: CheckCircle, 
                            color: "from-green-500 to-emerald-500" 
                        },
                        { 
                            label: "Total Monthly Rent", 
                            value: `₹${totalRent.toLocaleString()}`, 
                            icon: IndianRupee, 
                            color: "from-indigo-500 to-violet-500" 
                        },
                        { 
                            label: "Security Deposit", 
                            value: `₹${totalDeposit.toLocaleString()}`, 
                            icon: IndianRupee, 
                            color: "from-purple-500 to-pink-500" 
                        },
                    ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                            <CardContent className="p-6 h-full">
                                <div className="flex items-center justify-between h-full">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-2 break-words">{stat.value}</p>
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

            {!isLoading && (
            <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by tenant name, email, building, or unit..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>
                </CardContent>
            </Card>
            )}


            {!isLoading && (
            <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
                    <CardTitle className="text-xl font-semibold text-slate-900">Agreements List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tenant</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Building / Unit</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Rent</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Lease Period</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <AnimatePresence>
                                    {filteredAgreements.map((agreement, index) => {
                                        const tenant = agreement.tenant || {};
                                        const unit = agreement.unit || {};
                                        const building = unit.building || {};
                                        
                                        const tenantName = tenant.name || "Unknown";
                                        const tenantEmail = tenant.email || "No email";
                                        const buildingName = building.name || "N/A";
                                        const unitNumber = unit.unitNumber || "N/A";
                                        const rentAmount = agreement.rentAmount || 0;
                                        const rentingType = agreement.rentingType || "N/A";
                                        
                                        return (
                                            <motion.tr
                                                key={agreement._id}
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
                                                            <div className="text-sm text-slate-500">{tenantEmail}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="h-4 w-4 text-slate-400" />
                                                            <span className="text-slate-900 font-medium text-sm">{buildingName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Home className="h-4 w-4 text-slate-400" />
                                                            <span className="text-slate-600 text-sm">Unit {unitNumber}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="space-y-1">
                                                        <div className="text-slate-900 font-semibold">₹{rentAmount.toLocaleString()}</div>
                                                        <div className="text-xs text-slate-500">per month</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                                        {rentingType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Calendar className="h-3 w-3 text-slate-400" />
                                                            <span className="text-slate-900">{formatDate(agreement.leaseStartDate)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                                            <span className="ml-5">to {formatDate(agreement.leaseEndDate)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(agreement.status, agreement.isActive)}
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                    {filteredAgreements.length === 0 && (
                        <div className="p-12 text-center">
                            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">
                                {searchQuery ? "No agreements found matching your search" : "No agreements found"}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
            )}
        </div>
    );
}

