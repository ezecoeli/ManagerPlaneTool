import { useState } from 'react';
import { useFloors } from '../hooks/useDatabase.jsx';
import { DEVICE_TYPES } from '../data/devicesTypes.js';
import { BsPlus, BsTrash } from 'react-icons/bs';
import { GiPositionMarker } from "react-icons/gi";

const DeviceInfoModal = ({ deviceType, currentFloor, currentZone, onSave, onCancel }) => {
  const { floors, loading } = useFloors();

  const [deviceData, setDeviceData] = useState({
    name: '',
    floor: currentFloor,
    zone: currentZone,
    type: deviceType,
    status: 'active',
    customProperties: []
  });

  const [errors, setErrors] = useState({});
  const [newPropertyName, setNewPropertyName] = useState('');
  const [newPropertyValue, setNewPropertyValue] = useState('');

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

  // Generar lista plana de todas las ubicaciones disponibles
  const getAvailableLocations = () => {
    const locations = [];
    
    floors.forEach(floor => {
      floor.zones.forEach(zone => {
        locations.push({
          id: `${floor.id}|${zone.id}`, // Usamos pipe como separador
          displayName: `${floor.name} > ${zone.name}`,
          floorId: floor.id,
          zoneId: zone.id,
          floorName: floor.name,
          zoneName: zone.name
        });
      });
    });
    
    return locations;
  };

  const availableLocations = getAvailableLocations();
  
  // Obtener la ubicación actual seleccionada
  const getCurrentLocationId = () => {
    return `${deviceData.floor}|${deviceData.zone}`;
  };

  // Manejar cambio de ubicación
  const handleLocationChange = (locationId) => {
    const [floorId, zoneId] = locationId.split('|');
    setDeviceData(prev => ({
      ...prev,
      floor: floorId,
      zone: zoneId
    }));
  };

  const handleInputChange = (field, value) => {
    setDeviceData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Funciones para manejar propiedades personalizadas
  const addCustomProperty = () => {
    if (!newPropertyName.trim() || !newPropertyValue.trim()) {
      alert('Por favor completa tanto el nombre como el valor de la propiedad');
      return;
    }

    // Verificar que no exista ya una propiedad con ese nombre
    const existsInCustom = deviceData.customProperties.some(prop => 
      prop.name.toLowerCase() === newPropertyName.toLowerCase()
    );

    if (existsInCustom) {
      alert('Ya existe una propiedad con ese nombre');
      return;
    }

    const newProperty = {
      id: `custom-${Date.now()}`,
      name: newPropertyName.trim(),
      value: newPropertyValue.trim()
    };

    setDeviceData(prev => ({
      ...prev,
      customProperties: [...prev.customProperties, newProperty]
    }));

    // Limpiar campos
    setNewPropertyName('');
    setNewPropertyValue('');
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
      newErrors.location = 'Debes seleccionar una ubicación';
    }
    
    // Validar que las propiedades personalizadas tengan nombre y valor
    deviceData.customProperties.forEach((prop, index) => {
      if (!prop.name.trim() || !prop.value.trim()) {
        newErrors[`custom-${index}`] = 'Las propiedades personalizadas deben tener nombre y valor';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Crear objeto specs a partir de las propiedades personalizadas
      const specs = {};
      deviceData.customProperties.forEach(prop => {
        specs[prop.name] = prop.value;
      });

      const finalDeviceData = {
        ...deviceData,
        specs: specs,
        customProperties: deviceData.customProperties
      };

      onSave(finalDeviceData);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
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
            {/* Nombre del dispositivo (obligatorio) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Dispositivo *
              </label>
              <input
                type="text"
                value={deviceData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Ubicación unificada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asignar a *
              </label>
              <select
                value={getCurrentLocationId()}
                onChange={(e) => handleLocationChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
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
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
              
              {/* Mostrar ubicación seleccionada */}
              {deviceData.floor && deviceData.zone && (
                <div className="flex mt-2 text-xs text-gray-500">
                  <GiPositionMarker className='w-4 h-4' /> Ubicación: {availableLocations.find(loc => loc.id === getCurrentLocationId())?.displayName}
                </div>
              )}
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

            {/* Sección de propiedades personalizadas */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Propiedades del Dispositivo</h3>

              {/* Formulario para nueva propiedad personalizada */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={newPropertyName}
                      onChange={(e) => setNewPropertyName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      Valor
                    </label>
                    <input
                      type="text"
                      value={newPropertyValue}
                      onChange={(e) => setNewPropertyValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addCustomProperty}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center space-x-1"
                >
                  <BsPlus className="w-5 h-5" />
                  <span>Añadir Propiedad</span>
                </button>
              </div>

              {/* Lista de propiedades personalizadas existentes */}
              {deviceData.customProperties.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">Propiedades añadidas:</div>
                  {deviceData.customProperties.map((property, index) => (
                    <div key={property.id} className="flex items-center space-x-2 bg-blue-50 rounded-lg p-3">
                      <input
                        type="text"
                        value={property.name}
                        onChange={(e) => updateCustomProperty(property.id, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-gray-500">:</span>
                      <input
                        type="text"
                        value={property.value}
                        onChange={(e) => updateCustomProperty(property.id, 'value', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeCustomProperty(property.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Eliminar propiedad"
                      >
                        <BsTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {errors[`custom-0`] && (
                    <p className="text-red-500 text-sm">{errors[`custom-0`]}</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-3 text-gray-500 text-sm">
                  No hay propiedades añadidas
                </div>
              )}
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