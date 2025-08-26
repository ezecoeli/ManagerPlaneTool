import { DEVICE_TYPES } from '../data/devicesTypes.js';

const DeviceTypeSelector = ({ onSelectType, onCancel }) => {
  const deviceOptions = [
    { key: 'desktop', label: 'PC Escritorio' },
    { key: 'laptop', label: 'Notebook' },
    { key: 'network', label: 'Red' },
    { key: 'printer', label: 'Impresora' },
    { key: 'others', label: 'Otros Dispositivos' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-80 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Seleccionar Dispositivo</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-2">
          {deviceOptions.map(option => {
            const deviceType = DEVICE_TYPES[option.key];
            const IconComponent = deviceType?.icon;
            
            return (
              <button
                key={option.key}
                onClick={() => onSelectType(option.key)}
                className="w-full p-3 text-left rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center"
              >
                
                <div className="w-10 h-10 rounded-lg mr-3 flex items-center justify-center bg-gray-100">
                  {IconComponent && (
                    <IconComponent 
                      className="w-6 h-6 text-gray-600" 
                    />
                  )}
                </div>
                
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{deviceType?.name}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceTypeSelector;