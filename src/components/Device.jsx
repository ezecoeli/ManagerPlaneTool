import { useState } from 'react';
import { DEVICE_TYPES, DEVICE_STATUS } from '../data/devicesTypes.js';

const Device = ({ device, zoom, onStartDrag, isBeingDragged = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const deviceType = DEVICE_TYPES[device.type];
  const deviceStatus = DEVICE_STATUS[device.status];
  const IconComponent = deviceType?.icon;

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      console.log('Device mouseDown:', device.id);
      onStartDrag(device, e);
    }
  };

  const handleDoubleClick = () => {
    console.log('Abrir modal para dispositivo:', device.id);
  };

  // Función para obtener propiedades personalizadas
  const getCustomProperties = () => {
    if (!device.specs) return [];
    
    // Obtener campos predefinidos del tipo de dispositivo
    const predefinedFields = deviceType?.fields || [];
    
    // Filtrar specs para encontrar propiedades personalizadas
    const customProperties = Object.entries(device.specs).filter(([key, value]) => {
      return !predefinedFields.includes(key) && value && value.toString().trim() !== '';
    });

    return customProperties;
  };

  const deviceSize = Math.max(24, 38 / zoom);
  const tooltipScale = Math.max(0.8, 1 / zoom);
  const customProperties = getCustomProperties();

  return (
    <div
      className={`absolute select-none cursor-grab active:cursor-grabbing transition-opacity ${
        isBeingDragged ? 'opacity-30' : 'hover:scale-105'
      }`}
      style={{
        left: device.position.x,
        top: device.position.y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: isBeingDragged ? 'none' : 'auto',
        zIndex: 50 
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => !isBeingDragged && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onDoubleClick={handleDoubleClick}
    >

      <div
        className="flex items-center justify-center transition-all duration-200"
        style={{
          width: deviceSize,
          height: deviceSize,
        }}
      >
        
        {IconComponent ? (
          <IconComponent 
            className="transition-all duration-200 text-black dark:text-white" 
            style={{
              width: deviceSize * 0.6,
              height: deviceSize * 0.6,
            }}
          />
        ) : (
          <span 
            className="text-center leading-none text-gray-700"
            style={{ fontSize: deviceSize * 0.6 }}
          >
            📱
          </span>
        )}
      </div>

      {/* Status Indicator */}
      <div
        className="absolute -top-1 rounded-full "
        style={{
          backgroundColor: deviceStatus?.color || '#22c55e',
          width: deviceSize * 0.25,
          height: deviceSize * 0.25
        }}
        title={deviceStatus?.name || 'Activo'}
      />

      {showTooltip && !isBeingDragged && (
        <div
          className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none"
          style={{
            bottom: deviceSize + 10,
            left: '50%',
            transform: `translateX(-50%) scale(${tooltipScale})`,
            transformOrigin: 'bottom center',
            zIndex: 9999,
            minWidth: '200px',
            maxWidth: '300px'
          }}
        >
          <div className="text-sm font-medium">{device.name}</div>
          <div className="text-xs text-gray-300 mb-2">
            {deviceType?.name || 'Dispositivo'} • {deviceStatus?.name || 'Activo'}
          </div>
          
          {/* Propiedades predefinidas importantes */}
          {device.specs?.ip && (
            <div className="text-xs text-gray-400 mb-1">IP: {device.specs.ip}</div>
          )}
          {device.specs?.mac && (
            <div className="text-xs text-gray-400 mb-1">MAC: {device.specs.mac}</div>
          )}
          
          {/* Propiedades personalizadas */}
          {customProperties.length > 0 && (
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="text-xs text-gray-300 font-medium mb-1">Propiedades personalizadas:</div>
              {customProperties.slice(0, 3).map(([key, value]) => (
                <div key={key} className="text-xs text-gray-400 mb-1">
                  {key}: {value}
                </div>
              ))}
              {customProperties.length > 3 && (
                <div className="text-xs text-gray-500 italic">
                  +{customProperties.length - 3} 
                </div>
              )}
            </div>
          )}
          
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};

export default Device;