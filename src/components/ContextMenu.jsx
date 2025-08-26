import { useState, useEffect } from 'react';
import { BsPin, BsPen, BsTrash, BsDeviceSsd } from "react-icons/bs";
import { IoHammerOutline } from "react-icons/io5";

const ContextMenu = ({ x, y, object, onEdit, onDelete, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleClickOutside = (e) => {
      onClose();
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 100);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const isDevice = object.hasOwnProperty('status');
  const isRoomObject = object.hasOwnProperty('size');

  const handleAction = (action) => {
    setIsVisible(false);
    setTimeout(() => {
      action();
      onClose();
    }, 150);
  };

  return (
    <div
      className={`fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[160px] transition-all duration-150 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{
        left: x,
        top: y,
        zIndex: 10000,
        transformOrigin: 'top left'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header con info del objeto */}
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="text-sm font-medium text-gray-800">
          {isDevice ? <BsDeviceSsd /> : <IoHammerOutline />}
          {isDevice ? ' Dispositivo' : ' Objeto'}
        </div>
        <div className="text-xs text-gray-500 truncate max-w-[140px]">
          {object.name}
        </div>
      </div>

      {/* Opciones */}
      <div className="py-1">
        
        {isRoomObject && object.type === 'text' && (
          <>
            <button
              onClick={() => handleAction(() => onEdit(object))}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2"
            >
              <span><BsPen /></span>
              <span>Editar texto</span>
            </button>
            <div className="border-t border-gray-100 my-1"></div>
          </>
        )}

        {isDevice && (
          <div className="px-3 py-2">
            <div className="text-xs text-gray-400 text-center">
              <BsPin /> Arrastra para mover
            </div>
            <div className="border-t border-gray-100 my-2"></div>
          </div>
        )}

        <button
          onClick={() => handleAction(() => onDelete(object))}
          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
        >
          <span><BsTrash /></span>
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
};

export default ContextMenu;