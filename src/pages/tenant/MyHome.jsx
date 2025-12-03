import { motion } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
    Home, Calendar, IndianRupee, FileText, 
    Building2, Clock, CheckCircle2 
} from "lucide-react";
import UserContext from "../../context/UserContext";
import SplitText from "../../components/SplitText";
import StatCard from "./components/StatCard";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function MyHome() {
    const { user } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Placeholder data - Connect to Redux later
    const residenceInfo = {
        unitNumber: "101-A",
        buildingName: "Quick Win Tower",
        address: "123 Innovation Drive, Tech City",
        leaseStartDate: "2025-01-01",
        leaseEndDate: "2025-12-31",
        monthlyRent: "₹ 20,000",
        status: "active",
        nextPaymentDate: "Dec 5, 2025",
        daysUntilRenewal: 45
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Home className="h-12 w-12 text-green-600 animate-pulse" />
                </motion.div>
            </div>
        );
    }

    const firstName = user?.name ? user.name.split(' ')[0] : 'Resident';
    const welcomeText = `Welcome Home, ${firstName}!`;

    return (
        <div className="max-w-7xl mx-auto p-4">
            {/* Header Area */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-green-100 rounded-2xl">
                        <Home className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                        {/* RESTORED: SplitText Component */}
                        <SplitText
                            text={welcomeText}
                            className="text-4xl font-bold text-gray-900"
                            delay={50}
                            duration={0.6}
                            textAlign="left"
                        />
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="text-gray-500 mt-1"
                        >
                            Here's an overview of your residence
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
                {/* Status Banner */}
                <motion.div variants={itemVariants} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-green-900">Lease Active</h3>
                        <p className="text-sm text-green-700">Your lease is current and in good standing</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-green-600 font-medium uppercase">Status</p>
                        <p className="text-lg font-bold text-green-700 capitalize">Active</p>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={Building2} label="Unit Number" value={residenceInfo.unitNumber} gradient="from-blue-500 to-blue-600" delay={0.1} />
                    <StatCard icon={IndianRupee} label="Monthly Rent" value={residenceInfo.monthlyRent} gradient="from-green-500 to-emerald-600" delay={0.2} />
                    <StatCard icon={Calendar} label="Next Payment" value={residenceInfo.nextPaymentDate} gradient="from-purple-500 to-purple-600" delay={0.3} />
                    <StatCard icon={Clock} label="Days Until Renewal" value={`${residenceInfo.daysUntilRenewal} days`} gradient="from-orange-500 to-orange-600" delay={0.4} />
                </div>

                {/* Split Layout: Details & Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left: Residence Details */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Home className="h-5 w-5 text-green-600" />
                                Residence Details
                            </h2>
                        </div>
                        <div className="p-6 grid gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Building</p>
                                    <p className="text-lg font-medium">{residenceInfo.buildingName}</p>
                                    <p className="text-sm text-gray-400">{residenceInfo.address}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <FileText className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Lease Period</p>
                                    <p className="text-lg font-medium">{residenceInfo.leaseStartDate} — {residenceInfo.leaseEndDate}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Quick Actions */}
                    <motion.div variants={itemVariants} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 h-fit">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link to="/tenant/agreement">
                                <motion.div 
                                    whileHover={{ scale: 1.02, backgroundColor: "rgb(240, 253, 244)", borderColor: "rgb(134, 239, 172)" }}
                                    className="flex items-center gap-3 p-4 bg-white rounded-xl border cursor-pointer transition-colors"
                                >
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <FileText className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">View Agreement</p>
                                        <p className="text-xs text-gray-500">Download PDF</p>
                                    </div>
                                </motion.div>
                            </Link>
                            
                            <motion.div 
                                whileHover={{ scale: 1.02, backgroundColor: "rgb(239, 246, 255)", borderColor: "rgb(147, 197, 253)" }}
                                className="flex items-center gap-3 p-4 bg-white rounded-xl border cursor-pointer transition-colors"
                            >
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <IndianRupee className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Pay Rent</p>
                                    <p className="text-xs text-gray-500">Make a payment</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </motion.div>
        </div>
    );
}