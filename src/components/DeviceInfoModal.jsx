import { useState, useEffect } from 'react';
import { useFloors } from '../hooks/useDatabase.jsx';
import { DEVICE_TYPES } from '../data/devicesTypes.js';

const DeviceInfoModal = ({ deviceType, currentFloor, currentZone, onSave, onCancel }) => {
  const { floors, loading } = useFloors();

  const [deviceData, setDeviceData] = useState({
    name: '',
    floor: currentFloor,
    zone: currentZone,
    type: deviceType,
    status: 'active',
    specs: {}
  });

  const [errors, setErrors] = useState({});

  // labels para campos en español
  const getFieldLabels = () => ({
    name: 'Nombre del Dispositivo',
    ram: 'Memoria RAM',
    processor: 'Procesador',
    ip: 'Dirección IP',
    mac: 'Dirección MAC',
    os: 'Sistema Operativo',
    network_port: 'Puerto de Red',
    model: 'Modelo',
    toner: 'Nivel de Tóner',
    info: 'Información Adicional'
  });

  // placeholders para los campos
  const getFieldPlaceholders = () => ({
    name: 'Ej: PC-Oficina-001',
    ram: 'Ej: 8 GB',
    processor: 'Ej: Intel Core i5',
    ip: 'Ej: 192.168.1.100',
    mac: 'Ej: AA:BB:CC:DD:EE:FF',
    os: 'Ej: Windows 11',
    network_port: 'Ej: A12',
    model: 'Ej: HP LaserJet Pro',
    toner: 'Ej: 85%',
    info: 'Información adicional del dispositivo'
  });

  useEffect(() => {
    // Inicializar con specs predeterminadas del tipo de dispositivo
    const typeConfig = DEVICE_TYPES[deviceType];
    if (typeConfig && typeConfig.defaultSpecs) {
      setDeviceData(prev => ({
        ...prev,
        specs: { ...typeConfig.defaultSpecs }
      }));
    }
  }, [deviceType]);

  // LOADING 
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="text-center">Cargando...</div>
        </div>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    if (field === 'name') {
      setDeviceData(prev => ({ ...prev, [field]: value }));
    } else {
      setDeviceData(prev => ({
        ...prev,
        specs: { ...prev.specs, [field]: value }
      }));
    }
    
    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!deviceData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(deviceData);
    }
  };

  const typeConfig = DEVICE_TYPES[deviceType];
  
  if (!typeConfig) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="text-center text-red-600">
            Error: Tipo de dispositivo no válido
          </div>
          <button onClick={onCancel} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const currentFloorData = floors.find(floor => floor.id === deviceData.floor);
  const availableZones = currentFloorData ? currentFloorData.zones : [];
  const fieldLabels = getFieldLabels();
  const fieldPlaceholders = getFieldPlaceholders();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Agregar {typeConfig.name}
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

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* campos dinamicos según el tipo */}
            {typeConfig.fields && typeConfig.fields.map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {fieldLabels[field] || field} {field === 'name' ? '*' : ''}
                </label>
                <input
                  type="text"
                  value={field === 'name' ? deviceData.name : (deviceData.specs[field] || '')}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[field] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={fieldPlaceholders[field] || `Ingrese ${field}`}
                />
                {errors[field] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}

            {/* Planta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Planta
              </label>
              <select
                value={deviceData.floor}
                onChange={(e) => {
                  const newFloor = e.target.value;
                  const newFloorData = floors.find(floor => floor.id === newFloor);
                  setDeviceData(prev => ({
                    ...prev,
                    floor: newFloor,
                    zone: newFloorData && newFloorData.zones.length > 0 ? newFloorData.zones[0].id : ''
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {floors.map(floor => (
                  <option key={floor.id} value={floor.id}>
                    {floor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Zona */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zona
              </label>
              <select
                value={deviceData.zone}
                onChange={(e) => setDeviceData(prev => ({ ...prev, zone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableZones.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={deviceData.status}
                onChange={(e) => setDeviceData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="error">Error</option>
              </select>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Agregar Dispositivo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeviceInfoModal;