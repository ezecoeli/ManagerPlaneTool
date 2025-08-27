import { useState, useEffect } from 'react';
import { BsPencil, BsTrash } from 'react-icons/bs';

const ContextMenu = ({ x, y, object, onEdit, onDelete, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleClickOutside = () => {
      onClose();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const isDevice = object.hasOwnProperty('status');

  const handleAction = (action) => {
    if (action === 'edit') {
      onEdit(object);
    } else if (action === 'delete') {
      onDelete(object);
    }
    onClose();
  };

  return (
    <div
      className={`fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-2 transition-all duration-200 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transformOrigin: 'top left'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header con información del objeto */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
        <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
          {object.name || 'Sin nombre'}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {isDevice ? `Dispositivo (${object.type})` : `Objeto (${object.type})`}
        </div>
      </div>

      {/* Opciones del menú */}
      <div className="py-1">
        <button
          onClick={() => handleAction('edit')}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <BsPencil className="w-4 h-4" />
          <span>Editar</span>
        </button>
        
        <button
          onClick={() => handleAction('delete')}
          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center space-x-2"
        >
          <BsTrash className="w-4 h-4" />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
};

export default ContextMenu;