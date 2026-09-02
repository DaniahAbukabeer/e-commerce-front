import { X } from "lucide-react";

export const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">{title}</h2>
          <button
            className="admin-icon-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="admin-modal__body">{children}</div>
        {footer && <div className="admin-modal__footer">{footer}</div>}
      </div>
    </div>
  );
};
