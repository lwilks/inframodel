import React, { useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

const Grid: React.FC = () => {
    const gridSpacing = 20; // adjust as needed
    const width = window.innerWidth;
    const height = window.innerHeight;
    const hLines = Array.from({ length: Math.ceil(height / gridSpacing) }, (_, i) => i * gridSpacing);
    const vLines = Array.from({ length: Math.ceil(width / gridSpacing) }, (_, i) => i * gridSpacing);

    return (
        <Layer>
            {hLines.map((y) => (
                <Line key={y} points={[0, y, width, y]} stroke="#ddd" strokeWidth={0.5} />
            ))}
            {vLines.map((x) => (
                <Line key={x} points={[x, 0, x, height]} stroke="#ddd" strokeWidth={0.5} />
            ))}
            <Line points={[0, height / 2, width, height / 2]} stroke="#ddd" strokeWidth={1} />
            <Line points={[width / 2, 0, width / 2, height]} stroke="#ddd" strokeWidth={1} />
        </Layer>
    );
};

const TwoDView: React.FC = () => {
    const [lines, setLines] = useState<number[][]>([]);
    const [currentLine, setCurrentLine] = useState<number[]>([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isDrawing, setIsDrawing] = useState(false);

    const handleStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        setIsDrawing(true);
        const stage = e.target.getStage();
        if (stage) {
            const pos = stage.getPointerPosition();
            if (pos) {
                if (e.evt.button === 2) { // right click
                    setLines([...lines, currentLine]);
                    setCurrentLine([]);
                    setIsDrawing(false);
                } else { // left click
                    setCurrentLine([...currentLine, pos.x, pos.y]);
                }
            }
        }
    };
    
    const handleStageMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        if (stage) {
            const pos = stage.getPointerPosition();
            if (pos) {
                setMousePos({ x: pos.x, y: pos.y });
            }
        }
    };

    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleStageMouseDown}
            onMouseMove={handleStageMouseMove}
            onContextMenu={(e) => e.evt.preventDefault()} // prevent context menu on right click
            className='crosshair'
        >
            <Grid />
            <Layer>
                {lines.map((line, i) => (
                    <Line
                        key={i}
                        points={line}
                        stroke="red"
                        strokeWidth={4}
                        lineCap="butt"
                        lineJoin="miter"
                        tension={0}
                    />
                ))}
                {currentLine.length > 0 && (
                    <Line
                        points={[...currentLine, mousePos.x, mousePos.y]}
                        stroke="red"
                        strokeWidth={4}
                        lineCap="butt"
                        lineJoin="miter"
                        tension={0}
                    />
                )}
            </Layer>
        </Stage>
    );
};

export default TwoDView;