const ConfirmDeleteModal = ({ isOpen, object, onConfirm, onCancel }) => {
  if (!isOpen || !object) return null;

  const isDevice = object.hasOwnProperty('status');
  const isRoomObject = object.hasOwnProperty('size');

  const getObjectTypeInfo = () => {
    if (isDevice) {
      return {
        icon: '📱',
        type: 'dispositivo',
        name: object.name,
        details: `Tipo: ${object.type}`
      };
    } else if (isRoomObject) {
      return {
        icon: object.type === 'text' ? '📝' : 
              object.type.startsWith('wall') ? '🧱' : '🚪',
        type: 'objeto',
        name: object.name,
        details: `Tipo: ${object.type}`
      };
    }
    return { icon: '❓', type: 'elemento', name: 'Desconocido', details: '' };
  };

  const { icon, type, name, details } = getObjectTypeInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-[90vw]">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-3xl">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Eliminar {type}
            </h3>
            <p className="text-sm text-gray-600">
              Esta acción no se puede deshacer
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="font-medium text-gray-800 mb-1">{name}</div>
          <div className="text-sm text-gray-600">{details}</div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;