import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnitsByBuilding } from "@/slices/units-slice";
import { fetchAgreementsByUnit } from "@/slices/agreement-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Home, FileText, Plus } from "lucide-react";
import AddUnitModal from "./AddUnitModal";
import CreateAgreementModal from "./components/CreateAgreementModal";
import AgreementDetailsModal from "./components/AgreementDetailsModal";
import axios from "@/config/axios";

export default function BuildingDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [buildingName, setBuildingName] = useState(null);

  const { dataByBuildingId, isLoading, serverError } = useSelector(
    (state) => state.units
  );
  const buildings = useSelector((state) => state.buildings.data);
  const { agreementsByUnitId } = useSelector((state) => state.agreements);

  const units = dataByBuildingId[id] || [];

  useEffect(() => {
    if (id && !units.length) {
      dispatch(fetchUnitsByBuilding(id));
    }
  }, [dispatch, id, units.length]);

  useEffect(() => {
    const buildingFromStore = buildings.find((building) => building._id === id);
    if (buildingFromStore) {
      setBuildingName(buildingFromStore.name);
    } else if (id) {
      axios
        .get(`/api/buildings/${id}`, {
          headers: { Authorization: localStorage.getItem("token") },
        })
        .then((response) => {
          setBuildingName(response.data.name);
        })
        .catch((err) => {
          console.error("Failed to fetch building:", err);
        });
    }
  }, [id, buildings]);


  useEffect(() => {
    if (units.length > 0) {
      units.forEach((unit) => {
        if (unit.status === "occupied" && !agreementsByUnitId[unit._id]) {
          dispatch(fetchAgreementsByUnit(unit._id));
        }
      });
    }
  }, [units, dispatch,agreementsByUnitId]);


  const hasByUnitAgreement = (unitId) => {
    const agreements = agreementsByUnitId[unitId] || [];
    return agreements.some(
      (agreement) => agreement.isActive && agreement.rentingType === "By Unit"
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Building Details</h1>
      <p className="text-gray-500 mb-6">
        Showing units for {buildingName ? (
          <span className="font-semibold">{buildingName}</span>
        ) : (
          <span className="font-mono">Building ID: {id}</span>
        )}
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
              <div className="flex justify-end gap-2 px-4 pb-3">
                {unit.status === "vacant" ? (
                  <>
                    <CreateAgreementModal unit={unit} buildingId={id}>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Home className="h-3 w-3 mr-1" />
                        Rent
                      </Button>
                    </CreateAgreementModal>
                    <AddUnitModal buildingId={id} unit={unit}>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </AddUnitModal>
                  </>
                ) : hasByUnitAgreement(unit._id) ? (
                  <>
                    <AgreementDetailsModal unitId={unit._id}>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        View Lease
                      </Button>
                    </AgreementDetailsModal>
                    <AddUnitModal buildingId={id} unit={unit}>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </AddUnitModal>
                  </>
                ) : (
                  <>
                    <CreateAgreementModal unit={unit} buildingId={id}>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Bedspace
                      </Button>
                    </CreateAgreementModal>
                    <AgreementDetailsModal unitId={unit._id}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="View Agreements"
                      >
                        <FileText className="h-3 w-3" />
                      </Button>
                    </AgreementDetailsModal>
                    <AddUnitModal buildingId={id} unit={unit}>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </AddUnitModal>
                  </>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}