import React, { useState } from "react";
import { Offcanvas } from "react-bootstrap";

export const OffcanvasForTicketAssign = ({
  show,
  onHide,
  icon,
  title,
  subTitle,
  content,
}) => {
  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement='end'
      style={{ zIndex: "1000000" }}>
      <Offcanvas.Header className='p-4'>
        <Offcanvas.Title>
          {icon}
          {title}
          <div className=''>
            <small className='ms-1 text-secondary'>{subTitle}</small>
          </div>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className='p-4' style={{ position: "relative" }}>
        {content}
      </Offcanvas.Body>
      {/* <div className='d-flex justify-content-end gap-3 bg-light p-3'>
        <button type='button' className='btn-button' onClick={onHide}>
          Cancel
        </button>
        <button type='submit' className='custom-btn-for-canvas'>
          Save
        </button>
      </div> */}
    </Offcanvas>
  );
};
