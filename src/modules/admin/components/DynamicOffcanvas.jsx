import React, { useState } from "react";
import { Offcanvas } from "react-bootstrap";

export const DynamicOffcanvas = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  width,
  content,
}) => {
  return (
    <Offcanvas
      show={isOpen}
      onHide={onClose}
      placement='end'
      style={{ zIndex: "1000000", width: width }}>
      <Offcanvas.Header className='p-4'>
        <Offcanvas.Title>
          {icon}
          {title}
          <div className=''>
            <small className='ms-1 text-secondary'>{subtitle}</small>
          </div>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className='p-4' style={{ position: "relative" }}>
        {content}
      </Offcanvas.Body>
    </Offcanvas>
  );
};
