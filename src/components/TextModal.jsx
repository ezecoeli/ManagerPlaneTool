import { useState, useEffect } from 'react';

const TextModal = ({ 
  isOpen, 
  initialText = '', 
  initialProperties = {}, 
  onSave, 
  onCancel, 
  isEditing = false 
}) => {
  const [textData, setTextData] = useState({
    name: initialText,
    properties: {
      fontSize: '16',
      color: '#000000',
      fontWeight: 'normal',
      backgroundColor: 'transparent',
      padding: '4',
      ...initialProperties
    }
  });

  // actualizar cuando se abre el modal o cambia isEditing
  useEffect(() => {
    if (isOpen) {
      setTextData({
        name: initialText,
        properties: {
          fontSize: '16',
          color: '#000000',
          fontWeight: 'normal',
          backgroundColor: 'transparent',
          padding: '4',
          ...initialProperties
        }
      });
    }
  }, [isOpen, isEditing]); 

  // Resetear el estado cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      // Resetear a valores por defecto cuando se cierra
      setTextData({
        name: '',
        properties: {
          fontSize: '16',
          color: '#000000',
          fontWeight: 'normal',
          backgroundColor: 'transparent',
          padding: '4'
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (textData.name.trim()) {
      onSave(textData);
    }
  };

  const handleBackgroundChange = (value) => {
    setTextData(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        backgroundColor: value === 'transparent' ? 'transparent' : value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 transition-colors duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {isEditing ? 'Editar Texto' : 'Añadir Texto'}
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
          <div className="space-y-4">
            {/* Texto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Texto *
              </label>
              <textarea
                value={textData.name}
                onChange={(e) => setTextData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Escribe el texto aquí..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                rows={3}
              />
            </div>

            {/* Tamaño de fuente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tamaño de fuente
              </label>
              <select
                value={textData.properties.fontSize}
                onChange={(e) => setTextData(prev => ({
                  ...prev,
                  properties: { ...prev.properties, fontSize: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
              >
                <option value="12">12px</option>
                <option value="14">14px</option>
                <option value="16">16px</option>
                <option value="18">18px</option>
                <option value="20">20px</option>
                <option value="24">24px</option>
              </select>
            </div>

            {/* Color del texto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color del texto
              </label>
              <input
                type="color"
                value={textData.properties.color}
                onChange={(e) => setTextData(prev => ({
                  ...prev,
                  properties: { ...prev.properties, color: e.target.value }
                }))}
                className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              />
            </div>

            {/* Color de fondo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color de fondo
              </label>
              <div className="space-y-3">
                {/* Opción "Sin fondo" */}
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="backgroundType"
                    checked={textData.properties.backgroundColor === 'transparent'}
                    onChange={() => handleBackgroundChange('transparent')}
                    className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Sin fondo</span>
                </label>

                {/* Opción "Con color de fondo" */}
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="backgroundType"
                    checked={textData.properties.backgroundColor !== 'transparent'}
                    onChange={() => handleBackgroundChange('#ffffff')}
                    className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Con fondo</span>
                </label>

                {/* Selector de color de fondo */}
                {textData.properties.backgroundColor !== 'transparent' && (
                  <div className="ml-7">
                    <input
                      type="color"
                      value={textData.properties.backgroundColor}
                      onChange={(e) => handleBackgroundChange(e.target.value)}
                      className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Peso de fuente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estilo del texto
              </label>
              <select
                value={textData.properties.fontWeight}
                onChange={(e) => setTextData(prev => ({
                  ...prev,
                  properties: { ...prev.properties, fontWeight: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
              >
                <option value="normal">Normal</option>
                <option value="bold">Negrita</option>
              </select>
            </div>
          </div>

          {/* Vista previa */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Vista previa:</div>
            <div className="flex items-center justify-center min-h-[60px] bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500">
              <div
                style={{
                  fontSize: `${textData.properties.fontSize}px`,
                  color: textData.properties.color,
                  fontWeight: textData.properties.fontWeight,
                  backgroundColor: textData.properties.backgroundColor,
                  padding: textData.properties.backgroundColor !== 'transparent' ? '4px 8px' : '0',
                  borderRadius: textData.properties.backgroundColor !== 'transparent' ? '4px' : '0'
                }}
              >
                {textData.name || 'Texto de ejemplo'}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!textData.name.trim()}
              className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isEditing ? 'Actualizar Texto' : 'Añadir Texto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextModal;