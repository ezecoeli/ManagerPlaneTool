import { useState, useEffect } from 'react';
import { useFloors } from '../hooks/useDatabase.jsx';
import { DEVICE_TYPES } from '../data/devicesTypes.js';
import { BsPlus, BsTrash } from 'react-icons/bs';
import { GiPositionMarker } from "react-icons/gi";

const DeviceInfoModal = ({ deviceType, currentFloor, currentZone, onSave, onCancel }) => {
  const { floors, loading } = useFloors();
  
  const [deviceData, setDeviceData] = useState({
    name: '',
    type: deviceType,
    floor: currentFloor,
    zone: currentZone,
    status: 'active',
    customProperties: []
  });

  const [newPropertyName, setNewPropertyName] = useState('');
  const [newPropertyValue, setNewPropertyValue] = useState('');
  const [errors, setErrors] = useState({});
  const [availableLocations, setAvailableLocations] = useState([]);

  useEffect(() => {
    if (floors.length > 0) {
      const locations = [];
      floors.forEach(floor => {
        floor.zones.forEach(zone => {
          locations.push({
            id: `${floor.id}-${zone.id}`,
            floorId: floor.id,
            zoneId: zone.id,
            displayName: `${floor.name} > ${zone.name}`
          });
        });
      });
      setAvailableLocations(locations);
    }
  }, [floors]);

  const getCurrentLocationId = () => {
    if (deviceData.floor && deviceData.zone) {
      return `${deviceData.floor}-${deviceData.zone}`;
    }
    return '';
  };

  const handleLocationChange = (locationId) => {
    if (!locationId) {
      setDeviceData(prev => ({ ...prev, floor: '', zone: '' }));
      return;
    }

    const location = availableLocations.find(loc => loc.id === locationId);
    if (location) {
      setDeviceData(prev => ({
        ...prev,
        floor: location.floorId,
        zone: location.zoneId
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setDeviceData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const addCustomProperty = () => {
    if (newPropertyName.trim() && newPropertyValue.trim()) {
      const newProperty = {
        id: Date.now().toString(),
        name: newPropertyName.trim(),
        value: newPropertyValue.trim()
      };
      
      setDeviceData(prev => ({
        ...prev,
        customProperties: [...prev.customProperties, newProperty]
      }));
      
      setNewPropertyName('');
      setNewPropertyValue('');
    }
  };

  const removeCustomProperty = (propertyId) => {
    setDeviceData(prev => ({
      ...prev,
      customProperties: prev.customProperties.filter(prop => prop.id !== propertyId)
    }));
  };

  const updateCustomProperty = (propertyId, field, value) => {
    setDeviceData(prev => ({
      ...prev,
      customProperties: prev.customProperties.map(prop =>
        prop.id === propertyId ? { ...prop, [field]: value } : prop
      )
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!deviceData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!deviceData.floor || !deviceData.zone) {
      newErrors.location = 'Debe seleccionar una ubicación';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newDevice = {
        ...deviceData,
        id: Date.now().toString(),
      };
      
      onSave(newDevice);
    }
  };

  // LOADING 
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 transition-colors duration-200">
          <div className="text-center text-gray-800 dark:text-gray-200">Cargando...</div>
        </div>
      </div>
    );
  }

  const typeConfig = DEVICE_TYPES[deviceType];
  
  if (!typeConfig) {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 transition-colors duration-200">
          <div className="text-center text-red-600 dark:text-red-400">
            Error: Tipo de dispositivo no válido
          </div>
          <button onClick={onCancel} className="mt-4 px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto transition-colors duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Agregar {typeConfig.name}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre del dispositivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre del Dispositivo *
              </label>
              <input
                type="text"
                value={deviceData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200 ${
                  errors.name ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Ubicación unificada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Asignar a *
              </label>
              <select
                value={getCurrentLocationId()}
                onChange={(e) => handleLocationChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200 ${
                  errors.location ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Seleccionar ubicación...</option>
                {availableLocations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.displayName}
                  </option>
                ))}
              </select>
              {errors.location && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.location}</p>
              )}
              
              {deviceData.floor && deviceData.zone && (
                <div className="flex mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <GiPositionMarker className='w-4 h-4' /> Ubicación: {availableLocations.find(loc => loc.id === getCurrentLocationId())?.displayName}
                </div>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado
              </label>
              <select
                value={deviceData.status}
                onChange={(e) => setDeviceData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="error">Error</option>
              </select>
            </div>

            {/* Propiedades personalizadas */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">Propiedades del Dispositivo</h3>

              {/* Formulario para nueva propiedad */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 transition-colors duration-200">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={newPropertyName}
                      onChange={(e) => setNewPropertyName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-1">
                      Valor
                    </label>
                    <input
                      type="text"
                      value={newPropertyValue}
                      onChange={(e) => setNewPropertyValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addCustomProperty}
                  className="px-3 py-1 bg-blue-500 dark:bg-blue-600 text-white rounded text-sm hover:bg-blue-600 dark:hover:bg-blue-500 flex items-center space-x-1 transition-colors duration-200"
                >
                  <BsPlus className="w-4 h-4" />
                  <span>Añadir Propiedad</span>
                </button>
              </div>

              {/* Lista de propiedades existentes */}
              {deviceData.customProperties.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Propiedades añadidas:</div>
                  {deviceData.customProperties.map((property, index) => (
                    <div key={property.id} className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 transition-colors duration-200">
                      <input
                        type="text"
                        value={property.name}
                        onChange={(e) => updateCustomProperty(property.id, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                      />
                      <span className="text-gray-500 dark:text-gray-400">:</span>
                      <input
                        type="text"
                        value={property.value}
                        onChange={(e) => updateCustomProperty(property.id, 'value', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeCustomProperty(property.id)}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 transition-colors"
                        title="Eliminar propiedad"
                      >
                        <BsTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3 text-gray-500 dark:text-gray-400 text-sm">
                  No hay propiedades añadidas
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors duration-200"
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