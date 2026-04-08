import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'bootstrap-icons/font/bootstrap-icons.css';
import orbitLogo from '../../../assets/orbit.png';
import { BUSINESS_ENTITIES } from '../../../constants/constants';

export const TicketTrack = () => {
  const { token } = useParams();
  const [trackTicket, setTrackTicket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}public-ticket/${token}`)
      .then((res) => {
        setTrackTicket(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Invalid link');
      });
  }, [token]);

  if (error) return <h3>{error}</h3>;
  if (!trackTicket) return <h3>Loading...</h3>;

  const basic = trackTicket.basic_info;
  const timelineData = trackTicket.timeline;
  const currentTimelineData = trackTicket.current_info;

  const companyConfig = Object.values(BUSINESS_ENTITIES).find(
    (entity) => entity.name === basic.company_name
  );

  const companyColor = companyConfig?.color || 'rgb(136,168,82)';
  const companyLogo = companyConfig?.logo || orbitLogo;
  const isRaceCompany = basic.company_name === 'Race Online Ltd';

  return (
    <div className="page-wrapper">
      <div className="container py-4">
        {/* CARD */}
        <div className="card tracker-card">
          {/* Compact Header Section */}
          <div className="ticket-top-header">
            <img
              src={companyLogo}
              alt="Logo"
              className="top-logo"
              style={{
                height: isRaceCompany ? '30px' : '60px',
              }}
            />

            <div className="top-heading">
              <h5 className="mb-1 fw-bold">Track your ticket</h5>
              <p className="mb-0 small text-muted">Now you can track your ticket easily</p>
            </div>
          </div>
          {/* HEADER */}
          <div className="card-body border-bottom">
            {/* Ticket Number */}
            <div className="d-flex justify-content-center align-items-center mb-5">
              {/* <div className="ticket-header ticket-highlight d-flex align-items-center gap-2">
                <i className="bi bi-ticket-fill primary-color"></i>
                <span className="ticket-label">Ticket No. :</span>
                <span className="ticket-value">{basic.ticket_number}</span>
              </div> */}
              <div
                className="ticket-header ticket-highlight d-flex align-items-center gap-2"
                style={{
                  borderColor: companyColor,
                }}
              >
                <i className="bi bi-ticket-fill" style={{ color: companyColor }}></i>

                <span className="ticket-label">Ticket No. :</span>

                <span className="ticket-value" style={{ color: companyColor }}>
                  {basic.ticket_number}
                </span>
              </div>
            </div>

            {/* DETAILS */}
            <div className="details-grid">
              {/* Company */}
              <div className="detail-row">
                <i className="bi bi-building text-warning"></i>
                <span className="label">Company</span>
                <span className="colon">:</span>
                <span className="detail-value">{basic.company_name}</span>
              </div>

              {/* Raised For */}
              <div className="detail-row">
                <i className="bi bi-person-badge text-success"></i>
                <span className="label">Client</span>
                <span className="colon">:</span>
                <span className="detail-value">{basic.client_name}</span>
              </div>

              {/* Created By */}
              <div className="detail-row">
                <i className="bi bi-person-fill" style={{ color: 'cadetblue' }}></i>
                <span className="label">Raised By</span>
                <span className="colon">:</span>
                <span className="detail-value">{basic.created_by}</span>
              </div>

              {/* Created At */}
              <div className="detail-row">
                <i className="bi bi-clock text-black"></i>
                <span className="label">Created Time</span>
                <span className="colon">:</span>
                <span className="detail-value">{moment(basic.created_at).format('lll')}</span>
              </div>

              {/* Category */}
              <div className="detail-row">
                <i className="bi bi-tag-fill text-warning"></i>
                <span className="label">Category</span>
                <span className="colon">:</span>
                <span className="detail-value">{basic.category_in_english}</span>
              </div>

              {/* Sub Category */}
              <div className="detail-row">
                <i className="bi bi-diagram-3-fill text-secondary"></i>
                <span className="label">Sub-Category</span>
                <span className="colon">:</span>
                <span className="detail-value">{basic.sub_category_in_english}</span>
              </div>

              {/* Details */}
              <div className="detail-row full">
                <i className="bi bi-chat-left-text text-muted mt-1"></i>
                <span className="label">Descriptions</span>
                <span className="colon">:</span>
                <span
                  className="detail-value text-muted"
                  dangerouslySetInnerHTML={{ __html: basic.note }}
                ></span>
              </div>

              {/* Status */}
              <div className="detail-row">
                <i className="bi bi-info-circle text-black"></i>
                <span className="label">Status</span>
                <span className="colon">:</span>
                <span
                  className={`badge px-3 py-2 ${currentTimelineData.status_name === 'Closed' ? 'bg-success' : 'bg-danger'}`}
                >
                  {currentTimelineData.status_name}
                </span>
              </div>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="card-body">
            <div className="timeline-wrapper">
              <div className="timeline">
                {timelineData.map((team, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-left">
                      {moment(team.assigned_time).format('MMM DD')}
                      <span>{moment(team.assigned_time).format('hh:mm a')}</span>
                    </div>

                    <div className="timeline-center">
                      <div className="dot"></div>
                      {idx !== timelineData.length - 1 && <div className="line"></div>}
                    </div>

                    <div className="timeline-right">
                      {/* <div className="timeline-status">
                        Assigned to {team.team_name}
                       
                      </div> */}
                      <div className="timeline-status">Assigned to {team.team_name}</div>

                      {team.agent_name && (
                        <div className="timeline-agent">
                          <i className="bi bi-person-circle"></i>
                          <span>{team.agent_name}</span>
                        </div>
                      )}

                      {team.comments.map((comment) => (
                        <div key={comment.id} className="timeline-message comment-row">
                          <div className="comment-icon">
                            <i className="bi bi-chat-dots-fill"></i>
                          </div>

                          <div className="comment-content">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: comment.comments,
                              }}
                            ></div>
                            <small className="comment-time">
                              {moment(comment.created_at).format('MMM DD, hh:mm a')}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {currentTimelineData?.status_name === 'Closed' && (
                  <div className="timeline-item">
                    <div className="timeline-left">
                      {moment(currentTimelineData.updated_at).format('MMM DD')}
                      <span>{moment(currentTimelineData.updated_at).format('hh:mm a')}</span>
                    </div>

                    <div className="timeline-center">
                      <div className="dot"></div>
                    </div>

                    <div className="timeline-right">
                      <div className="timeline-status">Ticket Closed</div>

                      <div className="timeline-message comment-row">
                        <div className="comment-icon text-success">
                          <i className="bi bi-check-circle-fill"></i>
                        </div>

                        <div className="comment-content">
                          Closed by <strong>{currentTimelineData.updated_by}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-center py-4">
        <small className="text-muted">
          &copy; {new Date().getFullYear()}{' '}
          <a
            href="https://www.race.net.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className="fw-semibold text-success text-decoration-none fs-6"
          >
            Race Online Ltd.
          </a>{' '}
          <span className="text-muted">Software Division</span>
        </small>
      </footer>

      {/* CSS */}
      <style jsx global>{`
        html,
        body {
          height: 100%;
        }
        body {
          overflow-y: auto;
          background: linear-gradient(135deg, #f6fbf4 0%, #eaf5e6 40%, #f4f6f8 100%);
          position: relative;
        }

        /* Corporate animated background layer */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(136, 168, 82, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(136, 168, 82, 0.12) 0%, transparent 40%);
          animation: corporateLoop 18s ease-in-out infinite alternate;
          z-index: -1;
        }

        /* Soft animated movement */
        @keyframes corporateLoop {
          0% {
            transform: scale(1) translateY(0px);
          }
          100% {
            transform: scale(1.05) translateY(-20px);
          }
        }

        .ticket-highlight {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(8px);
          padding: 12px 28px;
          border-radius: 14px;
          border: 1px solid rgba(136, 168, 82, 0.25);
          box-shadow: 0 8px 25px rgba(136, 168, 82, 0.12);
          transition: all 0.3s ease;
        }

        .ticket-highlight:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(136, 168, 82, 0.2);
        }

        /* Make number stronger */
        .ticket-highlight .ticket-value {
          font-size: 24px;
          font-weight: 800;
          color: rgb(136, 168, 82);
        }

        /* Slightly darker label */
        .ticket-highlight .ticket-label {
          font-size: 20px;
          font-weight: 800;
          color: #5c6c50;
        }

        /* TOP HEADER COMPACT STYLE */
        .ticket-top-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 25px;
        }

        /* Perfect Logo Size */
        .top-logo {
          height: 60px;
          width: auto;
        }

        /* Heading section */
        .top-heading h5 {
          font-size: 18px;
          margin: 0;
        }

        .top-heading p {
          font-size: 13px;
          color: #7a7a7a;
        }
        .tracker-card {
          max-width: 900px;
          margin: auto;
          border-radius: 14px;
          background: white !important;
          border: 1px solid #eee;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
        }

        .primary-color {
          color: rgb(136, 168, 82);
        }
        .status-green {
          background: rgb(136, 168, 82);
          color: white;
        }

        .ticket-header {
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
        }
        .ticket-header i {
          font-size: 22px;
        }
        .ticket-label {
          font-size: 20px;
          font-weight: 700;
          color: #6c757d;
        }
        .ticket-value {
          font-size: 22px;
          font-weight: 600;
          color: rgb(136, 168, 82);
        }

        .details-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }
        .detail-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .detail-row i {
          font-size: 16px;
          min-width: 18px;
        }
        .detail-row .label {
          min-width: 120px;
          font-size: 16px;
          color: #6c757d;
        }
        .detail-row .colon {
          width: 10px;
          text-align: center;
        }
        .detail-row .detail-value {
          font-size: 16px;
          font-weight: 600;
        }
        .detail-row.full .detail-value {
          font-weight: 400;
          font-size: 16px;
        }
        .detail-row .badge {
          font-size: 16px;
          font-weight: 600;
        }

        .timeline-wrapper {
          max-height: 350px;
          overflow-y: auto;
          padding-right: 10px;
        }

        .timeline-item {
          display: grid;
          grid-template-columns: 130px 40px 1fr;
          margin-bottom: 22px;
        }

        .timeline-left {
          text-align: right;
          font-size: 16px;
          color: #264966 !important;
          padding-right: 15px;
        }
        .timeline-left span {
          display: block;
          font-size: 14px;
        }
        .timeline-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 10px;
        }
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #264966 !important;
        }
        .line {
          width: 2px;
          flex-grow: 1;
          background: #2649667a;
          margin-top: 4px;
        }
        .timeline-right {
          padding-left: 40px;
        }
        .timeline-status {
          font-size: 16px;
          font-weight: 600;
        }
        .timeline-message {
          font-size: 16px;
          color: #6c757d;
        }

        .timeline-agent {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          font-size: 14px;
          color: #555;
        }

        .timeline-agent i {
          font-size: 16px;
          color: #264966;
        }

        /* COMMENT STYLE */
        .comment-row {
          display: flex;
          gap: 8px;
          margin-top: 6px;
          align-items: flex-start;
        }

        .comment-icon {
          color: gray;
          font-size: 14px;
          margin-top: 2px;
        }

        .comment-content {
          font-size: 15px;
        }

        .comment-time {
          display: block;
          font-size: 12px;
          color: #999;
          margin-top: 2px;
        }

        @media (max-width: 768px) {
          .timeline-item {
            grid-template-columns: 90px 20px 1fr;
          }
          .timeline-left {
            font-size: 11px;
          }
          .timeline-left span {
            font-size: 10px;
          }
          .timeline-right {
            padding-left: 6px;
          }
          .detail-value {
            font-size: 16px;
          }
          .detail-row.full .detail-value {
            font-size: 14px;
          }
          .ticket-value {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};
