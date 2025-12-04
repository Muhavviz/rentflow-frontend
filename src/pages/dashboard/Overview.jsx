import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardStats } from "@/slices/users-slice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Home, Users, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, description, color, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">{title}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
              {description && (
                <p className="text-xs text-slate-500 mt-1">{description}</p>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Overview() {
  const dispatch = useDispatch();
  const { dashboardStats, statsLoading, statsError } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (statsLoading && !dashboardStats) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-3"
        >
          <Building2 className="h-12 w-12 text-indigo-600 animate-pulse" />
          <p className="text-slate-500 text-sm">Loading dashboard stats...</p>
        </motion.div>
      </div>
    );
  }

  if (statsError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-xl p-4"
      >
        <p className="text-red-600 text-sm">
          Error loading dashboard: {statsError?.error || statsError?.message || "Something went wrong"}
        </p>
      </motion.div>
    );
  }

  if (!dashboardStats) {
    return null;
  }

  const occupancyRate = dashboardStats.totalUnits > 0
    ? Math.round((dashboardStats.occupiedUnits / dashboardStats.totalUnits) * 100)
    : 0;

  const chartData = dashboardStats.occupancyByBuilding?.map((building) => ({
    name: building.buildingName.length > 15 
      ? building.buildingName.substring(0, 15) + '...' 
      : building.buildingName,
    occupancy: building.occupancyRate,
    occupied: building.occupiedUnits,
    total: building.totalUnits,
  })) || [];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

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
            Dashboard Overview
          </h2>
          <p className="text-slate-500 mt-1.5">High-level statistics and insights for your properties</p>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Properties"
          value={dashboardStats.totalBuildings || 0}
          icon={Building2}
          description="Buildings owned"
          color="from-blue-500 to-cyan-500"
          delay={0}
        />
        <StatCard
          title="Total Units"
          value={dashboardStats.totalUnits || 0}
          icon={Home}
          description="Active units"
          color="from-purple-500 to-pink-500"
          delay={0.1}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          icon={TrendingUp}
          description={`${dashboardStats.occupiedUnits || 0} of ${dashboardStats.totalUnits || 0} occupied`}
          color="from-green-500 to-emerald-500"
          delay={0.2}
        />
        <StatCard
          title="Active Tenants"
          value={dashboardStats.totalTenants || 0}
          icon={Users}
          description="Active agreements"
          color="from-indigo-500 to-violet-500"
          delay={0.3}
        />
      </div>


      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
              <CardTitle className="text-xl font-semibold text-slate-900">Occupancy by Building</CardTitle>
              <CardDescription className="text-slate-500">
                Percentage of occupied units per building
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ value: 'Occupancy %', angle: -90, position: 'insideLeft' }}
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'occupancy') {
                        const data = chartData.find(d => d.occupancy === value);
                        return [`${value}% (${data?.occupied || 0}/${data?.total || 0} units)`, 'Occupancy'];
                      }
                      return value;
                    }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="occupancy" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
            <CardTitle className="text-xl font-semibold text-slate-900">Recent Activity</CardTitle>
            <CardDescription className="text-slate-500">
              Latest 5 agreements created
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {dashboardStats.recentAgreements && dashboardStats.recentAgreements.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Unit</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tenant</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Rent</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Lease Period</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dashboardStats.recentAgreements.map((agreement, index) => (
                      <motion.tr
                        key={agreement._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{agreement.unitNumber || 'N/A'}</div>
                          <div className="text-xs text-slate-500">{agreement.buildingName || ''}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{agreement.tenantName || 'N/A'}</div>
                          <div className="text-xs text-slate-500">{agreement.tenantEmail || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-900">₹{agreement.rentAmount?.toLocaleString() || '0'}</span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="text-slate-900">{formatDate(agreement.leaseStartDate)}</div>
                          <div className="text-xs text-slate-500">to {formatDate(agreement.leaseEndDate)}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                          {formatDate(agreement.createdAt)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No recent agreements</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
