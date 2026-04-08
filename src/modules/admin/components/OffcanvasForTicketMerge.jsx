import React, { useState } from "react";
import { Offcanvas } from "react-bootstrap";

export const OffcanvasForTicketMerge = ({
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
            {title === "Merge Tickets" ? (
              <small style={{ color: "#c03406", fontStyle: "italic" }}>
                {"(2) tickets selected."}
              </small>
            ) : null}

            <small className='ms-1 text-secondary'>{subTitle}</small>
          </div>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className='p-4'>{content}</Offcanvas.Body>
      <div className='d-flex justify-content-end gap-3 bg-light p-3'>
        <button type='button' className='btn-button' onClick={onHide}>
          Cancel
        </button>
        <button type='button' className='custom-btn-for-canvas'>
          Save
        </button>
      </div>
    </Offcanvas>
  );
};
