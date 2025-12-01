import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react";
import { fetchBuildings } from "@/slices/building-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Pencil } from "lucide-react";
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button";
import AddBuildingModal from "./AddBuildingModal";


export default function Buildings() {
    const dispatch = useDispatch();

    const { data: buildings, isLoading, serverError } = useSelector((state) => state.buildings)

    useEffect(() => {
        if (buildings.length == 0) {
            dispatch(fetchBuildings());
        }
    }, [dispatch, buildings.length]);

    if (isLoading && buildings.length == 0) {
        return <p className="text-center text-gray-500 mt-10">Loading your empire...</p>;
    }

    if (serverError) {
        return <p className="text-center text-red-500 mt-10">{serverError}</p>;
    }

    return <div>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Buildings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your properties and view their occupancy status.
                </p>
            </div>
            {buildings.length > 0 && <AddBuildingModal />}

        </div>

        {buildings.length === 0 ? (<div className="text-center py-20 bg-white border border-dashed rounded-lg">
            <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No buildings yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first property.</p>
            <AddBuildingModal>
                <Button variant='outline'>Create Building</Button>
            </AddBuildingModal>
        </div>) : (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {buildings.map((building) => (
                <Card key={building._id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{building.name}</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-xs text-muted-foreground mb-4">
                            <MapPin className="mr-1 h-3 w-3" />
                            {building.address?.city}, {building.address?.state}
                        </div>
                        <div className="text-2xl font-bold">
                            0 Units
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            0% Occupied
                        </p>
                        <div className="mt-4 flex gap-2" >
                            <Link to={`/dashboard/buildings/${building._id}`} className="flex-1">
                                <Button variant='secondary' className='w-full h-8 text-xs' >
                                    View Details
                                </Button>
                            </Link>
                            <AddBuildingModal buildingId={building._id}>
                                <Button variant='outline' size='sm' className='h-8 w-8 p-0'>
                                    <Pencil className="h-3 w-3" />
                                </Button>
                            </AddBuildingModal>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>)}
    </div>
}