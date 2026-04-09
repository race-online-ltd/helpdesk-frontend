import React, { useRef, useState } from 'react';
import { Mic } from 'lucide-react';
import recorderIcon from '../../../../assets/recorder.png';

import './recorder.css';

export const FloatingVoiceRecorderButton = ({ onClick, ariaLabel, tooltipText }) => {
  const buttonRef = useRef(null);
  const suppressClickRef = useRef(false);
  const dragRef = useRef({
    active: false,
    pointerId: null,
    moved: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });
  const [position, setPosition] = useState(null);

  const clampToViewport = (nextX, nextY, rect) => {
    const margin = 8;
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;

    return {
      x: Math.min(window.innerWidth - halfW - margin, Math.max(halfW + margin, nextX)),
      y: Math.min(window.innerHeight - halfH - margin, Math.max(halfH + margin, nextY)),
    };
  };

  const handlePointerDown = (event) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const originX = position?.x ?? rect.left + rect.width / 2;
    const originY = position?.y ?? rect.top + rect.height / 2;

    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      originX,
      originY,
    };

    buttonRef.current?.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;

    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    if (Math.abs(dx) + Math.abs(dy) > 4) {
      dragRef.current.moved = true;
    }

    if (!dragRef.current.moved) return;

    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const nextPosition = clampToViewport(dragRef.current.originX + dx, dragRef.current.originY + dy, rect);
    setPosition(nextPosition);
  };

  const handlePointerUp = (event) => {
    if (dragRef.current.pointerId !== event.pointerId) return;

    if (dragRef.current.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }

    dragRef.current.active = false;
    dragRef.current.pointerId = null;
    buttonRef.current?.releasePointerCapture?.(event.pointerId);
  };

  const handleClick = (event) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  };

  const handleDragStart = (event) => {
    event.preventDefault();
  };

  const dynamicStyle = position
    ? {
        left: `${position.x}px`,
        top: `${position.y}px`,
        right: 'auto',
        transform: 'translate(-50%, -50%)',
      }
    : undefined;

  return (
    <button
      ref={buttonRef}
      type="button"
      className="voice-recorder-floating-button"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDragStart={handleDragStart}
      aria-label={ariaLabel}
      style={dynamicStyle}
    >
      <span className="voice-recorder-floating-button__tooltip">{tooltipText}</span>
      <span className="voice-recorder-floating-button__ring">
        <img
          src={recorderIcon}
          alt=""
          className="voice-recorder-floating-button__ring-image"
          draggable={false}
        />
        <span className="voice-recorder-floating-button__mic">
          <Mic size={22} strokeWidth={2.3} />
        </span>
      </span>
    </button>
  );
};
