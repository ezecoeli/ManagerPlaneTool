export const ROOM_OBJECT_TYPES = {
  'wall-horizontal': {
    name: 'Pared Horizontal',
    icon: '━',
    editable: false,
    defaultSize: { width: 120, height: 8 }
  },
  'wall-vertical': {
    name: 'Pared Vertical',
    icon: '┃',
    editable: false,
    defaultSize: { width: 8, height: 120 }
  },
  'wall-diagonal': {
    name: 'Pared Diagonal',
    icon: '╱',
    editable: false,
    defaultSize: { width: 80, height: 80 }
  },
  'wall-diagonal-reverse': {
    name: 'Pared Diagonal Inversa',
    icon: '╲',
    editable: false,
    defaultSize: { width: 80, height: 80 } 
  },
  'rectangle': {
    name: 'Cuadrado/Rectángulo',
    icon: '▢',
    defaultSize: { width: 300, height: 250 },
    color: '#374151'
  },
  'door': {
    name: 'Puerta',
    icon: '🚪',
    editable: false,
    defaultSize: { width: 40, height: 40 }
  },
  'text': {
    name: 'Etiqueta de Texto',
    icon: '📝',
    editable: false,
    defaultSize: { width: 120, height: 40 }
  }
};

export const createRoomObject = (type, position) => {
  const objectType = ROOM_OBJECT_TYPES[type];
  
  if (!objectType) {
    throw new Error(`Tipo de objeto desconocido: ${type}`);
  }

  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: type,
    position: position,
    size: { ...objectType.defaultSize },
    name: objectType.name,
    properties: {
      color: objectType.color,
      // Propiedades para rectángulo
      ...(type === 'rectangle' && {
        borderWidth: 8,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderRadius: 0
      }),
      // Propiedades  para texto
      ...(type === 'text' && {
        fontSize: 16, 
        fontWeight: 'normal',
        textAlign: 'center',
        color: '#000000', // color por defecto 
        backgroundColor: 'transparent',
        padding: 4 
      })
    }
  };
};