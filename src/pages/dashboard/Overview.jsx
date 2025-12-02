import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardStats } from "@/slices/users-slice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Home, Users, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading dashboard stats...</p>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">Error loading dashboard: {statsError?.error || "Something went wrong"}</p>
      </div>
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          High-level statistics and insights for your properties
        </p>
      </div>


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Properties"
          value={dashboardStats.totalBuildings || 0}
          icon={Building2}
          description="Buildings owned"
          delay={0}
        />
        <StatCard
          title="Total Units"
          value={dashboardStats.totalUnits || 0}
          icon={Home}
          description="Active units"
          delay={0.1}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          icon={TrendingUp}
          description={`${dashboardStats.occupiedUnits || 0} of ${dashboardStats.totalUnits || 0} occupied`}
          delay={0.2}
        />
        <StatCard
          title="Active Tenants"
          value={dashboardStats.totalTenants || 0}
          icon={Users}
          description="Active agreements"
          delay={0.3}
        />
      </div>


      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Occupancy by Building</CardTitle>
              <CardDescription>
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
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest 5 agreements created
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardStats.recentAgreements && dashboardStats.recentAgreements.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Unit</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tenant</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rent</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Lease Period</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardStats.recentAgreements.map((agreement, index) => (
                      <motion.tr
                        key={agreement._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium">{agreement.unitNumber || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">{agreement.buildingName || ''}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{agreement.tenantName || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">{agreement.tenantEmail || ''}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">₹{agreement.rentAmount?.toLocaleString() || '0'}</span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div>{formatDate(agreement.leaseStartDate)}</div>
                          <div className="text-xs text-muted-foreground">to {formatDate(agreement.leaseEndDate)}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {formatDate(agreement.createdAt)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No recent agreements</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
