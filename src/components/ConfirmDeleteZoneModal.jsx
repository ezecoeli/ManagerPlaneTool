import { IoWarningOutline } from "react-icons/io5";
import { BsBuildings, BsPin } from "react-icons/bs";

const ConfirmDeleteZoneModal = ({ 
  isOpen, 
  type, 
  item,
  floorName, 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen || !item) return null;

  const isFloor = type === 'floor';
  const isZone = type === 'zone';

  const getDeleteInfo = () => {
    if (isFloor) {
      return {
        icon: <BsBuildings className="text-black dark:text-white" />,
        title: 'Eliminar Zona',
        name: item.name,
        description: `Esta zona contiene ${item.zones?.length || 0} sub-zona${item.zones?.length !== 1 ? 's' : ''}`,
        warning: 'Se eliminarán también todos los dispositivos y objetos asociados a esta zona.',
        warningLevel: 'high'
      };
    } else if (isZone) {
      return {
        icon: <BsPin />,
        title: 'Eliminar sub-zona',
        name: item.name,
        description: `Zona de la planta: ${floorName}`,
        warning: 'Se eliminarán también todos los dispositivos y objetos asociados a esta zona.',
        warningLevel: 'medium'
      };
    }
    
    return { icon: '', title: 'Eliminar', name: 'Desconocido', description: '', warning: '', warningLevel: 'low' };
  };

  const { icon, title, name, description, warning, warningLevel } = getDeleteInfo();

  const getWarningStyles = () => {
    switch (warningLevel) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'medium':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl p-6 w-[500px] max-w-[90vw]">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-4xl">{icon}</div>
          <div>
            <h3 className="text-xl font-semibold text-black dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              * Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        {/* Información del elemento */}
        <div className="bg-gray-50 dark:bg-gray-400 rounded-lg p-4 mb-4">
          <div className="font-medium text-gray-800 dark:text-black text-lg mb-1">{name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-800">{description}</div>
        </div>

        {/* Warning */}
        {warning && (
          <div className={`rounded-lg border p-4 mb-6 ${getWarningStyles()}`}>
            <div className="flex items-start space-x-2">
              <span className="text-xl"><IoWarningOutline /></span>
              <div>
                <div className="font-medium mb-1">¡Atención!</div>
                <div className="text-sm">{warning}</div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Input - Solo para zonas */}
        {isFloor && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              - Para confirmar, escribe el nombre de la zona:
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder={name}
              id="confirm-delete-input"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              // verificar que escribió el nombre correctamente
              if (isFloor) {
                const input = document.getElementById('confirm-delete-input');
                if (input.value.trim() !== name) {
                  alert('El nombre no coincide. Por favor, escribe el nombre exacto.');
                  return;
                }
              }
              onConfirm();
            }}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${
              warningLevel === 'high' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {isFloor ? 'Eliminar Zona' : 'Eliminar Sub-Zona'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteZoneModal;