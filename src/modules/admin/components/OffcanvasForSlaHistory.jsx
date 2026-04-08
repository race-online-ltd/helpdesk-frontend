import { Offcanvas } from 'react-bootstrap';

export const OffcanvasForSlaHistory = ({ show, onHide, title, subTitle, content }) => {
  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      style={{ zIndex: '1000000', width: '500px' }}
    >
      <Offcanvas.Header closeButton className="border-bottom p-4">
        <Offcanvas.Title>
          <div className="fw-bold">{title}</div>
          {subTitle && (
            <small className="text-secondary fw-normal" style={{ fontSize: '0.85rem' }}>
              {subTitle}
            </small>
          )}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="p-0">{content}</Offcanvas.Body>
    </Offcanvas>
  );
};

export default OffcanvasForSlaHistory;
