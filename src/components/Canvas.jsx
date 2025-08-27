import { useState } from 'react';
import { createRoomObject } from '../data/roomTypes.js';
import Device from './Device.jsx';
import EditableObject from './EditableObject.jsx';
import TextModal from './TextModal.jsx';
import ContextMenu from './ContextMenu.jsx';
import ConfirmDeleteModal from './ConfirmDeleteModal.jsx';
import { BsPen, BsDoorOpen, BsTextLeft } from "react-icons/bs";
import { GiCrane, GiPositionMarker } from "react-icons/gi";

const Canvas = ({ 
  devices, 
  roomObjects,
  floorId, 
  zoneId, 
  onStartDrag, 
  onAddRoomObject,
  onUpdateRoomObject,
  onDeleteObject, 
  dragState 
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, object: null });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [objectToDelete, setObjectToDelete] = useState(null);

  const [editingText, setEditingText] = useState(null);
  const [showEditTextModal, setShowEditTextModal] = useState(false);

  const currentRoomObjects = roomObjects;

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const editOptions = [
    { id: 'wall-horizontal', icon: '━', label: 'Pared Horizontal' },
    { id: 'wall-vertical', icon: '┃', label: 'Pared Vertical' },
    { id: 'wall-diagonal', icon: '╱', label: 'Pared Diagonal ' },
    { id: 'wall-diagonal-reverse', icon: '╲', label: 'Pared Diagonal' },
    { id: 'rectangle', icon: '▢', label: 'Cuadrado/Rectángulo' },
    { id: 'door', icon: BsDoorOpen, label: 'Añadir Puerta', isReactIcon: true },
    { id: 'text', icon: BsTextLeft , label: 'Añadir Texto', isReactIcon: true }
  ];

  const handleEditOption = (optionId) => {
    setShowEditMenu(false);
    
    if (optionId === 'text') {
      setShowTextModal(true);
      return;
    }
    
    // Posición central simple
    const centerX = 400;
    const centerY = 300;
    
    const newObject = createRoomObject(optionId, { x: centerX, y: centerY });
    newObject.floor = floorId;
    newObject.zone = zoneId;
    
    onAddRoomObject(newObject);
  };

  // Función para crear nuevo texto
  const handleTextSave = (textData) => {
    const centerX = 400;
    const centerY = 300;
    
    const newObject = createRoomObject('text', { x: centerX, y: centerY });
    newObject.floor = floorId;
    newObject.zone = zoneId;
    newObject.name = textData.name;
    newObject.properties = { ...newObject.properties, ...textData.properties };
    
    onAddRoomObject(newObject);
    setShowTextModal(false);
  };

  // Función para actualizar texto existente
  const handleEditTextSave = (textData) => {
    if (editingText) {
      onUpdateRoomObject(editingText.id, {
        name: textData.name,
        properties: {
          ...editingText.properties,
          ...textData.properties
        }
      });
    }
    setShowEditTextModal(false);
    setEditingText(null);
  };

  const handleTextCancel = () => {
    setShowTextModal(false);
  };

  // Función para cancelar edición
  const handleEditTextCancel = () => {
    setShowEditTextModal(false);
    setEditingText(null);
  };

  const handleRoomObjectUpdate = (objectId, updatedData) => {
    onUpdateRoomObject(objectId, updatedData);
  };

  const handleContextMenu = (e, object) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      object
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0, object: null });
  };

  // Función de edición 
  const handleEditObject = (object) => {
    handleCloseContextMenu();
    
    // Solo permitir edición de objetos de texto
    if (object.type === 'text') {
      setEditingText(object);
      setShowEditTextModal(true);
    } else {
      // Para otros tipos de objeto, mostrar mensaje
      console.log('Este tipo de objeto no es editable:', object.type);
    }
  };

  const handleDeleteRequest = (object) => {
    setObjectToDelete(object);
    setShowDeleteModal(true);
    handleCloseContextMenu();
  };

  const handleConfirmDelete = () => {
    if (objectToDelete) {
      onDeleteObject(objectToDelete);
      setObjectToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setObjectToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200" data-canvas-container>
      {/* Canvas Header */}
      <div className="bg-white dark:bg-gray-700 border-b border-gray-300 dark:border-gray-500 px-4 py-3 flex items-center justify-between transition-colors duration-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Plano - {floorId} / {zoneId}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {devices.length} dispositivo{devices.length !== 1 ? 's' : ''} • {currentRoomObjects.length} objeto{currentRoomObjects.length !== 1 ? 's' : ''}
            {dragState?.isDragging && ' • 🎯 Arrastra para posicionar'}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowEditMenu(!showEditMenu)}
              className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 flex items-center space-x-2 transition-colors duration-200"
              disabled={dragState?.isDragging}
            >
              <BsPen className="w-4 h-4" />
              <span>Editar área de trabajo</span>
              <span className={`transform transition-transform ${showEditMenu ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {showEditMenu && !dragState?.isDragging && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10 transition-colors duration-200">
                {editOptions.map(option => {
                  const IconComponent = option.isReactIcon ? option.icon : null;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleEditOption(option.id)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 text-gray-700 dark:text-gray-200 transition-colors duration-200"
                    >
                      <div className="text-lg min-w-[24px] flex items-center justify-center">
                        {IconComponent ? (
                          <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        ) : (
                          <span className="text-center text-gray-700 dark:text-gray-200">{option.icon}</span>
                        )}
                      </div>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 transition-colors duration-200"
              title="Alejar"
              disabled={dragState?.isDragging}
            >
              <span className="text-lg">−</span>
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 transition-colors duration-200"
              title="Acercar"
              disabled={dragState?.isDragging}
            >
              <span className="text-lg">+</span>
            </button>
            <button
              onClick={handleResetView}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 transition-colors duration-200"
              title="Restablecer vista"
              disabled={dragState?.isDragging}
            >
              Restablecer
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 transition-colors duration-200">
          
          <div className="absolute inset-6" data-canvas-wrapper>
            <div className="w-full h-full bg-white dark:bg-gray-700 rounded-lg shadow-inner border-2 border-gray-300 dark:border-gray-600 transition-colors duration-200" data-canvas-background>
              <div 
                className="relative w-full h-full overflow-hidden rounded-lg"
                data-canvas-viewport
                style={{
                  transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                  transformOrigin: 'top left'
                }}
              >
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-40 dark:opacity-30">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path 
                          d="M 20 0 L 0 0 0 20" 
                          fill="none" 
                          stroke="#d1d5db" 
                          className="dark:stroke-gray-500"
                          strokeWidth="0.5"
                        />
                      </pattern>
                      <pattern id="gridMajor" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path 
                          d="M 100 0 L 0 0 0 100" 
                          fill="none" 
                          stroke="#9ca3af"
                          className="dark:stroke-gray-400"
                          strokeWidth="1"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <rect width="100%" height="100%" fill="url(#gridMajor)" />
                  </svg>
                </div>

                {/* Área de trabajo con identificador específico */}
                <div className="absolute inset-4 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg transition-colors duration-200" data-work-area>
                  <div className="absolute top-2 left-2 text-xs text-gray-400 dark:text-gray-400 font-medium">
                    Área de trabajo
                  </div>
                </div>

                {/* Room Objects con menú contextual */}
                {currentRoomObjects.map(roomObject => (
                  <div
                    key={roomObject.id}
                    onContextMenu={(e) => handleContextMenu(e, roomObject)}
                  >
                    <EditableObject
                      object={roomObject}
                      zoom={zoom}
                      onStartDrag={onStartDrag}
                      onUpdate={handleRoomObjectUpdate}
                      isBeingDragged={dragState?.dragObject?.id === roomObject.id}
                    />
                  </div>
                ))}

                {/* Devices con menú contextual */}
                {devices.map(device => (
                  <div
                    key={device.id}
                    onContextMenu={(e) => handleContextMenu(e, device)}
                  >
                    <Device
                      device={device}
                      zoom={zoom}
                      onStartDrag={onStartDrag}
                      isBeingDragged={dragState?.dragObject?.id === device.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Zona de exclusión visual */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-6 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 opacity-80 transition-colors duration-200"></div>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 opacity-80 transition-colors duration-200"></div>
            <div className="absolute top-6 bottom-6 left-0 w-6 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 opacity-80 transition-colors duration-200"></div>
            <div className="absolute top-6 bottom-6 right-0 w-6 bg-gray-100 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 opacity-80 transition-colors duration-200"></div>
          </div>
        </div>

        {/* Estado vacío */}
        {devices.length === 0 && currentRoomObjects.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="flex justify-center mb-4">
                <GiCrane className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-600 dark:text-gray-300">Plano vacío</h3>
              <p className="text-sm">
                Utiliza "+" para añadir dispositivos o <BsPen className="inline w-4 h-4 mx-1" /> para construir planos
              </p>
              <p className="text-xs mt-2 text-gray-400 dark:text-gray-400">
                Arrastra elementos para posicionarlos • Click derecho para eliminar
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Drag indicators */}
      {dragState?.isDragging && (
        <div className="flex justify-center absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200">
          <span className="flex text-sm">
            <GiPositionMarker className='w-5 h-5'/> Posicionamiento libre • "Esc" para cancelar
          </span>
        </div>
      )}

      {/* Click fuera para cerrar el menú */}
      {showEditMenu && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowEditMenu(false)}
        />
      )}

      {/*  Modal para crear nuevo texto */}
      <TextModal
        isOpen={showTextModal}
        initialText=""
        onSave={handleTextSave}
        onCancel={handleTextCancel}
      />

      {/* Modal para editar texto existente */}
      {editingText && (
        <TextModal
          isOpen={showEditTextModal}
          initialText={editingText.name}
          initialProperties={editingText.properties}
          onSave={handleEditTextSave}
          onCancel={handleEditTextCancel}
          isEditing={true}
        />
      )}

      {contextMenu.show && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          object={contextMenu.object}
          onEdit={handleEditObject}
          onDelete={handleDeleteRequest}
          onClose={handleCloseContextMenu}
        />
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        object={objectToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Canvas;