const LABELS = {
  out_of_stock: "Out of stock",
  low_stock: "Low stock",
  in_stock: "In stock",
  past_due: "Past due",
};

export const StatusBadge = ({ status }) => {
  const label =
    LABELS[status] ||
    (status ? status[0].toUpperCase() + status.slice(1) : "—");
  return (
    <span className={`admin-badge admin-badge--${status}`}>
      <span className="admin-badge__dot" />
      {label}
    </span>
  );
};
