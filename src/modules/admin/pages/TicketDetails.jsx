import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

import { useFormik } from 'formik';
import moment from 'moment';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { OffcanvasComponent } from '../components/OffcanvasComponent';
import { SelectComponent } from '../components/SelectComponent';
import {
  assignValidationSchema,
  commentValidationSchema,
  mergeTicketSchema,
} from '../../../schema/ValidationSchemas';
import {
  faBuildingIcon,
  faUpDownIcon,
  faBriefcaseIcon,
  faPhoneIcon,
  emailIcon,
  iconMapping,
  USER_TICKET_VALIDATION_MESSAGES,
} from '../../../data/data';
import { faUserClockIcon, faBusinessTimeIcon } from './../../../data/data';
import { Button } from 'react-bootstrap';
import { PopUp } from '../components/PopUp';
import { OffcanvasForTicketAssign } from '../components/OffcanvasForTicketAssign';
import { SelectDropdown } from '../components/SelectDropdown';
import {
  assignTeamAndStore,
  changeStatusByStatusIdAndTicketNumber,
  commentStore,
  fetchCommentsByTicketNumber,
  fetchCommentsByUserTeam,
  fetchRecentlyOpenAndClosedSidWise,
  fetchSidDetailsInfo,
  fetchTicketDetailsById,
  fetchTicketHistory,
  sendSMSByPartnerNumber,
  sendSMSBySID,
  getBranchDetailsById,
} from '../../../api/api-client/ticketApi';
import {
  errorMessage,
  successMessage,
  warningMessage,
} from '../../../api/api-config/apiResponseMessage';
import { getFirstCaracterOfFirstTwoWord } from '../../../utils/utility';
import { userContext } from '../../context/UserContext';
import { getStatus } from '../../../api/api-client/utilityApi';
import { fetchAllTeam, fetchTeamBySubCategory } from '../../../api/api-client/settings/teamApi';
import { TicketPermission } from '../../../data/permission';
import { useUserRolePermissions } from '../../custom-hook/useUserRolePermissions';
import { CommentUpdateContext } from '../../context/comment/CommentContex';
import { IsLoadingContext } from '../../context/LoaderContext';
import { baseURL } from '../../../api/api-config/config';
import { bottom } from '@popperjs/core';
import TextEditor from '../components/text-editor/TextEditor';
import { fetchAgentsByTeam } from '../../../api/api-client/settings/agentApi';
import { useDropzone } from 'react-dropzone';

