import React, { useState } from "react";
import useOutsideClick from "../../custom-hook/useOutsideClick";
import { TicketStatistics } from "../components/reports/TicketStatistics";
import { TicketLifecycle } from "../components/reports/TicketLifecycle";
import { TicketDetailsNew } from "../components/reports/TicketDetailsNew";
import { AgentPerformance } from "../components/reports/AgentPerformance";
import { SLAViolation } from "../components/reports/SLAViolation";
import { TopComplaint } from "../components/reports/TopComplaint";
import { useUserRolePermissions } from "../../custom-hook/useUserRolePermissions";
import TicketDetailsByLevel from "../components/reports/TicketDetailsByLevel";

export const Reports = () => {
  const { hasPermission } = useUserRolePermissions();
  const [animate, setAnimate] = useState("");
  const [reportListShow, setReportListShow] = useState(false);
  const [selectedReport, setSelectedReport] = useState("Ticket Statistics");
  const [reportTitle, setReportTitle] = useState("Ticket Statistics");

  const reportListRef = useOutsideClick(() => {
    if (reportListShow) {
      setAnimate("animate__slideOutLeft");
      setTimeout(() => {
        setReportListShow(false);
        setAnimate("");
      }, 500);
    }
  });

  const renderContent = () => {
    switch (selectedReport) {
      case "Ticket Statistics":
        return <TicketStatistics />;
      case "Ticket Lifecycle":
        return <TicketLifecycle />;
      case "Ticket Details":
        return <TicketDetailsNew />;
      case "Agent Performance":
        return <AgentPerformance />;
      case "Ticket Details By Level":
        return <TicketDetailsByLevel />;
      case "Top Complaint":
        return <TopComplaint />;
      case "SLA Violation":
        return <SLAViolation />;
      default:
        return null;
    }
  };

  const handleReportSelection = (report) => {
    setSelectedReport(report);
    setReportListShow(false);
    setReportTitle(report);
    setAnimate("animate__slideOutLeft");
    setTimeout(() => {
      setAnimate("");
    }, 500);
  };

  return (
    <section>
      {reportListShow && (
        <div
          ref={reportListRef}
          className={`report-list-container animate__animated ${animate} animate__faster`}>
          <h6 className='custom-card-header'>Reports</h6>
          <ul className='report-nav-list'>
            {hasPermission("Ticket_Lifecycle") && (
              <li>
                <button
                  type='button'
                  onClick={() => handleReportSelection("Ticket Lifecycle")}>
                  Ticket Lifecycle
                </button>
              </li>
            )}
            {hasPermission("Statistics") && (
              <li>
                <button
                  type='button'
                  onClick={() => handleReportSelection("Ticket Statistics")}>
                  Ticket Statistics
                </button>
              </li>
            )}
            {hasPermission("Statistics") && (
              <li>
                <button
                  type='button'
                  onClick={() => handleReportSelection("Ticket Details")}>
                  Ticket Details
                </button>
              </li>
            )}
            {hasPermission("Statistics") && (
              <li>
                <button
                  type='button'
                  onClick={() => handleReportSelection("Agent Performance")}>
                  Agent Performance
                </button>
              </li>
            )}

            {/* 
            {hasPermission("Ticket_Lifecycle") && (
              <li>
                <button
                  type='button'
                  onClick={() => handleReportSelection("Ticket Details By Level")}>
                  Ticket Details By Level
                </button>
              </li>
            )} */}

            {/* {hasPermission("Top_Complaint") && (
              <li>
                <button
                  type='button'
                  onClick={() => handleReportSelection("Top Complaint")}>
                  Top Complaint
                </button>
              </li>
            )}
            {hasPermission("Agent_Performance") && (
              <li>
                <button
                  type='button'
                  onClick={() => handleReportSelection("Agent Performance")}>
                  Agent Performance
                </button>
              </li>
            )}

            {hasPermission("SLA_Violated") && (
              <li>
                <button
                  type='button'
                  onClick={() => handleReportSelection("SLA Violation")}>
                  SLA Violation
                </button>
              </li>
            )} */}
          </ul>
        </div>
      )}
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
            <div className='custom-card'>
              <h6 className='custom-card-header py-1'>
                <button
                  type='button'
                  className='btn-button'
                  onClick={() => {
                    if (reportListShow) {
                      setAnimate("animate__slideOutLeft");
                      setTimeout(() => {
                        setReportListShow(false);
                        setAnimate("");
                      }, 500);
                    } else {
                      setReportListShow(true);
                      setAnimate("animate__slideInLeft");
                    }
                  }}>
                  <i className='bi bi-text-left fs-5'></i>
                </button>
                {reportTitle && (
                  <span className='ms-4'>
                    {"Report"}
                    <i className='bi bi-chevron-right mx-1'></i> {reportTitle}
                  </span>
                )}
              </h6>
              <div className='p-3'>{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
