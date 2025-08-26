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

  const endDrag = useCallback((onPositionUpdate) => {
    if (!dragState.isDragging || !dragState.dragObject) return;

    const workArea = document.querySelector('[data-work-area]');
    
    if (!workArea) {
      return;
    }

    const workAreaRect = workArea.getBoundingClientRect();
    
    const relativeX = dragState.currentPos.x - workAreaRect.left - dragState.offset.x;
    const relativeY = dragState.currentPos.y - workAreaRect.top - dragState.offset.y;

    const objectWidth = dragState.dragObject.size?.width || 32;
    const objectHeight = dragState.dragObject.size?.height || 32;

    const minX = 0;
    const minY = 0;
    const maxX = workAreaRect.width - objectWidth;
    const maxY = workAreaRect.height - objectHeight;

    const finalX = Math.max(minX, Math.min(relativeX, maxX));
    const finalY = Math.max(minY, Math.min(relativeY, maxY));

    onPositionUpdate(dragState.dragObject.id, { x: finalX, y: finalY });

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