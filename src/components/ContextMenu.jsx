import { BsPencil, BsTrash } from "react-icons/bs";
import { ROOM_OBJECT_TYPES } from '../data/roomTypes.js';

const ContextMenu = ({ x, y, object, onEdit, onDelete, onClose }) => {
  if (!object) return null;

  const handleAction = (action) => {
    if (action === 'edit') {
      onEdit(object);
    } else if (action === 'delete') {
      onDelete(object);
    }
    onClose();
  };

  //  detección de dispositivos
  const isDevice = object.hasOwnProperty('status') || 
                   object.hasOwnProperty('customProperties') ||
                   (object.hasOwnProperty('type') && !ROOM_OBJECT_TYPES[object.type]);
  
  const objectType = ROOM_OBJECT_TYPES[object.type];
  
  const isEditable = () => {
    if (isDevice) {
      return true; 
    }
    
    // Verificar la propiedad editable del roomType
    if (objectType && objectType.hasOwnProperty('editable')) {
      return objectType.editable === true;
    }
    
    return false;
  };

  // información de display
  const getObjectDisplayInfo = () => {
    if (isDevice) {
      return {
        type: 'Dispositivo',
        name: object.name || 'Sin nombre',
        subtitle: object.type || 'Tipo desconocido'
      };
    } else {
      return {
        type: objectType?.name || object.type,
        name: object.name || objectType?.name || 'Sin nombre',
        subtitle: null
      };
    }
  };

  const displayInfo = getObjectDisplayInfo();

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[180px] transition-colors duration-200"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: 'translate(-50%, -100%)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del menú contextual */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {displayInfo.type}
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {displayInfo.name}
          </div>
          
          {displayInfo.subtitle && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {displayInfo.subtitle}
            </div>
          )}
        </div>

        {/* Opciones del menú */}
        <div className="py-1">
          {/* Mostrar botón editar si es editable */}
          {isEditable() && (
            <button
              onClick={() => handleAction('edit')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <BsPencil className="w-4 h-4" />
              <span>Editar</span>
            </button>
          )}
          
          {/* Botón eliminar siempre visible */}
          <button
            onClick={() => handleAction('delete')}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center space-x-2"
          >
            <BsTrash className="w-4 h-4" />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContextMenu;