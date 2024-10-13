import { useEffect } from "react";

export default function ErrorMessage({
  errors,
  onClose,
}: {
  errors: string[];
  onClose: () => void;
}) {
  console.log("ErrorMessage", errors);
  useEffect(() => {
    if (!errors.length) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [errors, onClose]);

  if (!errors.length) return null;

  return errors.map((error, index) => (
    <aside
      key={index}
      style={{
        bottom: 10 + 10 * (errors.length - index),
        right: 10 + 10 * (errors.length - index),
        zIndex: errors.length - index,
      }}
      className="error-message"
      data-testid="error"
    >
      <header>
        <h3>Error</h3>
      </header>
      <p>{error}</p>
    </aside>
  ));
}
