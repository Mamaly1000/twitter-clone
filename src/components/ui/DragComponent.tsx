import React, { useState } from "react";
import Draggable, { ControlPosition, DraggableEvent } from "react-draggable";
import { twMerge } from "tailwind-merge";
interface DraggableComponentProps {
  children: React.ReactNode;
  className?: string;
  onDragStart?: (event: DraggableEvent) => void;
  onDrag?: (event: DraggableEvent) => void;
  onDragStop?: (event: DraggableEvent) => void;
  onDragend: () => void;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  children,
  className,
  onDragend,
}) => {
  const [initialPosition, setInitialPosition] = useState<ControlPosition>({
    x: 0,
    y: 0,
  });
  const [length, setLength] = useState(0);
  const handleDragStart = (event: DraggableEvent & any) => {
    setLength(event.clientY);
  };
  const handleDragStop = (event: DraggableEvent & any) => {
    const deltaY = event.clientY - length;

    if (Math.abs(deltaY) > 50) {
      onDragend();
      setInitialPosition({
        ...initialPosition,
        y: length > 0 ? length + deltaY : length - deltaY,
      });
    } else {
      setInitialPosition({
        ...initialPosition,
        y: 0,
      });
    }
  };

  return (
    <Draggable
      axis="y"
      onStart={handleDragStart}
      onStop={handleDragStop}
      bounds={{ top: -50, bottom: 50, left: 0, right: 0 }}
      position={initialPosition}
    >
      <div className={twMerge("drag-container", className)}>{children}</div>
    </Draggable>
  );
};

export default DraggableComponent;
