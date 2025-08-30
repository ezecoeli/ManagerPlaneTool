import { useState, useCallback } from 'react';

export const useObjectMovement = () => {
  const [dragState, setDragState] = useState({
    isDragging: false,
    dragObject: null,
    startPos: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 }
  });

  const startDrag = useCallback((object, event) => {
    event.preventDefault();
    event.stopPropagation();

    const canvasContainer = document.querySelector('[data-canvas-container]');
    const workArea = document.querySelector('[data-canvas-container] .absolute.inset-6 .w-full.h-full');
    const actualWorkArea = document.querySelector('[data-canvas-container] .absolute.inset-4');

    let targetRect;
    if (actualWorkArea) {
      targetRect = actualWorkArea.getBoundingClientRect();
    } else if (workArea) {
      targetRect = workArea.getBoundingClientRect();
    } else if (canvasContainer) {
      targetRect = canvasContainer.getBoundingClientRect();
    } else {
      targetRect = {
        left: 256,
        top: 140,
        width: window.innerWidth - 256,
        height: window.innerHeight - 140
      };
    }

    const objectScreenX = targetRect.left + object.position.x;
    const objectScreenY = targetRect.top + object.position.y;

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

  const updateDrag = useCallback((event) => {
    setDragState(prev => {
      if (!prev.isDragging) return prev;
      
      return {
        ...prev,
        currentPos: { x: event.clientX, y: event.clientY }
      };
    });
  }, []);

  const endDrag = useCallback((onPositionUpdate, zoom = 1, pan = { x: 0, y: 0 }) => {
    if (!dragState.isDragging || !dragState.dragObject) return;

    const dx = dragState.currentPos.x - dragState.startPos.x;
    const dy = dragState.currentPos.y - dragState.startPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // actualiza si el usuario realmente arrastró (más de 3px)
    if (distance > 3) {
      const workArea = document.querySelector('[data-work-area]');
      if (!workArea) return;

      const workAreaRect = workArea.getBoundingClientRect();

      // Convertir la posición del mouse a coordenadas del canvas real
      const mouseCanvasX = (dragState.currentPos.x - workAreaRect.left - pan.x) / zoom;
      const mouseCanvasY = (dragState.currentPos.y - workAreaRect.top - pan.y) / zoom;

      const objectWidth = dragState.dragObject.size?.width || 32;
      const objectHeight = dragState.dragObject.size?.height || 32;

      // Límites en escala real
      const minX = 0;
      const minY = 0;
      const maxX = (workAreaRect.width / zoom) - objectWidth;
      const maxY = (workAreaRect.height / zoom) - objectHeight;

      // posición limitada
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