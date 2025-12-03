export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatCurrency = (amount) => {
    return `₹ ${new Intl.NumberFormat('en-IN').format(amount)}`;
};

export const formatAddress = (address) => {
    if (!address) return "Address not available";
    if (typeof address === 'string') return address;
    
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.zipCode || address.pincode) parts.push(address.zipCode || address.pincode);
    
    return parts.length > 0 ? parts.join(', ') : "Address not available";
};

export const calculateDaysUntilRenewal = (leaseEndDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(leaseEndDate);
    endDate.setHours(0, 0, 0, 0);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};

export const calculateNextPaymentDate = (rentDueDate) => {
    if (!rentDueDate) return "Not set";
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();
    
    // Get the last day of the current month to handle edge cases like Feb 30
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dueDay = Math.min(rentDueDate, lastDayOfMonth);
    
    let nextPaymentDate;
    if (currentDay < dueDay) {
        // Payment date is later this month
        nextPaymentDate = new Date(currentYear, currentMonth, dueDay);
    } else {
        // Payment date is next month
        const nextMonthLastDay = new Date(currentYear, currentMonth + 2, 0).getDate();
        const nextMonthDueDay = Math.min(rentDueDate, nextMonthLastDay);
        nextPaymentDate = new Date(currentYear, currentMonth + 1, nextMonthDueDay);
    }
    
    return formatDate(nextPaymentDate);
};