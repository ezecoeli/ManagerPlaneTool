import { useState } from "react";

const ModalInput = ({ isOpen, title, label, placeholder, onConfirm, onCancel }) => {
  const [value, setValue] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value.trim());
      setValue("");
    }
  };

  const handleCancel = () => {
    setValue("");
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6 w-full max-w-xs">
        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">{title}</h2>
        <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">{label}</label>
        <input
          className="w-full text-sm px-2 py-2 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder={placeholder}
          value={value}
          onChange={e => setValue(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            disabled={!value.trim()}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalInput;