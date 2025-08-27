import { BsExclamationTriangle } from 'react-icons/bs';

const ConfirmDeleteModal = ({ isOpen, object, onConfirm, onCancel }) => {
  if (!isOpen || !object) return null;

  const isDevice = object.hasOwnProperty('status');
  const objectType = isDevice ? 'dispositivo' : 'objeto';

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 transition-colors duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <BsExclamationTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Confirmar eliminación
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>

          {/* Contenido */}
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300">
              ¿Estás seguro de que quieres eliminar el {objectType}{' '}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                "{object.name || 'Sin nombre'}"
              </span>?
            </p>
            
            {isDevice && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div><strong>Tipo:</strong> {object.type}</div>
                  <div><strong>Estado:</strong> {object.status}</div>
                  <div><strong>Ubicación:</strong> {object.floor} / {object.zone}</div>
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;