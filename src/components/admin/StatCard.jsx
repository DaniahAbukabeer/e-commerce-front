import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export const StatCard = ({
  label,
  value,
  delta,
  deltaDirection = "up",
  icon: Icon,
}) => {
  const isUp = deltaDirection === "up";
  return (
    <div className="admin-stat">
      <div className="admin-stat__top">
        <span className="admin-stat__label">{label}</span>
        {Icon && (
          <span className="admin-stat__icon">
            <Icon size={16} strokeWidth={2} />
          </span>
        )}
      </div>
      <div className="admin-stat__bottom">
        <span className="admin-stat__value">{value}</span>
        {delta && (
          <span
            className={`admin-stat__delta admin-stat__delta--${deltaDirection}`}
          >
            {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {delta}
          </span>
        )}
      </div>
    </div>
  );
};
