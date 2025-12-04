import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 72, 
    fontFamily: "Times-Roman", 
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 24,
    textAlign: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    textDecoration: "underline",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Times-Bold",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  sectionContent: {
    textAlign: "justify",
    marginBottom: 4,
  },
  paragraph: {
    marginBottom: 10,
  },
  listItem: {
    marginLeft: 24, 
    marginBottom: 4,
  },
  footer: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "45%",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderColor: "#000",
    marginBottom: 8,
    marginTop: 40,
  },
  signatureLabel: {
    fontSize: 10,
  }
});


const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "N/A";
  return `Rs. ${Number(amount).toLocaleString("en-IN")}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });
};

export default function LeaseAgreementDocument({ agreement, unit, owner }) {
  if (!agreement) return <Document><Page><Text>No Data</Text></Page></Document>;

  const tenant = agreement.tenant || {};
  const address = unit?.building?.address || {};

  const validOccupants = (agreement.otherOccupants || []).filter(
    occ => occ.name && occ.name.trim() !== ""
  );


  const getTitle = () => {
    if (agreement.rentingType === 'By Bedspace') return "SHARED ACCOMMODATION AGREEMENT";
    if (unit.unitType === 'Other') return "COMMERCIAL RENTAL AGREEMENT";
    return "RESIDENTIAL LEASE AGREEMENT";
  };

  const getUsageClause = () => {
    if (agreement.rentingType === 'By Bedspace') {
      return "The Tenant is leasing a specific Bedspace within the Premises. The Tenant shall have shared access to common areas (kitchen, living room, bathrooms) but does NOT have exclusive possession of the entire Unit. The Tenant agrees to respect the quiet enjoyment and rights of other occupants.";
    }
    if (unit.unitType === 'Other') {
      return "The Premises shall be used and occupied by the Tenant exclusively for the lawful purposes agreed upon by the Landlord and Tenant.";
    }
    return "The Premises shall be used and occupied by the Tenant and listed occupants exclusively as a private single-family residence. The Tenant shall have the right to exclusive possession of the entire Unit.";
  };

  const premisesAddress = [
    unit.unitNumber && `Unit ${unit.unitNumber}`,
    unit.building?.name,
    address.street,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean).join(", ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{getTitle()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. PARTIES</Text>
          <Text style={styles.sectionContent}>
            This Agreement is made and entered into on {getCurrentDate()}, by and between:
          </Text>
          <Text style={styles.sectionContent}>
            <Text style={{ fontFamily: "Times-Bold" }}>Landlord: </Text> 
            {owner.name || "N/A"} ("Landlord")
          </Text>
          <Text style={styles.sectionContent}>
            <Text style={{ fontFamily: "Times-Bold" }}>Tenant: </Text> 
            {tenant.name || "N/A"} ("Tenant")
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. PREMISES</Text>
          <Text style={styles.sectionContent}>
            The Landlord leases to the Tenant the premises located at:
          </Text>
          <Text style={styles.sectionContent}>{premisesAddress}.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. TERM AND NOTICE</Text>
          <Text style={styles.sectionContent}>
            The lease term shall commence on {formatDate(agreement.leaseStartDate)} and shall terminate on {formatDate(agreement.leaseEndDate)}.
          </Text>
          <Text style={styles.sectionContent}>
            Either party may terminate this Agreement early by providing one (1) month's written notice to the other party.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. RENT</Text>
          <Text style={styles.sectionContent}>
            The Tenant agrees to pay the Landlord a monthly rent of <Text style={{ fontFamily: "Times-Bold" }}>{formatCurrency(agreement.rentAmount)}</Text>.
          </Text>
          <Text style={styles.sectionContent}>
            The rent is due on the {agreement.rentDueDate}{getOrdinal(agreement.rentDueDate)} day of each calendar month.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. SECURITY DEPOSIT</Text>
          <Text style={styles.sectionContent}>
            Upon execution of this Agreement, the Tenant shall deposit with the Landlord the sum of <Text style={{ fontFamily: "Times-Bold" }}>{formatCurrency(agreement.securityDeposit)}</Text> as security for the faithful performance of the terms of this Agreement.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. USE OF PREMISES</Text>
          <Text style={styles.sectionContent}>{getUsageClause()}</Text>
          
          {validOccupants.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontFamily: "Times-Bold", fontSize: 11, marginBottom: 4 }}>
                Authorized Occupants:
              </Text>
              {validOccupants.map((occ, index) => (
                <Text key={index} style={styles.listItem}>
                  • {occ.name} {occ.relationship ? `(${occ.relationship})` : ""}
                </Text>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. DEFAULT AND TERMINATION</Text>
          <Text style={styles.sectionContent}>
            The Landlord may terminate this Agreement immediately if the Tenant:
          </Text>
          <Text style={styles.listItem}>(a) Fails to pay Rent when due;</Text>
          <Text style={styles.listItem}>(b) Engages in any illegal activity on the Premises;</Text>
          <Text style={styles.listItem}>(c) Materially breaches any specific term of this Agreement.</Text>
          <Text style={[styles.sectionContent, { marginTop: 4 }]}>
            Upon such termination, the Tenant shall immediately vacate the Premises and the Landlord shall be entitled to retain the Security Deposit to cover unpaid rent or damages.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. GOVERNING LAW</Text>
          <Text style={styles.sectionContent}>
            This Agreement shall be governed by and construed in accordance with the laws of the State of {address.state || "India"}.
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Landlord: {owner.name || "N/A"}</Text>
            <View style={styles.signatureLine} />
            <Text style={{ fontSize: 10 }}>Date: __________________</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Tenant: {tenant.name || "N/A"}</Text>
            <View style={styles.signatureLine} />
            <Text style={{ fontSize: 10 }}>Date: __________________</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}

const getOrdinal = (n) => {
  if (!n) return "";
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};