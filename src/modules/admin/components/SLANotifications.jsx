import React, { useState } from "react";
import { Link } from "react-router-dom";
import { faBusinessTimeIcon, faUserClockIcon } from "../../../data/data";
import { getFirstCaracterOfFirstTwoWord } from "../../../utils/utility";
import moment from "moment";

export const SLANotifications = ({
  violatedFirstResponse,
  violatedServiceResponse,
  setNotificationShow,
}) => {
  const [markAsReadActionShow, setMarkAsReadActionShow] = useState(false);
  const handleMarkReadToggle = () => {
    setMarkAsReadActionShow(!markAsReadActionShow);
  };
  return (
    <div className='accordion accordion-flush' id='accordionFlushExample'>
      <div className='accordion-item'>
        <h6 className='accordion-header'>
          <button
            className='accordion-button collapsed'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#flush-collapseOne'
            aria-expanded='false'
            aria-controls='flush-collapseOne'>
            {faUserClockIcon}First response time
            <span className='badge rounded-pill text-bg-danger ms-4'>
              {violatedFirstResponse && violatedFirstResponse.length}
            </span>
          </button>
        </h6>
        <div
          id='flush-collapseOne'
          className='accordion-collapse collapse'
          data-bs-parent='#accordionFlushExample'>
          <div className='accordion-body p-2'>
            {violatedFirstResponse &&
              violatedFirstResponse.map((item, index) => (
                <Link
                  to={`/admin/ticket-details/${item.ticket_number}`}
                  className='notification-comment'
                  key={index}
                  onClick={() => setNotificationShow(false)}>
                  <div className='container-fluid'>
                    <div className='row d-flex align-items-center'>
                      <div className='col-2'>
                        <div className='avater'>
                          {getFirstCaracterOfFirstTwoWord(item.fullname)}
                        </div>
                      </div>

                      <div className='col-10 ps-0'>
                        <div className='row'>
                          <div className='col-6'>
                            <div className='ticket-number'>
                              <p>
                                <i className='bi bi-ticket-detailed me-2'></i>
                                {item.ticket_number}
                              </p>
                            </div>
                          </div>
                          <div className='col-6 text-end'>
                            <small className='age'>
                              {"created "}
                              {moment(item.ticket_age, "YYYYMMDD").fromNow()}
                            </small>
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-md-12'>
                            <div className='description'>
                              <div className='d-flex align-items-center justify-content-between'>
                                <h6>{item.client_name}</h6>
                                <button
                                  type='button'
                                  className='mark-read-btn'
                                  onClick={handleMarkReadToggle}>
                                  {markAsReadActionShow && (
                                    <button
                                      type='button'
                                      className='mark-as-read-action'>
                                      Mark as read
                                    </button>
                                  )}
                                </button>
                              </div>

                              <div className='d-flex align-items-center justify-content-between'>
                                <p>{item.sub_category_in_english}</p>
                                <p
                                  className='fst-italic'
                                  style={{ color: "#183d9f" }}>
                                  {item.category_in_english}
                                </p>
                              </div>
                              <small>
                                {"SLA missed "}{" "}
                                {moment(item.violate_age, "YYYYMMDD").fromNow()}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
      <div className='accordion-item'>
        <h6 className='accordion-header'>
          <button
            className='accordion-button collapsed'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#flush-collapseTwo'
            aria-expanded='false'
            aria-controls='flush-collapseTwo'>
            {faBusinessTimeIcon}Resolved time
            <span className='badge rounded-pill text-bg-danger ms-4'>
              {violatedServiceResponse && violatedServiceResponse.length}
            </span>
          </button>
        </h6>
        <div
          id='flush-collapseTwo'
          className='accordion-collapse collapse show'
          data-bs-parent='#accordionFlushExample'>
          <div className='accordion-body p-2'>
            {violatedServiceResponse &&
              violatedServiceResponse.map((item, index) => (
                <Link
                  to={`/admin/ticket-details/${item.ticket_number}`}
                  className='notification-comment'
                  key={index}
                  onClick={() => setNotificationShow(false)}>
                  <div className='container-fluid'>
                    <div className='row d-flex align-items-center'>
                      <div className='col-2'>
                        <div className='avater'>
                          {getFirstCaracterOfFirstTwoWord(item.fullname)}
                        </div>
                      </div>

                      <div className='col-10 ps-0'>
                        <div className='row'>
                          <div className='col-6'>
                            <div className='ticket-number'>
                              <p>
                                <i className='bi bi-ticket-detailed me-2'></i>
                                {item.ticket_number}
                              </p>
                            </div>
                          </div>
                          <div className='col-6 text-end'>
                            <small className='age'>
                              {"created "}
                              {moment(item.ticket_age, "YYYYMMDD").fromNow()}
                            </small>
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-md-12'>
                            <div className='description'>
                              <div className='d-flex align-items-center justify-content-between'>
                                <h6>{item.client_name}</h6>
                                <button
                                  type='button'
                                  className='mark-read-btn'
                                  onClick={handleMarkReadToggle}>
                                  {markAsReadActionShow && (
                                    <button
                                      type='button'
                                      className='mark-as-read-action'>
                                      Mark as read
                                    </button>
                                  )}
                                </button>
                              </div>

                              <div className='d-flex align-items-center justify-content-between'>
                                <p>{item.sub_category_in_english}</p>
                                <p
                                  className='fst-italic'
                                  style={{ color: "#183d9f" }}>
                                  {item.category_in_english}
                                </p>
                              </div>
                              <small>
                                {"SLA missed "}{" "}
                                {moment(item.violate_age, "YYYYMMDD").fromNow()}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
