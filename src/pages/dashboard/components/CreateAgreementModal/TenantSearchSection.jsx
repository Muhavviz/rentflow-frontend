import { useDispatch, useSelector } from "react-redux";
import { searchTenant, clearSearchedTenant, resetUserError } from "@/slices/users-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search, UserPlus } from "lucide-react";

export default function TenantSearchSection({
  tenantEmail,
  setTenantEmail,
  showCreateTenant,
  setShowCreateTenant,
  setGlobalError,
  formik,
  isLoading,
}) {
  const dispatch = useDispatch();
  const { searchedTenant, isLoading: userLoading, serverError: userError } =
    useSelector((state) => state.users);

  const handleSearchTenant = async () => {
    if (!tenantEmail.trim()) {
      setGlobalError("Please enter an email address");
      return;
    }
    setGlobalError(null);
    dispatch(resetUserError());
    const action = await dispatch(searchTenant(tenantEmail.trim()));

    if (searchTenant.fulfilled.match(action)) {
      formik.setFieldValue("tenantId", action.payload._id);
      setShowCreateTenant(false);
    }
  };

  const handleEmailChange = (e) => {
    setTenantEmail(e.target.value);
    if (searchedTenant) {
      dispatch(clearSearchedTenant());
      formik.setFieldValue("tenantId", "");
    }
  };

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="tenantEmail">Search Tenant Email</Label>
        <div className="flex gap-2">
          <Input
            id="tenantEmail"
            type="email"
            placeholder="Enter tenant email"
            value={tenantEmail}
            onChange={handleEmailChange}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleSearchTenant}
            disabled={isLoading || !tenantEmail.trim()}
            variant="outline"
          >
            {userLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
        {userError && !searchedTenant && (
          <div className="space-y-2">
            <p className="text-xs text-red-500">
              {typeof userError === "string"
                ? userError
                : userError?.error || "Tenant not found"}
            </p>
            {!showCreateTenant && (
              <Button
                type="button"
                onClick={() => setShowCreateTenant(true)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Tenant not found. + Create New
              </Button>
            )}
          </div>
        )}
      </div>

      {searchedTenant && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm font-medium">Selected Tenant:</p>
            <p className="text-sm">{searchedTenant.name}</p>
            <p className="text-xs text-muted-foreground">
              {searchedTenant.email}
            </p>
            {searchedTenant.phone && (
              <p className="text-xs text-muted-foreground">
                {searchedTenant.phone}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}

