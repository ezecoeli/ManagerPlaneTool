import { DEVICE_TYPES } from '../data/devicesTypes.js';

const DeviceTypeSelector = ({ onSelectType, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Seleccionar Tipo de Dispositivo
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Device Types Grid */}
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(DEVICE_TYPES).map(([key, deviceType]) => {
              const IconComponent = deviceType.icon;
              return (
                <button
                  key={key}
                  onClick={() => onSelectType(key)}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-left"
                >
                  <div className="flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{deviceType.name}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Cancel Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceTypeSelector;