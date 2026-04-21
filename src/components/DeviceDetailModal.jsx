import { DEVICE_TYPES, DEVICE_STATUS } from '../data/devicesTypes.js';

const DeviceDetailModal = ({ device, floors, onClose }) => {
  if (!device) return null;

  const typeConfig = DEVICE_TYPES[device.type];
  const statusConfig = DEVICE_STATUS[device.status];
  const Icon = typeConfig?.icon;

  const getLocationName = () => {
    const floor = floors.find(f => f.id === device.floor);
    const zone = floor?.zones?.find(z => z.id === device.zone);
    if (floor && zone) return `${floor.name} > ${zone.name}`;
    if (floor) return floor.name;
    return 'Sin ubicación';
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto transition-colors duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {Icon && <Icon className="w-6 h-6 text-[#007b8b] dark:text-teal-400 flex-shrink-0" />}
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 break-words">
                {device.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Detalles */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Tipo</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {typeConfig?.name || device.type || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Estado</p>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: statusConfig?.color || '#888' }}
                  />
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {statusConfig?.name || device.status || '—'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Ubicación</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{getLocationName()}</p>
            </div>

            {/* Propiedades personalizadas */}
            {device.customProperties && device.customProperties.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Propiedades</p>
                <div className="space-y-2">
                  {device.customProperties.map(prop => (
                    <div
                      key={prop.id}
                      className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-sm text-gray-600 dark:text-gray-400">{prop.name}</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 ml-4 text-right break-words">
                        {prop.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailModal;
