import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  useChannelStateListener,
  useChannel,
  usePresence,
  ChannelProvider,
  useConnectionStateListener,
} from 'ably/react';
import {
  bellIcon,
  commentIcon,
  faHeadSetIcon,
  faLockIcon,
  faLogoutIcon,
  handShakeIcon,
  headerNavItems,
} from '../../../data/data';
import { CommentsNotification } from '../components/CommentsNotification';
import { SLANotifications } from '../components/SLANotifications';
import useOutsideClick from '../../custom-hook/useOutsideClick';
import { logoutUser } from '../../../api/api-client/userApi';
import { errorMessage } from '../../../api/api-config/apiResponseMessage';
import { userContext } from '../../context/UserContext';
import {
  fetchCommentsByUserTeam,
  fetchViolatedFirstResponseTimeSla,
  fetchViolatedServiceResponseTimeSla,
} from '../../../api/api-client/ticketApi';
// import { channel } from "../../../utils/echo";
import { CommentUpdateContext } from '../../context/comment/CommentContex';
import { useUserRolePermissions } from '../../custom-hook/useUserRolePermissions';
import orbitLogo from '../../../assets/orbit.png';
import { BUSINESS_ENTITIES } from '../../../constants/constants';

export const Header = () => {
  const { user, setUser } = useContext(userContext);
  const logo = BUSINESS_ENTITIES[user?.default_entity_id]?.logo;
  const { hasPermission } = useUserRolePermissions();
  const { commentUpdated } = useContext(CommentUpdateContext);
  const location = useLocation();
  const [profileShow, setProfileShow] = useState(false);
  const [username, setUsername] = useState('');
  const [notificationShow, setNotificationShow] = useState(false);
  const [activeTab, setActiveTab] = useState('slaNotification');
  const [isChecked, setIsChecked] = useState(true);
  const [readUnreadLabel, setReadUnreadLabel] = useState('Unread');
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [violatedFirstResponse, setViolatedFirstResponse] = useState([]);
  const [violatedServiceResponse, setViolatedServiceResponse] = useState([]);

  // const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const notificationDropdownRef = useOutsideClick(() => setNotificationShow(false));
  const profileDropdownRef = useOutsideClick(() => setProfileShow(false));

  // useEffect(() => {
  //   channel.subscribe((message) => {
  //     console.log("New message received:", message);
  //   });

  //   channel.on("attached", () => {
  //     console.log("Channel successfully attached.");
  //   });

  //   channel.on("failed", (error) => {
  //     console.error("Channel attachment failed:", error);
  //   });

  //   return () => {
  //     channel.unsubscribe();
  //   };
  // }, []);

  // const [messages, updateMessages] = useState([]);
  // const { channel } = useChannel('comment-channel', (message) => {
  //   console.log(message.comment);
  //     updateMessages((prev) => [...prev, message]);
  // });

  // channel.publish('new-comment', { message: 'New comment received!' });
  // console.log(channel);

  // useEffect(() => {
  //   if (user?.type === 'Customer' || user?.type === 'Client') {
  //     return;
  //   }
  //   setIsLoading(true);
  //   const ViolatedFirstResponseTime = (id) => {
  //     fetchViolatedFirstResponseTimeSla(id).then((response) => {
  //       setViolatedFirstResponse(response.data);
  //     });
  //   };

  //   const ViolatedServiceResponseTime = (id) => {
  //     fetchViolatedServiceResponseTimeSla(id).then((response) => {
  //       setViolatedServiceResponse(response.data);
  //     });
  //   };

  //   Promise.all([
  //     ViolatedFirstResponseTime(user?.user_teams?.[0]),
  //     ViolatedServiceResponseTime(user?.user_teams?.[0]),
  //   ])
  //     .catch(errorMessage)
  //     .finally(() => setIsLoading(false));
  // }, [user]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetchCommentsByUserTeam({
  //     userId: user?.id,
  //     userType: user?.type,
  //     userTeam: user?.user_teams?.[0],
  //   })
  //     .then((response) => {
  //       setComments(response.data);
  //     })
  //     .catch(errorMessage)
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // }, [user]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetchCommentsByUserTeam({
  //     userId: user?.id,
  //     userType: user?.type,
  //     userTeam: user?.user_teams?.[0],
  //   })
  //     .then((response) => {
  //       setComments(response.data);
  //     })
  //     .catch(errorMessage)
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // }, [commentUpdated]);

  const handleReadUnreadToggle = () => {
    setIsChecked(!isChecked);
    setReadUnreadLabel(!isChecked ? 'Unread' : 'Read');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const returnTabContent = () => {
    switch (activeTab) {
      case 'slaNotification':
        if (hasPermission('Notification_Off_of_SLA')) {
          return (
            <SLANotifications
              violatedFirstResponse={violatedFirstResponse}
              violatedServiceResponse={violatedServiceResponse}
              setNotificationShow={setNotificationShow}
            />
          );
        }

      case 'commentsNotification':
        return (
          <CommentsNotification comments={comments} setNotificationShow={setNotificationShow} />
        );
      default:
        return null;
    }
  };

  const getFirstCaracterOfFirstTwoWord = (fullName) => {
    if (fullName) {
      const firstTwoWords = fullName.split(' ').slice(0, 2);
      const initials = firstTwoWords.map((word) => word.charAt(0)).join('');
      return initials.toUpperCase();
    }
  };

  const handleLogout = async () => {
    logoutUser()
      .then((response) => {
        localStorage.clear();
        navigate('/');
      })
      .catch(errorMessage);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white w-100">
      <div className="container-fluid">
        {/* <Link className='navbar-brand text-success fw-bold' to='dashboard'>
         
          <img
            src={orbitLogo}
            alt='logo'
            height='40px'
            width='60px'
            className='logo me-2'
          />
          HelpDesk
        </Link> */}
        <Link
          className="navbar-brand text-success fw-bold d-flex align-items-center"
          to="dashboard"
        >
          <img
            src={BUSINESS_ENTITIES[user?.default_entity_id]?.logo || orbitLogo}
            alt="logo"
            height="30px"
            width="auto"
            className="logo me-2"
          />
          <span className="align-middle mt-2">HelpDesk</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse header-nav-show" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            {/* {headerNavItems.map((item, index) => (
              <li className='nav-item'>
                <Link key={index} to={item.link} className='nav-link'>
                  {item.title}
                </Link>
              </li>
            ))} */}

            {/* <li className='nav-item'>
              <button
                type='button'
                className='btn btn-sm border-0 position-relative'
                onClick={() => setNotificationShow(!notificationShow)}>
                {bellIcon}
                <span
                  className='position-absolute start-100 translate-middle badge rounded-pill bg-danger'
                  style={{ top: "3px" }}>
                  {hasPermission("Notification_Off_of_SLA")
                    ? (violatedFirstResponse?.length > 0
                        ? violatedFirstResponse.length
                        : 0) +
                      (violatedServiceResponse?.length > 0
                        ? violatedServiceResponse.length
                        : 0) +
                      (comments?.length > 0 ? comments.length : 0)
                    : comments?.length > 0
                    ? comments.length
                    : 0}
                </span>
              </button>
              {notificationShow && (
                <div className='notification-box' ref={notificationDropdownRef}>
                  <div className='container-fluid'>
                    <div className='row py-2'>
                      <div className='col-6'>
                        <h6>Notifications</h6>
                      </div>
                      <div className='col-6'>
                     
                      </div>
                    </div>
                  </div>

                  <ul className='nav nav-tabs' id='myTab' role='tablist'>
                    {hasPermission("Notification_Off_of_SLA") && (
                      <li className='nav-item' role='presentation'>
                        <button
                          className={`position-relative nav-link ${
                            activeTab === "slaNotification" ? "active" : ""
                          }`}
                          onClick={() => setActiveTab("slaNotification")}
                          type='button'
                          role='tab'>
                          {handShakeIcon}
                          SLA
                          <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger z-3'>
                            {(violatedFirstResponse.length > 0
                              ? violatedFirstResponse.length
                              : "") +
                              (violatedServiceResponse.length > 0
                                ? violatedServiceResponse.length
                                : "")}
                          </span>
                        </button>
                      </li>
                    )}

                    <li className='nav-item' role='presentation'>
                      <button
                        className={`position-relative nav-link ${
                          activeTab === "commentsNotification" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("commentsNotification")}
                        type='button'
                        role='tab'>
                        {commentIcon}
                        Comments
                        <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                          {comments?.length > 0 ? comments.length : ""}
                        </span>
                      </button>
                    </li>
                  </ul>
                  <div className='animate__animated animate__fadeIn animate__faster py-2'>
                    {returnTabContent()}
                  </div>
                </div>
              )}
            </li> */}

            <li className="nav-item ms-4">
              <button
                type="button"
                className="user-profile"
                onClick={() => {
                  setProfileShow(!profileShow);
                }}
              >
                {getFirstCaracterOfFirstTwoWord(user?.fullname || 'N/A')}
              </button>
              {profileShow && (
                <ul
                  ref={profileDropdownRef}
                  className={`user-profile-dropdown animate__animated animate__fadeIn animate__faster`}
                >
                  <div className="user-profile-header">
                    <p>{user?.fullname || 'N/A'}</p>
                    <span>{user?.email_primary || 'N/A'}</span>
                  </div>
                  <li>
                    <Link to="/change-password" className="w-100 d-inline-block">
                      {faLockIcon}
                      Change Password
                    </Link>
                  </li>
                  <li>
                    <Link className="w-100 d-inline-block" onClick={handleLogout}>
                      {faLogoutIcon}
                      Logout
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
