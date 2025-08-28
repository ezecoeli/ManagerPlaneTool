import { useState } from 'react';
import { ROOM_OBJECT_TYPES } from '../data/roomTypes.js';
import { BsDoorOpen } from "react-icons/bs";
import { useTheme } from '../hooks/useTheme.jsx';

const EditableObject = ({ object, zoom, onStartDrag, onUpdate, isBeingDragged = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { theme } = useTheme(); 
  const objectType = ROOM_OBJECT_TYPES[object.type];

  const handleMouseDown = (e) => {
    if (e.button === 0) { 
      onStartDrag(object, e);
    }
  };

  const handleMouseEnter = () => {
    if (!isBeingDragged) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleObjectChange = (changes) => {
    if (onUpdate) {
      onUpdate(object.id, changes);
    }
  };

  const getZIndex = (objectType) => {
    switch(objectType) {
      case 'rectangle': 
        return 0;
      case 'wall-horizontal':
      case 'wall-vertical': 
      case 'wall-diagonal':
      case 'wall-diagonal-reverse':
        return 10;
      case 'door': 
        return 50;
      case 'text': 
        return 100;
      default: 
        return 25;
    }
  };

  const getDefaultBorderColor = () => {
    if (theme === 'dark') {
      return '#ffffff'; // white para modo oscuro
    } else {
      return '#374151'; // gray-700 para modo claro
    }
  };

  const renderObjectContent = () => {
    switch (object.type) {
      case 'wall-horizontal':
        return (
          <div className="w-full h-full relative">
            <div className="w-full h-full bg-gray-600 dark:bg-white border-t border-b border-gray-700 dark:border-gray-400 shadow-md" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gray-800 dark:bg-gray-500"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-400 dark:bg-gray-200"></div>
          </div>
        );
      
      case 'wall-vertical':
        return (
          <div className="w-full h-full relative">
            <div className="w-full h-full bg-gray-600 dark:bg-white border-l border-r border-gray-700 dark:border-gray-400 shadow-md" />
            <div className="absolute top-0 bottom-0 left-0 w-px bg-gray-800 dark:bg-gray-500"></div>
            <div className="absolute top-0 bottom-0 right-0 w-px bg-gray-400 dark:bg-gray-200"></div>
          </div>
        );
      
      case 'wall-diagonal':
        return (
          <div className="w-full h-full relative">
            <svg 
              width="100%" 
              height="100%" 
              className="absolute inset-0"
              style={{ pointerEvents: 'none' }}
            >
              <line 
                x1="0" 
                y1="100%" 
                x2="100%" 
                y2="0" 
                stroke="#4b5563" 
                className="dark:stroke-white"
                strokeWidth="8"
                strokeLinecap="round"
                style={{ pointerEvents: 'stroke' }}
              />
              <line 
                x1="2" 
                y1="100%" 
                x2="100%" 
                y2="2" 
                stroke="#374151" 
                className="dark:stroke-white"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ pointerEvents: 'none' }}
              />
            </svg>
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, transparent 45%, rgba(0,0,0,0.01) 47%, rgba(0,0,0,0.01) 53%, transparent 55%)',
                pointerEvents: 'auto'
              }}
            />
          </div>
        );
      
      case 'wall-diagonal-reverse':
        return (
          <div className="w-full h-full relative">
            <svg 
              width="100%" 
              height="100%" 
              className="absolute inset-0"
              style={{ pointerEvents: 'none' }}
            >
              <line 
                x1="0" 
                y1="0" 
                x2="100%" 
                y2="100%" 
                stroke="#4b5563" 
                className="dark:stroke-white"
                strokeWidth="8"
                strokeLinecap="round"
                style={{ pointerEvents: 'stroke' }}
              />
              <line 
                x1="2" 
                y1="2" 
                x2="100%" 
                y2="100%" 
                stroke="#374151" 
                className="dark:stroke-white"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ pointerEvents: 'none' }}
              />
            </svg>
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(45deg, transparent 45%, rgba(0,0,0,0.01) 47%, rgba(0,0,0,0.01) 53%, transparent 55%)',
                pointerEvents: 'auto'
              }}
            />
          </div>
        );
      
      case 'rectangle': {
        const hasCustomBg = object.properties?.backgroundColor && object.properties.backgroundColor !== 'transparent';
        const hasCustomBorder = object.properties?.color;
        
        return (
          <div className="w-full h-full relative">
            <div
              className="w-full h-full shadow-md"
              style={{
                // fondo transparente siempre
                backgroundColor: 'transparent',
                borderColor: hasCustomBorder ? object.properties.color : getDefaultBorderColor(),
                borderWidth: object.properties?.borderWidth || 8,
                borderStyle: object.properties?.borderStyle || 'solid',
                borderRadius: object.properties?.borderRadius || 0
              }}
            />
            {/* Efectos de esquina con colores adaptativos */}
            <div className={`absolute top-0 left-0 w-2 h-2 opacity-40 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}></div>
            <div className={`absolute top-0 right-0 w-2 h-2 opacity-40 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}></div>
            <div className={`absolute bottom-0 left-0 w-2 h-2 opacity-40 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}></div>
            <div className={`absolute bottom-0 right-0 w-2 h-2 opacity-40 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}></div>
          </div>
        );
      }

      case 'door':
        return (
          <div className="w-full h-full flex items-center justify-center text-black dark:text-white">
            <BsDoorOpen size={36} />
          </div>
        );
      
      case 'text':
        return (
          <div
            className="p-1 min-w-[20px] min-h-[20px] whitespace-pre-wrap break-words select-none"
            style={{
              fontSize: `${object.properties?.fontSize || 16}px`,
              color: object.properties?.color || '#000000',
              fontWeight: object.properties?.fontWeight || 'normal',
              // soporte para backgroundColor
              backgroundColor: object.properties?.backgroundColor !== 'transparent' 
                ? object.properties?.backgroundColor 
                : 'transparent',
              padding: object.properties?.backgroundColor !== 'transparent' 
                ? '4px 8px' 
                : '2px',
              borderRadius: object.properties?.backgroundColor !== 'transparent' 
                ? '4px' 
                : '0',
              // Sombra cuando hay fondo
              boxShadow: object.properties?.backgroundColor !== 'transparent' 
                ? '0 1px 3px rgba(0, 0, 0, 0.1)' 
                : 'none'
            }}
          >
            {object.name}
          </div>
        );
      
      default:
        return (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-600 border border-gray-400 dark:border-gray-500 flex items-center justify-center rounded">
            <span style={{ fontSize: Math.max(16, object.size.height * 0.5) }}>
              {objectType?.icon || '?'}
            </span>
          </div>
        );
    }
  };

  const style = {
    position: 'absolute',
    left: object.position.x,
    top: object.position.y,
    width: object.size.width,
    height: object.size.height,
    zIndex: getZIndex(object.type), 
    cursor: 'grab',
    opacity: isBeingDragged ? 0.3 : 1,
    pointerEvents: isBeingDragged ? 'none' : 'auto'
  };

  const getTooltipPosition = () => {
    const baseStyle = {
      position: 'absolute',
      zIndex: 9999, 
      backgroundColor: '#1f2937',
      color: 'white',
      borderRadius: '6px',
      padding: '8px 12px',
      fontSize: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none'
    };

    if (object.type === 'wall-vertical') {
      return {
        ...baseStyle,
        left: object.size.width + 8,
        top: '50%',
        transform: 'translateY(-50%)'
      };
    }
    
    if (object.type === 'wall-horizontal') {
      return {
        ...baseStyle,
        bottom: object.size.height + 8,
        left: '50%',
        transform: 'translateX(-50%)'
      };
    }

    if (object.type.startsWith('wall-diagonal')) {
      return {
        ...baseStyle,
        top: -40,
        right: -8
      };
    }

    return {
      ...baseStyle,
      bottom: object.size.height + 8,
      left: '50%',
      transform: 'translateX(-50%)'
    };
  };

  const tooltipScale = Math.max(0.8, 1 / zoom);

  return (
    <div
      style={style}
      className={`transition-opacity select-none ${
        isBeingDragged ? 'opacity-30' : ''
      }`}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {renderObjectContent()}

      {/* Tooltip con información de debugging */}
      {showTooltip && !isBeingDragged && (
        <div 
          style={{
            ...getTooltipPosition(),
            transform: `${getTooltipPosition().transform || ''} scale(${tooltipScale})`,
            transformOrigin: 'bottom center'
          }}
        >
          <div className="font-medium">{objectType?.name}</div>
          {object.type === 'text' && (
            <div className="text-xs text-gray-300">{object.name}</div>
          )}
          <div className="text-xs text-gray-400 mt-1">
            Z-Index: {getZIndex(object.type)} • X: {Math.round(object.position.x)}, Y: {Math.round(object.position.y)}
          </div>
          
          {/* Flecha del tooltip */}
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"
            style={{ display: object.type.startsWith('wall-diagonal') ? 'none' : 'block' }}
          />
        </div>
      )}
    </div>
  );
};

export default EditableObject;