import { motion } from "framer-motion";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

export default function StatCard({ icon: Icon, label, value, gradient, delay }) {
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
}