export const TicketDetails = () => {
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  const isClientOrCustomer = user?.type === 'Client' || user?.type === 'Customer';
  const { setCommentUpdated } = useContext(CommentUpdateContext);
  const { setIsLoadingContextUpdated } = useContext(IsLoadingContext);
  const { hasPermission } = useUserRolePermissions();
  const [markAsReadActionShow, setMarkAsReadActionShow] = useState(false);
  const replyRef = useRef(null);
  const [statusToSubmit, setStatusToSubmit] = useState(null);
  const { ticketNumber } = useParams();
  const [addReply, setAddReply] = useState(false);
  const [addNote, setAddNote] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [offcanvasContent, setOffcanvasContent] = useState('');
  const [offcanvasTitle, setOffcanvasTitle] = useState('');
  const [offcanvasSubTitle, setOffcanvasSubTitle] = useState('');
  const [showOffcanvasTicketAssign, setShowOffcanvasTicketAssign] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isLoadingAssign, setIsLoadingAssign] = useState(false);
  const [isActiveInfoButton, setIsActiveInfoButton] = useState(false);

  const [teamOptions, setTeamOptions] = useState([]);

  // const [isCheckedPrimary, setIsCheckedPrimary] = useState(false);
  const [tikcetDetailsData, setTikcetDetailsData] = useState([]);
  const [commentsData, setCommentsData] = useState([]);

  const [statusOptions, setStatusOptions] = useState([]);

  const ticket = Array.isArray(tikcetDetailsData?.ticket) ? tikcetDetailsData.ticket[0] : null;
  // const slaInfo = Array.isArray(tikcetDetailsData?.slaInfo) ? tikcetDetailsData.slaInfo[0] : null;
  const slaInfo = tikcetDetailsData?.slaInfo || null;

  const networkBackboneInfo = Array.isArray(tikcetDetailsData?.networkBackbone)
    ? tikcetDetailsData.networkBackbone[0]
    : null;

  const [isLoading, setIsLoading] = useState(false);
  const [commentIsLoading, setCommentIsLoading] = useState(false);
  const [attachmentFileLink, setAttachmentFileLink] = useState(null);
  const [statusForAssignOptions, setStatusForAssignOptions] = useState([]);
  const [tikcetHistoryData, setTikcetHistoryData] = useState([]);
  const [tikcetHistoryKeyList, setTikcetHistoryKeyList] = useState([]);
  const [isRCAButton, setIsRCAButton] = useState(false);
  const [sidDetailsInfo, setSidDetailsInfo] = useState([]);
  const [recentlyOpenAndClosedForSID, setRecentlyOpenAndClosedForSID] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    if (selectedTeamId != null) {
      setIsLoading(true);
      fetchAgentsByTeam(selectedTeamId)
        .then((response) => {
          setAgents([]);
          setAgents(
            response.data.map((option) => ({
              value: option.id,
              label: option.fullname,
            }))
          );
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    }
  }, [selectedTeamId]);
  useEffect(() => {
    setIsLoading(true);
    const fetchStatusOptions = () => {
      getStatus().then((response) => {
        setStatusOptions(response.data);
        setStatusForAssignOptions(
          response.data
            .filter(
              (option) =>
                option.status_name !== 'Closed' && option.status_name !== 'Request Resolved'
            )
            .map((option) => ({
              value: option.id,
              label: option.status_name,
            }))
        );
      });
    };

    const fetchTeamOptions = () => {
      fetchAllTeam().then((response) => {
        setTeamOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.team_name,
          }))
        );
      });
    };

    Promise.all([fetchStatusOptions(), fetchTeamOptions()])
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (ticketNumber) {
      setIsLoading(true);
      fetchTicketDetailsById(ticketNumber)
        .then((response) => {
          setTikcetDetailsData(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
        });

      fetchTicketHistory(ticketNumber)
        .then((response) => {
          const ticketDetails = response[ticketNumber];
          const newKeyList = Object.keys(ticketDetails).slice(1);
          setTikcetHistoryKeyList(newKeyList);
          setTikcetHistoryData(ticketDetails);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [ticketNumber]);

  const updateCommentsData = (response) => {
    setCommentsData((prevComments) => {
      const newComments = Array.isArray(response) ? response : [response];
      const combinedComments = [...(prevComments || []), ...newComments];
      const uniqueComments = combinedComments.filter(
        (comment, index, self) => index === self.findIndex((t) => t.id === comment.id)
      );
      return uniqueComments;
    });
  };

  useEffect(() => {
    if (ticketNumber) {
      setIsLoading(true);
      fetchCommentsByTicketNumber(ticketNumber)
        .then((response) => {
          updateCommentsData(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [ticketNumber]);

  const handleAddNote = () => {
    setAddNote(!addNote);
  };

  const handleAddReply = () => {
    if (statusToSubmit != null) {
      return;
    }
    setAddReply(!addReply);
    formikComment.setFieldValue('isRCA', 0);
    setIsRCAButton(false);

    setTimeout(() => {
      if (!addReply) {
        replyRef.current.scrollTo({
          top: replyRef.current.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        replyRef.current.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }, 0);
  };
  const handleAddRCAReply = () => {
    // if (statusToSubmit != null) {
    //   return;
    // }
    const loginUserTeamId = user?.user_teams;
    const canCloseTicket = loginUserTeamId.includes(ticket?.team_id);
    if (!canCloseTicket) {
      return warningMessage({
        message: USER_TICKET_VALIDATION_MESSAGES.RCA_ALLOW,
      });
    }
    setAddReply(true);
    formikComment.setFieldValue('isRCA', 1);
    setIsRCAButton(true);

    setTimeout(() => {
      if (!addReply) {
        replyRef.current.scrollTo({
          top: replyRef.current.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        replyRef.current.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }, 0);
  };

  const handleShowOffcanvas = (title, text) => {
    setOffcanvasTitle('');
    setOffcanvasSubTitle('');
    setOffcanvasTitle(title);
    setOffcanvasSubTitle(text);
    setShowOffcanvas(true);
  };
  const handleAddNoteOffcanvas = (title, text) => {
    setAddNote(!addNote);
    setShowOffcanvas(true);
    setOffcanvasTitle('');
    setOffcanvasSubTitle('');
    setOffcanvasTitle(title);
    setOffcanvasSubTitle(text);
  };

  const handleAssignTicket = (title, text) => {
    if (ticket?.status_name === 'Closed') {
      return warningMessage({
        message: 'Closed ticket can not assign',
      });
    }
    formikAssign.setFieldValue('statusId', ticket?.status_id);
    setOffcanvasTitle('');
    setOffcanvasSubTitle('');
    setOffcanvasTitle(title);
    setOffcanvasSubTitle(text);
    setShowOffcanvasTicketAssign(true);
  };

  const handleTicketAssignCloseOffcanvas = () => setShowOffcanvasTicketAssign(false);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  const [audioModal, setAudioModal] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);

  const handleAttachmentPopup = (img) => {
    const fileExtension = img.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension);
    const isAudio = ['wav', 'mp3', 'ogg'].includes(fileExtension);
    const fileUrl = `${baseURL}${encodeURIComponent(img)}`;
   

    if (isImage) {
      window.open(fileUrl, '_blank');
    } else if (isAudio) {
    // const audio = new Audio(fileUrl);
    // audio.play();
    setAudioSrc(fileUrl);
    setAudioModal(true); // ✅ open modal
  } 
    else {
      const fileName = img.split('/').pop();
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.target = 'blank';
      link.click();
      link.remove();
    }
  };

  const handleCommentAttachmentPopup = (item) => {
    const itemArr = item.split(',');
    if (itemArr.length === 1) {
      const fileExtension = item.split('.').pop().toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension);
      const fileUrl = `${baseURL}${encodeURIComponent(item)}`;

      if (isImage) {
        window.open(fileUrl, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = itemArr[0];
        link.target = '_blank';
        link.click();
        link.remove();
      }
    } else {
      setPopupVisible(true);
      setAttachmentFileLink(item);
    }
  };
  const tickets = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  const formik = useFormik({
    initialValues: {
      contact: '',
      ticket: '',
    },

    validationSchema: mergeTicketSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const formikComment = useFormik({
    enableReinitialize: true,
    initialValues: {
      ticketNumber: ticketNumber || '',
      userId: user?.id,
      teamId: isClientOrCustomer ? user?.team_id : user?.user_teams?.[0],
      // isRCA: isRCAButton ? 1 : 0,
      isRCA: 0,
      comment: '',
      attachedFile: [],
      isInternal: isClientOrCustomer ? 0 : 1,
    },

    validationSchema: commentValidationSchema,
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('ticketNumber', values.ticketNumber);
      formData.append('userId', values.userId);
      formData.append('teamId', values.teamId);
      formData.append('isRCA', values.isRCA);
      formData.append('comment', values.comment);
      formData.append('isInternal', values.isInternal);
      const files = Array.from(values.attachedFile);

      files.forEach((file) => {
        formData.append('attachedFile[]', file);
      });

      if (statusToSubmit === 6) {
        setIsLoadingContextUpdated(true);
        setCommentIsLoading(true);
        Promise.all([
          changeStatusByStatusIdAndTicketNumber(statusToSubmit, ticketNumber, user?.id),
          commentStore(formData),
        ])
          .then(([statusResponse, commentResponse]) => {
            successMessage(statusResponse);

            //for sms send
            const smsData = {
              ticket_no: ticket?.ticket_number,
              nature: ticket?.sub_category_in_english,
              sid: ticket?.sid,
            };

            if (ticket?.sid) {
              smsSend(smsData);
            }

            const patnerSMSData = {
              ticket_number: ticketNumber,
              businessEntity: ticket?.client_name,
              nature: ticket?.subcat_id,
              phone: ticket?.mobile_no,
            };

            if (ticket?.mobile_no) {
              smsSendForPatner(patnerSMSData);
            }
            // end sms send

            // Fetch updated comments
            fetchCommentsByTicketNumber(ticketNumber)
              .then((response) => {
                setCommentUpdated(true);
                updateCommentsData(response.data);
              })
              .catch(errorMessage);
          })
          .catch(errorMessage)
          .finally(() => {
            setIsLoadingContextUpdated(false);
            setCommentIsLoading(false);
            setCommentUpdated(false);
            setStatusToSubmit(null);

            // formikComment.setFieldError("comment",'');
            resetForm();
            navigate('/admin/tickets');
          });
      } else {
        setCommentIsLoading(true);
        commentStore(formData)
          .then((response) => {
            fetchCommentsByTicketNumber(ticketNumber)
              .then((response) => {
                setCommentUpdated(true);
                updateCommentsData(response.data);
              })
              .catch(errorMessage);
            successMessage(response);
          })
          .catch(errorMessage)
          .finally(() => {
            setCommentIsLoading(false);
            setCommentUpdated(false);
            setIsRCAButton(false);
            isRCAButton ? setAddReply(false) : '';
            resetForm();
          });
      }
    },
  });

  const formikAssign = useFormik({
    initialValues: {
      ticketNumber: parseInt(ticketNumber) || '',
      userId: user?.id || '',
      teamId: '',
      // statusId: '',
      agentId: '',
      comment: '',
      attachedFile: [],
      isInternal: 1,
    },
    validationSchema: assignValidationSchema,
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('ticketNumber', values.ticketNumber);
      formData.append('userId', values.userId);
      formData.append('teamId', values.teamId);
      formData.append('statusId', values.statusId);
      formData.append('comment', values.comment);
      formData.append('isInternal', values.isInternal);
      const files = Array.from(values.attachedFile);

      files.forEach((file) => {
        formData.append('attachedFile[]', file);
      });

      setIsLoadingAssign(true);
      setIsLoadingContextUpdated(true);
      assignTeamAndStore(formData)
        .then((response) => {
          fetchCommentsByTicketNumber(ticketNumber)
            .then((response) => {
              setCommentUpdated(true);
              updateCommentsData(response.data);
            })
            .catch(errorMessage);
          successMessage(response);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingAssign(false);
          setCommentUpdated(false);
          resetForm();
          setShowOffcanvasTicketAssign(false);
          setIsLoadingContextUpdated(false);
        });
    },
  });

  const handleStatusChange = (status) => {
    if (!ticketNumber) {
      warningMessage({
        message: 'Please select at least one ticket before changing status.',
      });
      return;
    }

    const isClientOrCustomer = user?.type === 'Client' || user?.type === 'Customer';
    const isOwner = ticket?.user_id === user?.id;
    if (isClientOrCustomer && !isOwner) {
      return warningMessage({
        message: USER_TICKET_VALIDATION_MESSAGES.COLOSE_ALLOW,
      });
    }

    if (ticket?.status_name === 'Closed') {
      warningMessage({
        message:
          status === 1
            ? USER_TICKET_VALIDATION_MESSAGES.TICKET_STATUS_OPEN
            : USER_TICKET_VALIDATION_MESSAGES.TICKET_STATUS_CLOSED,
      });

      return;
    }

    const loginUserTeamId = user?.user_teams;
    const canCloseTicket = loginUserTeamId.includes(ticket?.team_id);
    if (!canCloseTicket) {
      return warningMessage({
        message: USER_TICKET_VALIDATION_MESSAGES.COLOSE_ALLOW,
      });
    }

    if (status === 6 && formikComment.values.comment === '' && statusToSubmit == null) {
      handleAddReply();
      formikComment.submitForm();
      setStatusToSubmit(status);
      return;
    }
    if (statusToSubmit != null) {
      return;
    }

    setIsLoadingContextUpdated(true);
    changeStatusByStatusIdAndTicketNumber(status, ticketNumber, user?.id)
      .then((response) => {
        successMessage(response);
      })
      .catch(errorMessage)
      .finally(() => {
        setIsLoadingContextUpdated(false);
      });
  };

  const smsSend = (smsData) => {
    sendSMSBySID(smsData)
      .then((response) => {})
      .catch(errorMessage);
  };

  const smsSendForPatner = (smsData) => {
    sendSMSByPartnerNumber(smsData)
      .then((response) => {})
      .catch(errorMessage);
  };

  useEffect(() => {
    if (ticket?.sid) {
      fetchSidDetailsInfo(ticket?.sid)
        .then((response) => {
          setSidDetailsInfo(response?.[0]);
        })
        .catch(errorMessage);

      fetchRecentlyOpenAndClosedSidWise({ sid: ticket?.sid })
        .then((response) => {
          setRecentlyOpenAndClosedForSID(response.data);
        })
        .catch(errorMessage);
    }
  }, [ticket?.sid]);

  const mergeContent = () => {
    return (
      <section>
        <form onSubmit={formik.handleSubmit}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="mb-3">
                  <SelectComponent
                    id="ticket"
                    name="ticket"
                    options={tickets}
                    placeholder="Select"
                    onChange={formik.handleChange}
                    onBlur={formik.setFieldTouched}
                    value={formik.values.ticket}
                  />
                  {formik.touched.ticket && formik.errors.ticket ? (
                    <div className="text-danger">{formik.errors.ticket}</div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </form>

        <Link to="#" className="notification-comment">
          <div className="container-fluid">
            <div className="row d-flex align-items-center">
              <div className="col-1">
                <div className="">
                  <i className="bi bi-dash-circle text-danger"></i>
                </div>
              </div>

              <div className="col-9 ps-0">
                <div className="row">
                  <div className="col-md-12">
                    <div className="ticket-number">
                      <p>
                        <i className="bi bi-ticket-detailed me-2"></i>
                        4759345
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="description">
                      <div className="">
                        <h6>ADN Telecom Limited</h6>
                      </div>

                      <div className="">
                        <p>Complaint | Number Replacement Request</p>
                      </div>
                      <small>created 24hr 59m 59s</small>
                    </div>
                    Name
                  </div>
                </div>
              </div>
              <div className="col-2">
                <div className="d-flex flex-column align-items-center">
                  <button
                    type="button"
                    className={`bg-transparent ${markAsReadActionShow ? 'text-success' : ''}`}
                    onClick={() => setMarkAsReadActionShow(!markAsReadActionShow)}
                  >
                    {markAsReadActionShow ? (
                      <i className="bi bi-check-circle-fill"></i>
                    ) : (
                      <i className="bi bi-circle"></i>
                    )}
                  </button>
                  <p className="text-success" style={{ width: '48px', height: '30px' }}>
                    {markAsReadActionShow ? 'Primary' : '  '}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>
    );
  };

  const ticketAssign = () => {
    return (
      <section>
        <form onSubmit={formikAssign.handleSubmit}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="mb-3">
                  <SelectDropdown
                    id="teamId"
                    placeholder="Select Team"
                    options={teamOptions}
                    value={formikAssign.values.teamId}
                    onChange={(value) => {
                      formikAssign.setFieldValue('teamId', value);
                      setSelectedTeamId(value);
                    }}
                    disabled={isLoading}
                  />
                </div>

                {formikAssign.touched.teamId && formikAssign.errors.teamId ? (
                  <div className="text-danger">{formikAssign.errors.teamId}</div>
                ) : null}
              </div>
              {/* <div className="col-12">
                <div className="mb-3">
                  <SelectDropdown
                    id="statusId"
                    placeholder="Select status"
                    options={statusForAssignOptions}
                    value={formikAssign.values.statusId}
                    onChange={(value) => {
                      formikAssign.setFieldValue('statusId', value);
                    }}
                    disabled={isLoading}
                  />
                </div>

                {formikAssign.touched.statusId && formikAssign.errors.statusId ? (
                  <div className="text-danger">{formikAssign.errors.statusId}</div>
                ) : null}
              </div> */}

              <div className="col-12">
                <div className="mb-3">
                  <SelectDropdown
                    id="agentId"
                    placeholder="Select Agent (Optional)"
                    options={agents}
                    value={formikAssign.values.agentId}
                    onChange={(value) => {
                      formikAssign.setFieldValue('agentId', value);
                    }}
                    disabled={isLoading}
                  />
                </div>
              </div>
              {/* <div className="col-12">
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Write comment..."
                    id="comment"
                    value={formikAssign.values.comment}
                    onChange={formikAssign.handleChange}
                    rows="3"
                  ></textarea>
                </div>
                {formikAssign.touched.comment && formikAssign.errors.comment ? (
                  <div className="text-danger">{formikAssign.errors.comment}</div>
                ) : null}
              </div> */}

              <div className="col-12">
                <div className="mb-3">
                  <TextEditor
                    name="comment"
                    value={formikAssign.values.comment}
                    placeholder="Write comment..."
                    onChange={formikAssign.handleChange}
                    onBlur={formikAssign.handleBlur}
                  />
                </div>

                {formikAssign.touched.comment && formikAssign.errors.comment ? (
                  <div className="text-danger">{formikAssign.errors.comment}</div>
                ) : null}
              </div>

              <div className="col-8">
                <div className="">
                  <label htmlFor="attachedFile" className="btn-button">
                    <span
                      style={{
                        transform: 'rotate(217deg)',
                        display: 'inline-block',
                      }}
                    >
                      {' '}
                      <i className="bi bi-paperclip"></i>
                    </span>
                    Attachment{' '}
                  </label>
                  {formikAssign.values.attachedFile
                    ? formikAssign.values.attachedFile.name
                    : 'No file selected'}
                  <input
                    className="form-control"
                    id="attachedFile"
                    type="file"
                    multiple
                    hidden
                    onChange={(e) => formikAssign.setFieldValue('attachedFile', e.target.files)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 bg-light p-3 position-absolute bottom-0 end-0">
                <button
                  type="button"
                  className="btn-button"
                  onClick={handleTicketAssignCloseOffcanvas}
                >
                  Cancel
                </button>
                <button type="submit" className="custom-btn-for-canvas">
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    );
  };

  const addNoteContent = () => {
    return (
      <div className="container-fluid">
        <div className="comment-box">
          <div className="row">
            <div className="col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <div className="d-flex justify-content-center">
                <div className="avater">AR</div>
              </div>
            </div>
            <div className="col-sm-10 col-md-10 col-lg-10 col-xl-10">
              <h6>
                IT & Billing <small className="fst-italic ms-2">Added a Public Comment</small>
              </h6>
              <small>6 Minutes ago</small>
              <div className="row mt-2">
                <div className="col-12">
                  <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ab, dicta nesciunt
                    autem labore alias, tempora dolorum culpa quis harum ea dignissimos consequatur
                    molestiae consectetur deleniti adipisci laudantium eos cumque non?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form>
          <div className="row">
            <div className="col-12">
              <div className="">
                <label htmlFor="reply-attachted-file" className="btn-button">
                  <span
                    style={{
                      transform: 'rotate(217deg)',
                      display: 'inline-block',
                    }}
                  >
                    {' '}
                    <i className="bi bi-paperclip"></i>
                  </span>
                  Attachment
                </label>
                <input className="form-control" id="reply-attachted-file" type="file" hidden />
              </div>
            </div>
            <div className="col-12">
              <div className="my-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label">
                  Reply
                </label>
                <textarea
                  className="form-control"
                  placeholder="Write private note"
                  id="exampleFormControlTextarea1"
                  rows="3"
                ></textarea>
                {/* <div className='w-100 text-end mt-3'>
                  <button type='button' className='btn-button'>
                    <i class='bi bi-send me-2'></i>Send
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  };

  const privateCount = commentsData?.filter((item) => item.is_internal === 1).length;
  const publicCount = commentsData?.filter((item) => item.is_internal === 0).length;
  const isUserCustomer = user?.type === 'Customer';
  const attachtmentArr = ticket?.attachtment_urls?.split(',') || [];

  // For drag and drop file upload
  // Dropdowns
  const inputRef = useRef(null);

  // Keep auto-focus active so the cursor always blinks
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [formikComment.values.attachedFile]);

  // Prevent typing inside the input field (allow paste only)
  const handleKeyDown = (e) => {
    // Allow only Ctrl+V (Windows) or Cmd+V (Mac) for paste
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      return;
    }

    // Block all other keystrokes to prevent manual typing
    e.preventDefault();
  };

  const fileListRef = useRef(new DataTransfer());

  const syncFilesToFormik = (dataTransfer) => {
    fileListRef.current = dataTransfer;
    formikComment.setFieldValue('attachedFile', dataTransfer.files); // real FileList
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const dt = new DataTransfer();
      // Keep existing files
      const existing = formikComment.values.attachedFile;
      if (existing && existing.length > 0) {
        Array.from(existing).forEach((f) => dt.items.add(f));
      }
      acceptedFiles.forEach((f) => dt.items.add(f));
      syncFilesToFormik(dt);
    },
    [formikComment]
  );

  // React Dropzone configuration
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true, // Disable default click-to-open behavior
    noKeyboard: true, // Disable keyboard-triggered file dialog
  });

  const handlePaste = useCallback(
    (event) => {
      const items = event.clipboardData.items;
      const dt = new DataTransfer();
      const existing = formikComment.values.attachedFile;
      if (existing && existing.length > 0) {
        Array.from(existing).forEach((f) => dt.items.add(f));
      }
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          const file = items[i].getAsFile();
          if (file) {
            const renamed = new File([file], `pasted_img_${Date.now()}.png`, { type: file.type });
            dt.items.add(renamed);
          }
        }
      }
      syncFilesToFormik(dt);
    },
    [formikComment]
  );

  const removeFile = (index) => {
    const dt = new DataTransfer();
    const existing = formikComment.values.attachedFile;
    Array.from(existing).forEach((f, i) => {
      if (i !== index) dt.items.add(f);
    });
    syncFilesToFormik(dt);
  };

  // Branch details
  const [branchDetails, setBranchDetails] = useState(null);
  useEffect(() => {
    if (ticket?.branch_id) {
      getBranchDetailsById(ticket.branch_id)
        .then((response) => {
          setBranchDetails(response.data);
        })
        .catch(errorMessage);
    }
  }, [ticket?.branch_id]);

  // console.log('branch details', branchDetails);
  // console.log('tikcetDetailsData', tikcetDetailsData);
  // console.log('formikComment', formikComment.errors);
  return (
    <section className="ticket-details-area">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-9 col-lg-9 col-xl-9">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="ticket-details-card">
                  <div className="ticket-details-card-header">
                    <ul className="ticket-details-comment-action-btn">
                      {hasPermission('Can_View_RCA_Reply_Button') && (
                        <li>
                          <button
                            className=""
                            type="button"
                            disabled={ticket?.status_name === 'Closed' ? true : false}
                            data-bs-toggle="dropdown"
                            htmlF
                          >
                            <i className="bi bi-arrow-90deg-left me-1"></i>
                            {'Reply'}
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button className="" type="button" onClick={handleAddRCAReply}>
                                <i className="bi bi-chat-dots me-1"></i>
                                {'RCA'}
                              </button>
                            </li>
                            <li>
                              <button className="" type="button" onClick={handleAddReply}>
                                <i className="bi bi-chat me-1"></i>
                                {'Comment'}
                              </button>
                            </li>
                          </ul>
                        </li>
                      )}
                      {hasPermission('Can_View_Without_RCA_Reply_Button') && (
                        <li>
                          <button
                            className=""
                            type="button"
                            disabled={ticket?.status_name === 'Closed' ? true : false}
                            // onClick={() => setAddReply(!addReply)}>\
                            onClick={handleAddReply}
                          >
                            <i className="bi bi-arrow-90deg-left me-1"></i>
                            {'Reply'}
                          </button>
                        </li>
                      )}

                      {!isUserCustomer && (
                        <li>
                          <button
                            // className='dropdown-toggle'
                            type="button"
                            disabled={ticket?.status_name === 'Closed' ? true : false}
                            data-bs-toggle="dropdown"
                          >
                            <i className="bi bi-flag-fill me-1"></i>
                            {'Status'}
                          </button>
                          <ul className="dropdown-menu">
                            {statusOptions &&
                              statusOptions.map((item, index) => {
                                if (item.status_name === 'Request Resolved') {
                                  return null;
                                }

                                return (
                                  <li key={index}>
                                    <button
                                      type="button"
                                      className="m-0"
                                      onClick={() => handleStatusChange(item.id)}
                                    >
                                      <i className={`${iconMapping[item.status_name]} me-2`}></i>
                                      {item.status_name}
                                    </button>
                                  </li>
                                );
                              })}
                          </ul>
                        </li>
                      )}

                      {hasPermission('Merge') && (
                        <li>
                          <button
                            className="d-none"
                            type="button"
                            disabled={ticket?.status_name === 'Closed' ? true : false}
                            onClick={() =>
                              handleShowOffcanvas(
                                'Merge Tickets',
                                'Secondary tickets will be added to the primary ticket.'
                              )
                            }
                          >
                            <i className="bi bi-intersect me-1"></i>
                            {'Merge'}
                          </button>
                        </li>
                      )}
                      {hasPermission('Assign') && (
                        <li>
                          <button
                            className=""
                            type="button"
                            disabled={ticket?.status_name === 'Closed' ? true : false}
                            onClick={() =>
                              handleAssignTicket(
                                'Assign Ticket',
                                'Forward ticket to the designated team.'
                              )
                            }
                          >
                            <i className="bi bi-person-fill-add me-1"></i>
                            {'Assign'}
                          </button>
                        </li>
                      )}
                      <li className="info-btn">
                        <button
                          className=""
                          type="button"
                          onClick={() => setIsActiveInfoButton(!isActiveInfoButton)}
                        >
                          <i className="bi bi-info-circle-fill"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                  {/* Ticket Descriptions*/}
                  <div className="ticket-details-card-body" ref={replyRef}>
                    <div className="row">
                      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10">
                        <div className="d-flex">
                          <h6>
                            <i
                              className="bi bi-ticket-detailed me-2"
                              style={{ color: '	#FF3131' }}
                            ></i>
                          </h6>
                          {/* <h6 title='Sub-Category'>
                            {ticket?.sub_category_in_english}
                          </h6>
                          <h6
                            className='fw-normal mx-2'
                            style={{ color: "lightgrey" }}>
                            |
                          </h6> */}
                          <h6 className="me-1" style={{ color: '#00bcd4' }}>
                            Client :{' '}
                          </h6>
                          <h6 title="Client">{ticket?.client_name} </h6>
                          {ticket?.branch_name && (
                            <h6
                              className="ms-2"
                              title="Branch"
                              style={{
                                color: '#00bcd4',
                              }}
                            >
                              {` (${ticket.branch_name})`}
                            </h6>
                          )}
                        </div>
                        <p className="ms-4 fst-italic">
                          Created by{' '}
                          <b className="ms-2">
                            {ticket?.fullname || 'Unknown'}
                            {ticket?.team_name_by_mapping
                              ? ` [ ${ticket.team_name_by_mapping.split(',').join(', ')} ]`
                              : ''}
                          </b>
                        </p>
                      </div>
                      <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 text-end">
                        <small className="">{ticket?.ticket_age} </small>
                      </div>
                    </div>
                    Name
                    <div className="row my-4">
                      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <div className="">
                          {/* <pre
                            style={{
                              fontFamily: 'inherit',
                              fontSize: 'inherit',
                              whiteSpace: 'pre-wrap',
                              wordWrap: 'break-word',
                            }}
                          >
                            {ticket?.note}
                          </pre> */}
                          <div dangerouslySetInnerHTML={{ __html: ticket?.note }} />

                          {attachtmentArr &&
                            attachtmentArr.map((item, index) => (
                              <div className="mt-3" key={index}>
                                <button
                                  type="button"
                                  onClick={() => handleAttachmentPopup(item)}
                                  className="bg-transparent ms-2"
                                  style={{
                                    textDecoration: 'underline',
                                    color: 'var(--blue-color)',
                                    fontStyle: 'italic',
                                  }}
                                >
                                  <i className="bi bi-link-45deg fs-5 me-2"></i>
                                  {item.split('/').pop()}
                                </button>
                              </div>
                            ))}
                          {/* {ticket?.attached_filename && (
                            <div className='mt-3'>
                              <button
                                type='button'
                                onClick={() =>
                                  handleAttachmentPopup(
                                    ticket?.attached_filename
                                  )
                                }
                                className='bg-transparent ms-2'
                                style={{
                                  textDecoration: "underline",
                                  color: "var(--blue-color)",
                                  fontStyle: "italic",
                                }}>
                                <i className='bi bi-link-45deg fs-5 me-2'></i>
                                {ticket?.attached_filename.split("/").pop()}
                          
                              </button>
                            </div>
                          )} */}
                        </div>
                      </div>
                    </div>
                    {/*Private Comment*/}
                    {commentsData?.length > 0 && (
                      <div className="row">
                        <div className="line-box">
                          <div className="line"></div>
                          <span className="count">
                            {user?.type === 'Client' || user?.type === 'Customer'
                              ? publicCount
                              : commentsData?.length}
                            {' replies'}
                          </span>
                          <div className="line"></div>
                        </div>
                      </div>
                    )}
                    {commentsData &&
                      commentsData.map((item, index) => {
                        const isClient = user?.type === 'Client' || user?.type === 'Customer';
                        const isPublicComment = item.is_internal === 0;

                        if (isClient && !isPublicComment) {
                          return null;
                        }

                        const commentTypeClass =
                          item.is_internal === 1 ? 'private-comment' : 'public-comment';
                        const bgClass = index % 2 === 0 ? 'private-bg' : 'public-bg';

                        return (
                          <div className={`comment-box ${bgClass}`} key={item.id || index}>
                            <div className="row">
                              <div className="col-1">
                                <div className="avater" title={item.fullname}>
                                  {getFirstCaracterOfFirstTwoWord(item.fullname)}
                                </div>
                              </div>
                              <div className="col-11">
                                <div className="d-flex">
                                  <h6 className="w-75">
                                    {item.fullname}
                                    {/* {isClientOrCustomer
                                      ? ` `
                                      : `  [ ${item.team_names} ]`} */}
                                    {item.team_names ? `  [ ${item.team_names} ]` : `  [ Client ]`}

                                    <small className={`fst-italic ms-2 ${commentTypeClass}`}>
                                      {item.is_internal === 1 ? 'Private' : 'Public'}
                                    </small>
                                    {item.is_rca == 1 && (
                                      <span>
                                        {' '}
                                        <i className="bi bi-tag-fill ms-2 text-success"></i>
                                        <small>RCA</small>
                                      </span>
                                    )}
                                  </h6>
                                  <div className="d-flex w-25 justify-content-end align-items-center">
                                    {/* <small>{item.comment_age}</small> */}

                                    <small>{moment(item.created_at).format('lll')}</small>
                                    {item.attachment_urls && (
                                      <button
                                        type="button"
                                        className="bg-transparent btn py-0 ms-1"
                                        onClick={() =>
                                          handleCommentAttachmentPopup(item.attachment_urls)
                                        }
                                      >
                                        <i className="bi bi-link-45deg"></i>
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <div className="row mt-2">
                                  <div className="col-12">
                                    {/* <pre
                                      style={{
                                        fontFamily: 'inherit',
                                        fontSize: 'inherit',
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                      }}
                                    >
                                      {item.comments}
                                    </pre> */}

                                    <div dangerouslySetInnerHTML={{ __html: item.comments }} />

                                    <small className="float-end">{item.comment_age}</small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    {addReply && (
                      <form
                        onSubmit={formikComment.handleSubmit}
                        encType="multipart/form-data"
                        className="row"
                      >
                        {/* <div className='col-12'>
                          <div className='mt-3 mb-2'>
                            <label htmlFor='comment' className='form-label'>
                              {statusToSubmit != null
                                ? "Closed Note"
                                : formikComment.values.isRCA === 1
                                ? "RCA"
                                : "Reply"}
                            </label>
                            <textarea
                              className={`form-control ${
                                formikComment.touched.comment &&
                                formikComment.errors.comment
                                  ? "is-invalid"
                                  : formikComment.touched.comment
                                  ? "is-valid"
                                  : ""
                              }`}
                              placeholder={`${
                                statusToSubmit != null
                                  ? "Write a mandatory closed note..."
                                  : "Write comment..."
                              }`}
                              id='comment'
                              value={formikComment.values.comment}
                              onChange={formikComment.handleChange}
                              rows='3'></textarea>
                          </div>
                          {formikComment.touched.comment &&
                          formikComment.errors.comment ? (
                            <div className='text-danger'>
                              {formikComment.errors.comment}
                            </div>
                          ) : null}
                        </div> */}
                        <div className="col-12">
                          <div className="mt-3 mb-2">
                            <label htmlFor="comment" className="form-label">
                              {statusToSubmit != null
                                ? 'Closed Note'
                                : formikComment.values.isRCA === 1
                                  ? 'RCA'
                                  : 'Reply'}
                            </label>

                            <div
                              className={`${
                                formikComment.touched.comment && formikComment.errors.comment
                                  ? 'border border-danger rounded'
                                  : ''
                              }`}
                            >
                              <TextEditor
                                name="comment"
                                value={formikComment.values.comment}
                                placeholder={
                                  statusToSubmit != null
                                    ? 'Write a mandatory closed note...'
                                    : 'Write comment...'
                                }
                                onChange={(e) =>
                                  formikComment.setFieldValue('comment', e.target.value)
                                }
                                onBlur={() => formikComment.setFieldTouched('comment', true)}
                              />
                            </div>
                          </div>

                          {formikComment.touched.comment && formikComment.errors.comment ? (
                            <div className="text-danger">{formikComment.errors.comment}</div>
                          ) : null}
                        </div>

                        {/* <div className="col-8">
                          <div className="">
                            <label htmlFor="attachedFile" className="btn-button">
                              <span
                                style={{
                                  transform: 'rotate(217deg)',
                                  display: 'inline-block',
                                }}
                              >
                                {' '}
                                <i className="bi bi-paperclip"></i>
                              </span>
                              Attachment{' '}
                            </label>
                            {formikComment.values.attachedFile
                              ? formikComment.values.attachedFile.name
                              : 'No file selected'}
                            <input
                              className="form-control"
                              id="attachedFile"
                              type="file"
                              multiple
                              hidden
                              onChange={(e) =>
                                formikComment.setFieldValue('attachedFile', e.target.files)
                              }
                            />
                          </div>
                        </div> */}

                        <div className="col-8">
                          <div
                            {...getRootProps()}
                            className={`input-group mb-3 ${isDragActive ? 'border border-primary' : ''}`}
                            style={{ outline: 'none' }}
                          >
                            <input {...getInputProps()} />

                            <span
                              className="input-group-text px-3 bg-light text-dark border-end-0"
                              style={{
                                borderRadius: '5px 0 0 5px',
                                cursor: 'pointer',
                                fontWeight: '500',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                open();
                              }}
                            >
                              Choose Files
                            </span>

                            <input
                              ref={inputRef}
                              type="text"
                              onKeyDown={handleKeyDown}
                              onPaste={handlePaste}
                              autoComplete="off"
                              className="form-control bg-white shadow-none"
                              placeholder={
                                formikComment.values.attachedFile?.length > 0
                                  ? `${formikComment.values.attachedFile.length} files selected`
                                  : 'Attach files by dragging, dropping, or pasting screenshots'
                              }
                              style={{
                                cursor: 'text',
                                caretColor: 'black',
                              }}
                            />
                          </div>

                          {formikComment.values.attachedFile?.length > 0 && (
                            <div className="mb-3">
                              {Array.from(formikComment.values.attachedFile).map((file, index) => (
                                <div
                                  key={index}
                                  className="d-flex align-items-center justify-content-between p-2 mb-1 border rounded bg-white shadow-sm"
                                >
                                  <div className="d-flex align-items-center text-truncate small">
                                    <i className="bi bi-file-earmark-image me-2 text-primary"></i>
                                    <span className="text-truncate" title={file.name}>
                                      {file.name}
                                    </span>
                                    <small className="ms-2 text-muted">
                                      ({(file.size / 1024).toFixed(1)} KB)
                                    </small>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-sm text-danger p-0 ms-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeFile(index);
                                    }}
                                  >
                                    <i className="bi bi-x-circle-fill"></i>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="col-4">
                          {hasPermission('Public_Comment') && (
                            <div className="d-flex justify-content-end">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="isInternal"
                                  checked={formikComment.values.isInternal === 1}
                                  onChange={(e) =>
                                    formikComment.setFieldValue(
                                      'isInternal',
                                      e.target.checked ? 1 : 0
                                    )
                                  }
                                />
                                <label className="form-check-label" htmlFor="isInternal">
                                  Is Internal
                                </label>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="w-100 text-end">
                          <button type="submit" className="btn-button">
                            <i className="bi bi-send me-2"></i>
                            {commentIsLoading
                              ? 'Sending...'
                              : statusToSubmit != null
                                ? 'Close'
                                : 'Send'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`col-sm-12 col-md-3 col-lg-3 col-xl-3 ${
              isActiveInfoButton
                ? 'd-block animate__animated animate__fadeInLeft'
                : 'info-box-container'
            }`}
          >
            {hasPermission('Client_Info') && (
              <div className="custom-card">
                <div className="custom-card-header">Ticket Info</div>
                <div className="p-3">
                  <p className="mb-3">
                    <b>
                      <i className="bi bi-building-fill me-1"></i>Business Entity :{' '}
                    </b>
                    {ticket?.company_name}
                  </p>
                  <p className="mb-3Name">
                    <b>
                      <i className="bi bi-ticket-detailed me-1"></i>Ticket No. :{' '}
                    </b>
                    {ticket?.ticket_number}
                  </p>
                  <p className="mb-3">
                    <b>
                      <i className="bi bi-diagram-3-fill me-1"></i>Sub-category :{' '}
                    </b>
                    {ticket?.sub_category_in_english}
                  </p>

                  {ticket?.sid && (
                    <p className="mb-3">
                      <b>
                        <i className="bi bi-person-fill me-1"></i>SID :{' '}
                      </b>
                      {ticket?.sid}
                    </p>
                  )}
                  {sidDetailsInfo?.mobile_phone && (
                    <p className="mb-3">
                      <b>
                        <i className="bi bi-telephone-fill me-1"></i>Mobile :{' '}
                      </b>
                      {sidDetailsInfo?.mobile_phone}
                    </p>
                  )}
                  {ticket?.mobile_no && (
                    <p className="mb-3">
                      <b>
                        <i className="bi bi-telephone-fill me-1"></i>Complain No. :{' '}
                      </b>
                      {ticket?.mobile_no}
                    </p>
                  )}

                  {sidDetailsInfo?.home_phone && (
                    <p className="mb-3">
                      <b>
                        <i className="bi bi-telephone-fill me-1"></i>Home phone :{' '}
                      </b>
                      {sidDetailsInfo?.home_phone}
                    </p>
                  )}

                  {sidDetailsInfo?.address && (
                    <p className="mb-3">
                      <b>
                        <i className="bi bi-house-door-fill me-1"></i>Address :{' '}
                      </b>
                      {sidDetailsInfo?.address}
                    </p>
                  )}

                  <p className="mb-3">
                    <b>
                      <i className="bi bi-people-fill me-1"></i>Assigned Team:{' '}
                    </b>
                    {ticket?.team_name_by_ticket}
                  </p>
                  <p className="mb-3">
                    <b>
                      <i className="bi bi-flag me-1"></i>Status :{' '}
                    </b>

                    <span
                      className={`badge ${ticket?.status_name === 'Closed' ? 'bg-success' : 'bg-danger'}`}
                    >
                      {ticket?.status_name}
                    </span>
                  </p>
                  <p className="mb-3">
                    <b>
                      <i className="bi bi-arrow-down-up me-1"></i>Priority :{' '}
                    </b>
                    {ticket?.priority_name}
                  </p>
                  <p className="mb-3">
                    <b>
                      <i className="bi bi-ticket-detailed me-1 text-secondary"></i>
                      Ref. Ticket :{' '}
                    </b>
                    {ticket?.ref_ticket_no}
                  </p>
                  <p className="mb-3">
                    <b>
                      <i className="bi bi-ui-checks-grid me-1"></i>Source :{' '}
                    </b>
                    {ticket?.source_name}
                  </p>
                  <p className="">
                    <b>
                      <i className="bi bi-clock me-1"></i>
                      Created :{' '}
                    </b>
                    {moment(ticket?.created_at).format('lll')}
                  </p>
                </div>
              </div>
            )}

            {branchDetails && (
              <div className="custom-card">
                <h6 className="custom-card-header">Service Contact</h6>
                <div className="p-3">
                  <p className="mb-3">
                    <b>{faBuildingIcon} Branch : </b>
                    {branchDetails.branch_name}
                  </p>
                  <p className="mb-3">
                    <b>{faBriefcaseIcon} Address: </b>
                    {branchDetails.service_address || 'N/A'}
                  </p>
                  <p className="mb-3">
                    <b>{faPhoneIcon} Phone 1: </b>
                    {branchDetails.mobile1 || 'N/A'}
                  </p>
                  <p className="mb-3">
                    <b>{faPhoneIcon} Phone 2: </b>
                    {branchDetails.mobile2 || 'N/A'}
                  </p>
                  <p className="mb-3">
                    <b>{emailIcon} Email 1: </b>
                    {branchDetails.email1 || 'N/A'}
                  </p>
                  <p className="mb-3">
                    <b>{emailIcon} Email 2: </b>
                    {branchDetails.email2 || 'N/A'}
                  </p>
                </div>
              </div>
            )}

            {hasPermission('Client_Info') && networkBackboneInfo != null && (
              <div className="custom-card">
                <div className="custom-card-header">Network & Backbone Info</div>
                <div className="p-3">
                  <p className="mb-3">
                    <b>
                      <i className="bi bi-globe me-1"></i>N & B Element :{' '}
                    </b>
                    {networkBackboneInfo?.backbone_name}
                  </p>
                  <p className="mb-3">
                    <b>
                      <i className="bi bi-list me-1"></i>Element Name :{' '}
                    </b>
                    {networkBackboneInfo?.backbone_element_name}
                  </p>
                  <p className="mb-3">
                    <b>
                      <i className="bi bi-align-start me-1"></i>Element A :{' '}
                    </b>
                    {networkBackboneInfo?.backbone_element_name_a}
                  </p>
                  <p className="">
                    <b>
                      <i className="bi bi-align-end me-1"></i>Element B :{' '}
                    </b>
                    {networkBackboneInfo?.backbone_element_name_b}
                  </p>
                </div>
              </div>
            )}

            {hasPermission('Ticket_History') && (
              <div className="custom-card">
                <div className="custom-card-header">Ticket History </div>
                <div style={{ overflowY: 'scroll', maxHeight: '530px' }}>
                  {tikcetHistoryKeyList.map((key, index) => (
                    <div
                      className="p-3"
                      style={{
                        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 6px 5px -2px',
                      }}
                      key={index}
                    >
                      <p className="mb-3">
                        <b>
                          <i className="bi bi-person-fill me-1"></i>Agent :{' '}
                        </b>
                        {tikcetHistoryData[key].agent
                          ? tikcetHistoryData[key].agent.charAt(0).toUpperCase() +
                            tikcetHistoryData[key].agent.slice(1).toLowerCase()
                          : ''}
                        {` [ ${tikcetHistoryData[key].agent_team} ]`}
                      </p>
                      {tikcetHistoryData[key].assigned_to && (
                        <p className="mb-3">
                          <b>
                            <i className="bi bi-people-fill me-1"></i>Assigned To :{' '}
                          </b>
                          {tikcetHistoryData[key].assigned_to}
                        </p>
                      )}

                      {tikcetHistoryData[key].comment && (
                        <p className="mb-3">
                          <b>
                            <i className="bi bi-chat-dots me-1"></i>Comment :{' '}
                          </b>
                          <div
                            dangerouslySetInnerHTML={{ __html: tikcetHistoryData[key].comment }}
                          />
                        </p>
                      )}
                      {tikcetHistoryData[key].ticket_age && (
                        <p className="mb-3">
                          <b>
                            {' '}
                            <i className="bi bi-clock me-1"></i>Age :{' '}
                          </b>
                          {tikcetHistoryData[key].ticket_age}
                        </p>
                      )}

                      <p className="mb-3">
                        <b>
                          {' '}
                          <i className="bi bi-calendar me-1"></i>Date & Time :{' '}
                        </b>
                        {moment(tikcetHistoryData[key].updated_at).format('lll')}
                      </p>
                      {tikcetHistoryData[key].sla && (
                        <p className="mb-3">
                          <b>{faBusinessTimeIcon}SLA : </b>
                          {tikcetHistoryData[key].sla}
                        </p>
                      )}

                      {tikcetHistoryData[key].sla_status && (
                        <p className="mb-3">
                          <b>
                            <i className="bi bi-flag me-1"></i>SLA Status :{' '}
                          </b>
                          <span
                            className={`${
                              tikcetHistoryData[key]?.sla_status === 'violated' ? 'text-danger' : ''
                            }`}
                          >
                            {tikcetHistoryData[key].sla_status ?? '--'}
                          </span>
                        </p>
                      )}

                      <p className="">
                        <b>
                          <i className="bi bi-flag-fill me-1"></i>Status :{' '}
                        </b>
                        {tikcetHistoryData[key].ticket_status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* {hasPermission('SLA') && (
              <div className="custom-card">
                <div className="custom-card-header">SLA</div>
                <div className="p-3">
                  <p className="mb-3">
                    <b>{faUserClockIcon}First Response Time : </b>
                    {slaInfo?.fr_res_time_str}
                  </p>
                  <p className="">
                    <b>{faBusinessTimeIcon}Service Time : </b>
                    {slaInfo?.srv_time_str}
                  </p>
                </div>
              </div>
            )} */}

            {hasPermission('SLA') && slaInfo && (
              <div className="custom-card">
                <div className="custom-card-header">SLA</div>
                <div className="p-3">
                  <p className="mb-3">
                    <b>{faUserClockIcon}First Response Time : </b>
                    {slaInfo?.first_response?.duration_min ?? '--'} min
                  </p>

                  <p>
                    <b>{faBusinessTimeIcon}Service Time : </b>
                    {slaInfo?.service_time?.resolution_min ?? '--'} min
                  </p>
                </div>
              </div>
            )}

            {hasPermission(' Forwarded Teams') && (
              <div className="custom-card">
                <div className="custom-card-header">Forwarded Teams</div>
                <div className="p-3">
                  {tikcetDetailsData &&
                    tikcetDetailsData.forwarded_teams &&
                    tikcetDetailsData.forwarded_teams.map((item, index) => (
                      <div className="mb-3 d-flex align-items-center" key={index}>
                        <div className="avater me-2">
                          {getFirstCaracterOfFirstTwoWord(item.team_name)}
                        </div>
                        <p>{item.team_name}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {recentlyOpenAndClosedForSID.length === 0 && (
              <div className="custom-card">
                <div className="custom-card-header">Requester's Tickets</div>
                {hasPermission('Recently_Open') && (
                  <div
                    className="p-3"
                    style={{
                      borderBottom: '5px solid var(--secondary-bg-color)',
                    }}
                  >
                    <h6
                      className="d-inline px-4 py-1 rounded-pill"
                      style={{ backgNameround: 'var(--secondary-bg-color)' }}
                    >
                      Recently Opened
                    </h6>
                    {tikcetDetailsData &&
                      tikcetDetailsData.recently_open_ticket &&
                      tikcetDetailsData.recently_open_ticket.map((item, index) => (
                        <Link
                          to={`/admin/ticket-details/${item.ticket_number}`}
                          className="notification-comment p-3"
                          target="_blank"
                          key={index}
                        >
                          <div className="container-fluid">
                            <div className="row d-flex align-items-center">
                              <div className="col-md-12 ps-0">
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="ticket-number">
                                      <p>
                                        <i className="bi bi-ticket-detailed me-2"></i>
                                        {item.ticket_number}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="description">
                                      <h6>{item.sub_category_in_english}</h6>
                                      <div className="d-flex align-items-center justify-content-between">
                                        <p className="fst-italic" style={{ color: '#183d9f' }}>
                                          {item.category_in_english}
                                        </p>
                                        <small>Created {item.created_at}</small>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                )}

                {hasPermission('Recently_Closed') && (
                  <div className="p-3">
                    <h6
                      className="d-inline px-4 py-1 rounded-pill"
                      style={{ background: 'var(--secondary-bg-color)' }}
                    >
                      Recently Closed
                    </h6>
                    {tikcetDetailsData &&
                      tikcetDetailsData.recently_closed_ticket &&
                      tikcetDetailsData.recently_closed_ticket.map((item, index) => (
                        <Link
                          to={`/admin/ticket-details/${item.ticket_number}`}
                          target="_blank"
                          className="notification-comment p-3"
                          key={index}
                        >
                          <div className="container-fluid">
                            <div className="row d-flex align-items-center">
                              <div className="col-md-12 ps-0">
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="ticket-number">
                                      <p>
                                        <i className="bi bi-ticket-detailed me-2"></i>
                                        {item.ticket_number}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="description">
                                      <h6>{item.sub_category_in_english}</h6>
                                      <div className="d-flex align-items-center justify-content-between">
                                        <p className="fst-italic" style={{ color: '#183d9f' }}>
                                          {item.category_in_english}
                                        </p>
                                        <small>Resolved {item.updated_at}</small>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            )}

            {recentlyOpenAndClosedForSID && (
              <div className="custom-card">
                <div className="custom-card-header">Requester's Tickets</div>
                {hasPermission('Recently_Open') && (
                  <div
                    className="p-3"
                    style={{
                      borderBottom: '5px solid var(--secondary-bg-color)',
                    }}
                  >
                    <h6
                      className="d-inline px-4 py-1 rounded-pill"
                      style={{ background: 'var(--secondary-bg-color)' }}
                    >
                      Recently Opened
                    </h6>
                    {recentlyOpenAndClosedForSID &&
                      recentlyOpenAndClosedForSID.recently_open_ticket &&
                      recentlyOpenAndClosedForSID.recently_open_ticket.map((item, index) => (
                        <Link
                          to={`/admin/ticket-details/${item.ticket_number}`}
                          className="notification-comment p-3"
                          target="_blank"
                          key={index}
                        >
                          <div className="container-fluid">
                            <div className="row d-flex align-items-center">
                              <div className="col-md-12 ps-0">
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="ticket-number">
                                      <p>
                                        <i className="bi bi-ticket-detailed me-2"></i>
                                        {item.ticket_number}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="description">
                                      <h6>{item.sub_category_in_english}</h6>
                                      <div className="d-flex align-items-center justify-content-between">
                                        <p className="fst-italic" style={{ color: '#183d9f' }}>
                                          {item.category_in_english}
                                        </p>
                                        <small>Created {item.created_at}</small>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                )}

                {hasPermission('Recently_Closed') && (
                  <div className="p-3">
                    <h6
                      className="d-inline px-4 py-1 rounded-pill"
                      style={{ background: 'var(--secondary-bg-color)' }}
                    >
                      Recently Closed
                    </h6>
                    {recentlyOpenAndClosedForSID &&
                      recentlyOpenAndClosedForSID.recently_closed_ticket &&
                      recentlyOpenAndClosedForSID.recently_closed_ticket.map((item, index) => (
                        <Link
                          to={`/admin/ticket-details/${item.ticket_number}`}
                          target="_blank"
                          className="notification-comment p-3"
                          key={index}
                        >
                          <div className="container-fluid">
                            <div className="row d-flex align-items-center">
                              <div className="col-md-12 ps-0">
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="ticket-number">
                                      <p>
                                        <i className="bi bi-ticket-detailed me-2"></i>
                                        {item.ticket_number}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="description">
                                      <h6>{item.sub_category_in_english}</h6>
                                      <div className="d-flex align-items-center justify-content-between">
                                        <p className="fst-italic" style={{ color: '#183d9f' }}>
                                          {item.category_in_english}
                                        </p>
                                        <small>Resolved {item.updated_at}</small>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <OffcanvasComponent
        show={showOffcanvas}
        onHide={handleCloseOffcanvas}
        icon={
          offcanvasTitle === 'Merge Tickets' ? (
            <i className="bi bi-intersect me-2"></i>
          ) : (
            <i className="bi bi-card-text me-2"></i>
          )
        }
        title={offcanvasTitle}
        subTitle={offcanvasSubTitle}
        content={offcanvasTitle === 'Merge Tickets' ? mergeContent() : addNoteContent()}
      />

      <OffcanvasForTicketAssign
        show={showOffcanvasTicketAssign}
        onHide={handleTicketAssignCloseOffcanvas}
        icon={<i className="bi bi-person-fill-add me-2"></i>}
        title={offcanvasTitle}
        subTitle={offcanvasSubTitle}
        content={ticketAssign()}
      />

      {isPopupVisible && <PopUp imgLink={attachmentFileLink} onClose={handleClosePopup} />}

      {audioModal && (
  <div className="custom-audio-modal">
    <div className="audio-modal-content">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6>Audio Player</h6>
        <button className="close-btn" onClick={() => setAudioModal(false)}>
  <i className="bi bi-x-lg"></i>
</button>
      </div>

      <audio controls autoPlay style={{ width: '100%' }}>
        <source src={audioSrc} type="audio/wav" />
        Your browser does not support audio
      </audio>

    </div>
  </div>
)}
    </section>
  );
};
