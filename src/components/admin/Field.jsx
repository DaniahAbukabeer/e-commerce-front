export const Field = ({ label, children }) => (
  <label className="admin-field">
    <span className="admin-field__label">{label}</span>
    {children}
  </label>
);
