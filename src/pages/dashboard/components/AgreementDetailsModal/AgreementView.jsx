import { Label } from "@/components/ui/label";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};

export default function AgreementView({ agreement, isCompact = false }) {
  if (!agreement) return null;

  const tenant = agreement.tenant || {};

  if (isCompact) {
    return (
      <div className="space-y-1 text-sm">
        <div className="font-medium">{tenant.name || "N/A"}</div>
        <div className="text-xs text-muted-foreground">{tenant.email || "N/A"}</div>
        <div className="text-xs font-semibold text-primary">
          ₹{agreement.rentAmount?.toLocaleString() || "0"} / month
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
        <div>
          <Label className="text-xs text-muted-foreground">Tenant</Label>
          <p className="text-sm font-medium">{tenant.name}</p>
          <p className="text-xs text-gray-500">{tenant.email}</p>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Contact</Label>
          <p className="text-sm">{tenant.phone || "N/A"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-muted-foreground">Rent Amount</Label>
          <p className="text-lg font-bold text-gray-900">₹{agreement.rentAmount?.toLocaleString()}</p>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Security Deposit</Label>
          <p className="text-sm">₹{agreement.securityDeposit?.toLocaleString() || "0"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-muted-foreground">Lease Start</Label>
          <p className="text-sm">{formatDate(agreement.leaseStartDate)}</p>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Lease End</Label>
          <p className="text-sm">{formatDate(agreement.leaseEndDate)}</p>
        </div>
      </div>

      {agreement.emergencyContact?.name && (
        <div className="pt-2 border-t">
          <Label className="text-xs text-muted-foreground mb-1 block">Emergency Contact</Label>
          <p className="text-sm">{agreement.emergencyContact.name} - <span className="text-gray-500">{agreement.emergencyContact.phone}</span></p>
        </div>
      )}

      {agreement.otherOccupants?.length > 0 && (
        <div className="pt-2 border-t">
          <Label className="text-xs text-muted-foreground mb-2 block">Other Occupants</Label>
          <ul className="space-y-1">
            {agreement.otherOccupants.map((occ, idx) => (
              <li key={idx} className="text-sm text-gray-600">• {occ.name} <span className="text-xs text-gray-400">({occ.relationship})</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}