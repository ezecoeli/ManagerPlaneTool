import { useState, useCallback } from 'react';

export const useObjectMovement = () => {
  const [dragState, setDragState] = useState({
    isDragging: false,
    dragObject: null,
    startPos: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 }
  });

  // Iniciar drag
  const startDrag = useCallback((object, event) => {
    event.preventDefault();
    event.stopPropagation();

    const viewport = document.querySelector('[data-canvas-viewport]');
    if (!viewport) return;
    const viewportRect = viewport.getBoundingClientRect();

    const objectScreenX = viewportRect.left + object.position.x;
    const objectScreenY = viewportRect.top + object.position.y;

    const offset = {
      x: event.clientX - objectScreenX,
      y: event.clientY - objectScreenY
    };

    setDragState({
      isDragging: true,
      dragObject: object,
      startPos: { x: event.clientX, y: event.clientY },
      currentPos: { x: event.clientX, y: event.clientY },
      offset: offset
    });
  }, []);

  // Actualizar posición durante drag
  const updateDrag = useCallback((event) => {
    if (!dragState.isDragging) return;
    setDragState((prev) => ({
      ...prev,
      currentPos: { x: event.clientX, y: event.clientY }
    }));
  }, [dragState.isDragging]);

  // Finalizar drag
  const endDrag = useCallback((onPositionUpdate, zoom = 1, pan = { x: 0, y: 0 }) => {
    if (!dragState.isDragging || !dragState.dragObject) return;

    const viewport = document.querySelector('[data-canvas-viewport]');
    if (!viewport) return;
    const viewportRect = viewport.getBoundingClientRect();

    const dx = dragState.currentPos.x - dragState.startPos.x;
    const dy = dragState.currentPos.y - dragState.startPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 3) {
      // Calcula la posición relativa al viewport
      const mouseCanvasX = (dragState.currentPos.x - viewportRect.left - pan.x) / zoom - dragState.offset.x;
      const mouseCanvasY = (dragState.currentPos.y - viewportRect.top - pan.y) / zoom - dragState.offset.y;

      const objectWidth = dragState.dragObject.size?.width || 32;
      const objectHeight = dragState.dragObject.size?.height || 32;

      const minX = 0;
      const minY = 0;
      const maxX = (viewportRect.width / zoom) - objectWidth;
      const maxY = (viewportRect.height / zoom) - objectHeight;

      const finalX = Math.max(minX, Math.min(mouseCanvasX, maxX));
      const finalY = Math.max(minY, Math.min(mouseCanvasY, maxY));

      onPositionUpdate(dragState.dragObject.id, { x: finalX, y: finalY });
    }

    setDragState({
      isDragging: false,
      dragObject: null,
      startPos: { x: 0, y: 0 },
      currentPos: { x: 0, y: 0 },
      offset: { x: 0, y: 0 }
    });
  }, [dragState]);

  // Cancelar drag
  const cancelDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      dragObject: null,
      startPos: { x: 0, y: 0 },
      currentPos: { x: 0, y: 0 },
      offset: { x: 0, y: 0 }
    });
  }, []);

  return {
    dragState,
    startDrag,
    updateDrag,
    endDrag,
    cancelDrag
  };
};