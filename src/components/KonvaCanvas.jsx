import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import { useTheme } from '../hooks/useTheme';

const KonvaCanvas = ({
    objects = [],
    drawingLine,
    setDrawingLine,
    drawingRectangle,
    setDrawingRectangle,
    lineStart,
    setLineStart,
    linePreview,
    setLinePreview,
    onAddRoomObject,
    floorId,
    zoneId
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    useEffect(() => {
        if (!containerRef.current) return;
        const updateSize = () => {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            });
        };
        updateSize();
        const resizeObserver = new window.ResizeObserver(updateSize);
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Handler para iniciar dibujo (línea o rectángulo)
    const handleStageMouseDown = (e) => {
        const stage = e.target.getStage();
        const pointer = stage.getPointerPosition();

        if (drawingLine && !lineStart) {
            setLineStart(pointer);
            setLinePreview(pointer);
        } else if (drawingRectangle && !lineStart) {
            setLineStart(pointer);
            setLinePreview(pointer);
        }
    };

    // Handler para previsualizar
    const handleStageMouseMove = (e) => {
        const stage = e.target.getStage();
        const pointer = stage.getPointerPosition();
        if ((drawingLine || drawingRectangle) && lineStart) {
            setLinePreview(pointer);
        }
    };

    // Handler para finalizar dibujo
    const handleStageMouseUp = (e) => {
        const stage = e.target.getStage();
        const pointer = stage.getPointerPosition();

        if (drawingLine && lineStart) {
            if (pointer.x !== lineStart.x || pointer.y !== lineStart.y) {
                const x1 = lineStart.x;
                const y1 = lineStart.y;
                const x2 = pointer.x;
                const y2 = pointer.y;
                const minX = Math.min(x1, x2);
                const minY = Math.min(y1, y2);
                const width = Math.max(Math.abs(x2 - x1), 4);
                const height = Math.max(Math.abs(y2 - y1), 4);

                onAddRoomObject({
                    id: `line-${Date.now()}`,
                    type: 'line',
                    points: [lineStart, pointer],
                    position: { x: minX, y: minY },
                    size: { width, height },
                    floor: floorId,
                    zone: zoneId
                });
            }
            setDrawingLine(false);
            setLineStart(null);
            setLinePreview(null);
        } else if (drawingRectangle && lineStart) {
            if (pointer.x !== lineStart.x || pointer.y !== lineStart.y) {
                const x1 = lineStart.x;
                const y1 = lineStart.y;
                const x2 = pointer.x;
                const y2 = pointer.y;
                const minX = Math.min(x1, x2);
                const minY = Math.min(y1, y2);
                const width = Math.abs(x2 - x1);
                const height = Math.abs(y2 - y1);

                onAddRoomObject({
                    id: `rect-${Date.now()}`,
                    type: 'rect',
                    position: { x: minX, y: minY },
                    size: { width, height },
                    floor: floorId,
                    zone: zoneId,
                    properties: {
                        color: '#374151',
                        borderWidth: 2,
                        backgroundColor: 'transparent'
                    }
                });
            }
            setDrawingRectangle(false);
            setLineStart(null);
            setLinePreview(null);
        }
    };

    useEffect(() => {
        console.log('[Konva] Props:', { objects, drawingLine, lineStart, linePreview, floorId, zoneId });
    }, [objects, drawingLine, lineStart, linePreview, floorId, zoneId]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                background: '#0c859650',
                zIndex: 1000,
                pointerEvents: drawingLine || drawingRectangle ? 'auto' : 'none'
            }}
        >

            <Stage
                width={dimensions.width}
                height={dimensions.height}
                style={{
                    background: 'rgba(255,255,255,0.0)'
                }}
                onMouseDown={handleStageMouseDown}
                onMouseMove={handleStageMouseMove}
                onMouseUp={handleStageMouseUp}
            >
                <Layer>
                    {objects.map(obj => {
                        if (obj.type === 'line') {
                            return (
                                <Line
                                    key={obj.id}
                                    points={[
                                        obj.points[0].x, obj.points[0].y,
                                        obj.points[1].x, obj.points[1].y
                                    ]}
                                    stroke={isDark ? '#fff' : '#374151'}
                                    strokeWidth={4}
                                    lineCap="round"
                                />
                            );
                        }
                        if (obj.type === 'rect') {
                            return (
                                <Rect
                                    key={obj.id}
                                    x={obj.position.x}
                                    y={obj.position.y}
                                    width={obj.size.width}
                                    height={obj.size.height}
                                    fill={obj.properties?.backgroundColor || 'transparent'}
                                    stroke={isDark ? '#fff' : (obj.properties?.color || '#374151')}
                                    strokeWidth={4}
                                />
                            );
                        }
                        return null;
                    })}
                    {/* Previsualización de línea */}
                    {drawingLine && lineStart && linePreview && (
                        <Line
                            points={[
                                lineStart.x, lineStart.y,
                                linePreview.x, linePreview.y
                            ]}
                            stroke="#2563eb"
                            strokeWidth={3}
                            dash={[10, 5]}
                        />
                    )}
                    {/* Previsualización de rectángulo */}
                    {drawingRectangle && lineStart && linePreview && (
                        <Rect
                            x={Math.min(lineStart.x, linePreview.x)}
                            y={Math.min(lineStart.y, linePreview.y)}
                            width={Math.abs(linePreview.x - lineStart.x)}
                            height={Math.abs(linePreview.y - lineStart.y)}
                            fill="rgba(37,99,235,0.1)"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dash={[8, 4]}
                        />
                    )}
                </Layer>
            </Stage>
        </div>
    );
};

export default KonvaCanvas;