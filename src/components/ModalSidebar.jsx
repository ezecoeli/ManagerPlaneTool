import { useState } from "react";

const ModalSidebar = ({
  isOpen,
  title,
  label,
  placeholder,
  onConfirm,
  onCancel,
  children,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showError, setShowError] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (inputValue.trim()) {
      onConfirm(inputValue.trim());
      setInputValue("");
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  const handleCancel = () => {
    setInputValue("");
    setShowError(false);
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-xs">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">{title}</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleConfirm();
          }}
        >
          {children}
          <label className="block text-sm mb-1">{label}</label>
          <input
            type="text"
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value);
              setShowError(false);
            }}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-200"
          />
          {showError && (
            <div className="text-red-500 text-xs mt-2">* Para confirmar rellena los campos.</div>
          )}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-600 text-white"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default ModalSidebar;