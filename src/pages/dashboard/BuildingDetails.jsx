import { useParams } from "react-router-dom"
export default function BuildingDetails(){
    const {id} = useParams();
    
    return <div>
        <h1 className="text-2xl font-bold mb-4">Building Details</h1>
        <p className="text-gray-500">Showing units for Building ID: {id}</p>

        <div className="mt-8 p-10 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <h3 className="text-lg font-medium text-gray-900">Units List Container</h3>
            <p className="text-gray-500">We will fetch units using: GET /api/units?buildingId={id}</p>
        </div>
    </div>
}