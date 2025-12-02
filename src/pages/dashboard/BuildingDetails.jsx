import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnitsByBuilding } from "@/slices/units-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import AddUnitModal from "./AddUnitModal";

export default function BuildingDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { dataByBuildingId, isLoading, serverError } = useSelector(
    (state) => state.units
  );

  const units = dataByBuildingId[id] || [];

  useEffect(() => {
    if (id && !units.length) {
      dispatch(fetchUnitsByBuilding(id));
    }
  }, [dispatch, id, units.length]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Building Details</h1>
      <p className="text-gray-500 mb-6">
        Showing units for Building ID: <span className="font-mono">{id}</span>
      </p>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Units</h2>
        <AddUnitModal buildingId={id}>
          <Button variant="outline" size="sm">
            Add Unit
          </Button>
        </AddUnitModal>
      </div>

      {isLoading && units.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          Loading units for this building...
        </p>
      )}

      {serverError && (
        <p className="text-center text-red-500 mt-4">
          {typeof serverError === "string"
            ? serverError
            : Array.isArray(serverError?.error)
            ? serverError.error.map((e) => e.message).join(", ")
            : typeof serverError?.error === "string"
            ? serverError.error
            : "Something went wrong while fetching units."}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {units.length === 0 && !isLoading ? (
          <p className="text-gray-500 text-sm col-span-full">
            No units found for this building yet.
          </p>
        ) : (
          units.map((unit) => (
            <Card
              key={unit._id}
              className="hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {unit.unitNumber}
                  </CardTitle>
                  {unit.unitType && (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 capitalize">
                      {unit.unitType}
                    </span>
                  )}
                </CardHeader>
                <CardContent>
                  {unit.floorNumber && (
                    <div className="text-xs text-muted-foreground mb-2">
                      Floor: {unit.floorNumber}
                    </div>
                  )}
                  {unit.rentAmount != null && (
                    <div className="text-lg font-semibold">
                      ₹ {unit.rentAmount}
                    </div>
                  )}
                  {unit.status && (
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      Status: {unit.status}
                    </p>
                  )}
                </CardContent>
              </div>
              <div className="flex justify-end px-4 pb-3">
                <AddUnitModal buildingId={id} unit={unit}>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Pencil className="h-3 w-3" />
                  </Button>
                </AddUnitModal>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}