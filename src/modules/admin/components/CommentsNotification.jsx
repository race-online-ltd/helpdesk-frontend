import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { commentIcon } from "../../../data/data";
import {
  getFirstCaracterOfFirstTwoWord,
  truncateString,
} from "../../../utils/utility";
import { userContext } from "../../context/UserContext";

export const CommentsNotification = ({ comments, setNotificationShow }) => {
  const { user } = useContext(userContext);
  const [notificationCommentShow, setNotificationCommentShow] = useState(false);

  const [markAsReadActionShow, setMarkAsReadActionShow] = useState(false);
  const [defaultTextLength, setDefaultTextLength] = useState(90);
  const handleMarkReadToggle = () => {
    setMarkAsReadActionShow(!markAsReadActionShow);
  };
  const handleToggleText = (e, comment) => {
    e.preventDefault();
    e.stopPropagation();
    if (defaultTextLength === 90) {
      setDefaultTextLength(comment);
    } else {
      setDefaultTextLength(90);
    }
  };

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-6'>
            <p className='text-secondary fw-normal'>Recent</p>
          </div>
          <div className='col-6'>
            {/* <p className='text-end text-secondary fw-normal'>
              Mark all as read
            </p> */}
          </div>
        </div>
      </div>
      {comments &&
        comments.map((comment, index) =>
          (user?.type === "Client" || user?.type === "Customer") &&
          comment.is_internal == 0 ? (
            <Link
              to={`/admin/ticket-details/${comment.ticket_number}`}
              className='notification-comment'
              key={index}
              onClick={() => {
                setNotificationShow(false);
              }}>
              <div className='container-fluid'>
                <div className='row d-flex align-items-center'>
                  <div className='col-2 pe-0 pe-sm-2'>
                    <div className='d-flex position-relative'>
                      <div className='avater' title={comment.fullname}>
                        {getFirstCaracterOfFirstTwoWord(comment.fullname)}
                      </div>
                      <span className='coment-icon-overlay'>{commentIcon}</span>
                    </div>
                  </div>

                  <div className='col-10 ps-0 ps-sm-2'>
                    <div className='row'>
                      <div className='col-6'>
                        <div className='ticket-number'>
                          <p>
                            <i className='bi bi-ticket-detailed me-2'></i>
                            {comment.ticket_number}
                          </p>
                        </div>
                      </div>
                      <div className='col-6 text-end'>
                        <small className='age'>
                          {"created "}
                          {comment.ticket_age}
                        </small>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-12'>
                        <div className='description'>
                          <div className='d-flex align-items-center justify-content-between'>
                            <h6>{comment.client_name}</h6>
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
                            <p> {comment.sub_category_in_english}</p>
                            <p
                              className='fst-italic'
                              style={{ color: "#183d9f" }}>
                              {comment.category_in_english}
                            </p>
                          </div>
                          <p style={{ fontSize: "12px" }}>
                            {truncateString(
                              comment.comments,
                              defaultTextLength
                            )}
                            {comment.comments.length > 90 && (
                              <button
                                type='button'
                                className='seemore-btn'
                                onClick={(e) =>
                                  handleToggleText(e, comment.comments.length)
                                }>
                                {defaultTextLength === 90
                                  ? "See More"
                                  : "See Less"}
                              </button>
                            )}
                          </p>
                          <small>
                            {"commented "}
                            {comment.comment_age}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <Link
              to={`/admin/ticket-details/${comment.ticket_number}`}
              className='notification-comment'
              key={index}>
              <div className='container-fluid'>
                <div className='row d-flex align-items-center'>
                  <div className='col-2 pe-0 pe-sm-2'>
                    <div className='d-flex position-relative'>
                      <div className='avater' title={comment.fullname}>
                        {getFirstCaracterOfFirstTwoWord(comment.fullname)}
                      </div>
                      <span className='coment-icon-overlay'>{commentIcon}</span>
                    </div>
                  </div>

                  <div className='col-10 ps-0 ps-sm-2'>
                    <div className='row'>
                      <div className='col-6'>
                        <div className='ticket-number'>
                          <p>
                            <i className='bi bi-ticket-detailed me-2'></i>
                            {comment.ticket_number}
                          </p>
                        </div>
                      </div>
                      <div className='col-6 text-end'>
                        <small className='age'>
                          {"created "}
                          {comment.ticket_age}
                        </small>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-12'>
                        <div className='description'>
                          <div className='d-flex align-items-center justify-content-between'>
                            <h6>{comment.client_name}</h6>
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
                            <p> {comment.sub_category_in_english}</p>
                            <p
                              className='fst-italic'
                              style={{ color: "#183d9f" }}>
                              {comment.category_in_english}
                            </p>
                          </div>
                          <p style={{ fontSize: "12px" }}>
                            {truncateString(
                              comment.comments,
                              defaultTextLength
                            )}
                            {comment.comments.length > 90 && (
                              <button
                                type='button'
                                className='seemore-btn'
                                onClick={(e) =>
                                  handleToggleText(e, comment.comments.length)
                                }>
                                {defaultTextLength === 90
                                  ? "See More"
                                  : "See Less"}
                              </button>
                            )}
                          </p>
                          <small>
                            {"commented "}
                            {comment.comment_age}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        )}
    </>
  );
};
