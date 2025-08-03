type SimpleRiseSpinnerProps = {
  className?: string;
  color?: string;
  size?: string;
};

export const SimpleRiseSpinner = ({
  className,
  color,
  size,
}: SimpleRiseSpinnerProps) => {
  // Динамічні стилі для легкого налаштування
  const spinnerStyle = {
    "--spinner-color": color || "#fed7aa", // Колір за замовчуванням
    "--spinner-size": size || "15px", // Розмір за замовчуванням
  };

  return (
    <div
      className={`spinner-container ${className || ""}`}
      style={spinnerStyle as React.CSSProperties}
      role="status"
      aria-label="Завантаження..."
    >
      <div className="spinner-bar"></div>
      <div className="spinner-bar"></div>
      <div className="spinner-bar"></div>
      <div className="spinner-bar"></div>
      <div className="spinner-bar"></div>
    </div>
  );
};
