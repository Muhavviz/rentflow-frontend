import { useSelector, useDispatch } from "react-redux"
import { useEffect, useMemo } from "react";
import { fetchBuildings } from "@/slices/building-slice";
import { fetchUnitsByBuilding } from "@/slices/units-slice";
import { fetchDashboardStats } from "@/slices/users-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Pencil, Home } from "lucide-react";
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button";
import AddBuildingModal from "./AddBuildingModal";
import { motion } from "framer-motion";


export default function Buildings() {
    const dispatch = useDispatch();

    const { data: buildings, isLoading, serverError } = useSelector((state) => state.buildings)
    const { dataByBuildingId } = useSelector((state) => state.units)
    const { dashboardStats } = useSelector((state) => state.users)

    useEffect(() => {
        if (buildings.length == 0) {
            dispatch(fetchBuildings());
        }
    }, [dispatch, buildings.length]);

    useEffect(() => {
        if (!dashboardStats) {
            dispatch(fetchDashboardStats());
        }
    }, [dispatch, dashboardStats]);

    useEffect(() => {
        if (buildings.length > 0) {
            buildings.forEach((building) => {
                const hasUnitsInStore = dataByBuildingId[building._id]?.length > 0;
                const hasStats = dashboardStats?.occupancyByBuilding?.some(
                    (b) => String(b.buildingId) === String(building._id) || b.buildingName === building.name
                );
                
                if (!hasUnitsInStore && !hasStats) {
                    dispatch(fetchUnitsByBuilding(building._id));
                }
            });
        }
    }, [dispatch, buildings, dataByBuildingId, dashboardStats]);

    const buildingStats = useMemo(() => {
        const stats = {};
        
        buildings.forEach((building) => {
            const dashboardStat = dashboardStats?.occupancyByBuilding?.find(
                (b) => String(b.buildingId) === String(building._id) || b.buildingName === building.name
            );
            
            if (dashboardStat) {
                stats[building._id] = {
                    totalUnits: dashboardStat.totalUnits || 0,
                    occupiedUnits: dashboardStat.occupiedUnits || 0,
                    occupancyRate: dashboardStat.occupancyRate || 0,
                };
            } else {
                const units = dataByBuildingId[building._id] || [];
                const totalUnits = units.length;
                const occupiedUnits = units.filter((unit) => unit.status === "occupied").length;
                const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
                
                stats[building._id] = {
                    totalUnits,
                    occupiedUnits,
                    occupancyRate,
                };
            }
        });
        
        return stats;
    }, [buildings, dataByBuildingId, dashboardStats]);

    if (isLoading && buildings.length == 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-3"
                >
                    <Building2 className="h-12 w-12 text-indigo-600 animate-pulse" />
                    <p className="text-slate-500 text-sm">Loading buildings...</p>
                </motion.div>
            </div>
        );
    }

    if (serverError) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
            >
                <p className="text-red-600 text-sm">
                    Error loading buildings: {serverError?.error || serverError?.message || "Something went wrong"}
                </p>
            </motion.div>
        );
    }

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
                        My Buildings
                    </h2>
                    <p className="text-slate-500 mt-1.5">Manage your properties and view their occupancy status</p>
                </div>
                {buildings.length > 0 && <AddBuildingModal />}
            </motion.div>

            {!isLoading && buildings.length > 0 && (
                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        {
                            label: "Total Buildings",
                            value: buildings.length,
                            icon: Building2,
                            color: "from-blue-500 to-cyan-500"
                        },
                        {
                            label: "Total Units",
                            value: Object.values(buildingStats).reduce((sum, stat) => sum + (stat?.totalUnits || 0), 0),
                            icon: Home,
                            color: "from-purple-500 to-pink-500"
                        },
                        {
                            label: "Occupied Units",
                            value: Object.values(buildingStats).reduce((sum, stat) => sum + (stat?.occupiedUnits || 0), 0),
                            icon: Home,
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


            {buildings.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20 bg-white border border-dashed rounded-xl"
                >
                    <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No buildings yet</h3>
                    <p className="text-slate-500 mb-6">Start by adding your first property.</p>
                    <AddBuildingModal>
                        <Button variant='outline' className="rounded-xl">Create Building</Button>
                    </AddBuildingModal>
                </motion.div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {buildings.map((building, index) => (
                        <motion.div
                            key={building._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-base font-semibold text-slate-900">{building.name}</CardTitle>
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                                        <Building2 className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center text-sm text-slate-500 mb-4">
                                        <MapPin className="mr-1.5 h-4 w-4" />
                                        {building.address?.city}, {building.address?.state}
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900 mb-1">
                                        {buildingStats[building._id]?.totalUnits ?? 0} {buildingStats[building._id]?.totalUnits === 1 ? 'Unit' : 'Units'}
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4">
                                        {buildingStats[building._id]?.occupiedUnits ?? 0} of {buildingStats[building._id]?.totalUnits ?? 0} {buildingStats[building._id]?.totalUnits === 1 ? 'unit' : 'units'} occupied
                                    </p>
                                    <div className="mt-4 flex gap-2">
                                        <Link to={`/dashboard/buildings/${building._id}`} className="flex-1">
                                            <Button variant='secondary' className='w-full h-9 text-sm rounded-xl'>
                                                View Details
                                            </Button>
                                        </Link>
                                        <AddBuildingModal buildingId={building._id}>
                                            <Button variant='outline' size='sm' className='h-9 w-9 p-0 rounded-xl'>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </AddBuildingModal>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}