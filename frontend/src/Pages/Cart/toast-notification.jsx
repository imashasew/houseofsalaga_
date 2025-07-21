import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import "./toast-notification.css";

export default function ToastNotification({
  message,
  type = "success",
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="toast-wrapper">
      <div className={`toast ${type === "success" ? "success" : "info"}`}>
        <CheckCircle className="toast-icon" />
        <span className="toast-message">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="toast-close-btn"
        >
          <X className="toast-close-icon" />
        </button>
      </div>
    </div>
  );
}
