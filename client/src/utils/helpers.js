export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(amount);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatDateShort = (date) =>
  new Date(date).toLocaleDateString('en-ZA', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const calculateNights = (checkIn, checkOut) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(checkOut) - new Date(checkIn)) / msPerDay);
};

export const statusColors = {
  PENDING:   { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  CONFIRMED: { bg: '#f0f9e4', text: '#3a4a1a', dot: '#6e8c30' },
  REJECTED:  { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
  CANCELLED: { bg: '#f5ede0', text: '#7a5c42', dot: '#b89b82' },
  COMPLETED: { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
};

export const StatusBadge = ({ status }) => {
  const colors = statusColors[status] || statusColors.PENDING;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600,
      background: colors.bg, color: colors.text,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.dot }} />
      {status}
    </span>
  );
};
