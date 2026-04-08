import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useUserRolePermissions } from "../../custom-hook/useUserRolePermissions";
import { CommentUpdateProvider } from "../../context/comment/CommentContex";
import { FullPageLoader } from "../components/loader/FullPageLoader";
import { IsLoadingContext } from "../../context/LoaderContext";

export const MainContent = ({ children }) => {
  const { isLoadingContextUpdated } = useContext(IsLoadingContext);
  const { pathname } = useLocation();
  const { hasPermission } = useUserRolePermissions();

  return (
    <div className='main'>
      {isLoadingContextUpdated ? <FullPageLoader /> : ""}
      <div className='sidebar'>
        <Sidebar />
      </div>
      <div className='content-box'>
        <div className='header'>
          <Header />
        </div>
        <div className='content'>{children}</div>
        {/* {pathname === "/admin/tickets"
          ? hasPermission("Client_Self_Ticket_Create") && (
              <div className='client-complaint-create-floating-button'>
                <Link className='' to='/admin/customer-complaint-create'>
                  <i className='bi bi-ticket-detailed'></i>
                </Link>
              </div>
            )
          : null} */}
      </div>
      <ToastContainer autoClose={1000} />
    </div>
  );
};
