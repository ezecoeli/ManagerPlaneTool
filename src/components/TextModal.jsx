import { useState, useEffect } from 'react';

const TextModal = ({ isOpen, initialText = '', onSave, onCancel }) => {
  const [text, setText] = useState(initialText);
  const [fontSize, setFontSize] = useState(14);
  const [color, setColor] = useState('#1e40af');

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleSave = () => {
    if (text.trim()) {
      onSave({
        name: text.trim(),
        properties: {
          fontSize,
          color
        }
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Editar Texto
        </h3>
        
        <div className="space-y-4">
          {/* Input de texto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido del texto
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Escribe aquí el texto..."
              autoFocus
            />
          </div>

          {/* Tamaño de fuente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño de fuente: {fontSize}px
            </label>
            <input
              type="range"
              min="10"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color del texto
            </label>
            <div className="flex space-x-2">
              {['#1e40af', '#dc2626', '#059669', '#7c2d12', '#4c1d95'].map(colorOption => (
                <button
                  key={colorOption}
                  onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === colorOption ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
            <span 
              style={{ 
                fontSize: `${fontSize}px`, 
                color: color,
                fontWeight: '600'
              }}
            >
              {text || 'Texto de ejemplo'}
            </span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextModal;