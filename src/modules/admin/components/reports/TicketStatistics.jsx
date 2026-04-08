import React, { useContext, useEffect, useState } from "react";
import { Settings, Filter } from "lucide-react";
import { userContext } from "../../../context/UserContext";
import { useUserRolePermissions } from "../../../custom-hook/useUserRolePermissions";
import {
  dashboardStatisticsBasedOnDepartment,
  dashboardStatisticsBasedOnDivision,
  dashboardStatisticsBasedOnTeam,
} from "../../../../api/api-client/dashboardApi";
import { printDateRangeLastThirtyDays } from "../../../../utils/utility";
import { DepartmentDivisionTeamFilterByDateComponent } from "../DepartmentDivisionTeamFilterByDateComponent";
import { DivLoader } from "../loader/DivLoader";
import { errorMessage } from "../../../../api/api-config/apiResponseMessage";
import { DynamicOffcanvas } from "../DynamicOffcanvas";

export const TicketStatistics = () => {
  const { user } = useContext(userContext);
  const { hasPermission } = useUserRolePermissions();
  const [teamData, setTeamData] = useState([]);
  const [divisionData, setDivisionData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [printDateRange, setPrintDateRange] = useState("");
  const [
    isLoadingTeamStatisticsAllEntities,
    setIsLoadingTeamStatisticsAllEntities,
  ] = useState(false);
  const [
    isLoadingDivisionStatisticsAllEntities,
    setIsLoadingDivisionStatisticsAllEntities,
  ] = useState(false);
  const [
    isLoadingDepartmentStatisticsAllEntities,
    setIsLoadingDepartmentStatisticsAllEntities,
  ] = useState(false);

  const individualSectionLoader = {
    isDepartment: isLoadingDepartmentStatisticsAllEntities,
    isDivision: isLoadingDivisionStatisticsAllEntities,
    isTeam: isLoadingTeamStatisticsAllEntities,
  };

  const [offcanvasConfig, setOffcanvasConfig] = useState({
    isOpen: false,
    title: "",
    subtitle: "",
    icon: null,
    width: "40%",
    content: null,
  });

  const openOffcanvas = (config) => {
    setOffcanvasConfig({
      isOpen: true,
      ...config,
    });
  };

  const closeOffcanvas = () => {
    setOffcanvasConfig((prev) => ({ ...prev, isOpen: false }));
  };
  const [activeTab, setActiveTab] = useState("");

  const fetchStatistics = () => {
    if (activeTab === "team") {
      setIsLoadingTeamStatisticsAllEntities(true);
      dashboardStatisticsBasedOnTeam({
        fromDate: "",
        toDate: "",
      })
        .then((response) => {
          setTeamData(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingTeamStatisticsAllEntities(false);
        });
    }

    if (activeTab === "division") {
      setIsLoadingDivisionStatisticsAllEntities(true);
      dashboardStatisticsBasedOnDivision({
        fromDate: "",
        toDate: "",
      })
        .then((response) => {
          setDivisionData(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingDivisionStatisticsAllEntities(false);
        });
    }

    if (activeTab === "department") {
      setIsLoadingDepartmentStatisticsAllEntities(true);
      dashboardStatisticsBasedOnDepartment({
        fromDate: "",
        toDate: "",
      })
        .then((response) => {
          setDepartmentData(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingDepartmentStatisticsAllEntities(false);
        });
    }
  };

  // useEffect(() => {
  //   fetchStatistics();
  // }, [activeTab]);

  return (
    <div className='container-fluid'>
      {hasPermission("Statistics_of_Business_Entities") && (
        <div className='row'>
          <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
            <div className='overdue-ticket'>
              {/* <div className='d-flex justify-content-between'>
                <h6 className='header-title'></h6>

                <div className='d-flex align-items-center'>
                  <h6 className='header-title'>{printDateRange}</h6>
                  <button
                    type='button'
                    onClick={() =>
                      openOffcanvas({
                        title: "Filter",
                        subtitle: "Customize your filters",
                        icon: <Filter className='me-2' size={18} />,
                        content: (
                          <DepartmentDivisionTeamFilterByDateComponent
                            closeOffcanvas={closeOffcanvas}
                            setTeamData={setTeamData}
                            setDivisionData={setDivisionData}
                            setDepartmentData={setDepartmentData}
                            setPrintDateRange={setPrintDateRange}
                          />
                        ),
                      })
                    }
                    className='btn bg-transparent'>
                    <Settings size={16} />
                  </button>
                </div>
              </div> */}

              <div className='body'>
                <ul className='nav nav-tabs' id='myTab' role='tablist'>
                  {hasPermission("Statistics_Department") && (
                    <li className='nav-item' role='presentation'>
                      <button
                        className={`nav-link ${
                          activeTab === "department" ? "active" : ""
                        }`}
                        id='home-tab'
                        data-bs-toggle='tab'
                        data-bs-target='#department-tab-pane'
                        type='button'
                        role='tab'
                        onClick={() => setActiveTab("department")}
                        aria-controls='home-tab-pane'
                        aria-selected={activeTab === "department"}>
                        Department
                      </button>
                    </li>
                  )}
                  {hasPermission("Statistics_Division") && (
                    <li className='nav-item' role='presentation'>
                      <button
                        className={`nav-link ${
                          activeTab === "division" ? "active" : ""
                        }`}
                        id='profile-tab'
                        data-bs-toggle='tab'
                        data-bs-target='#division-tab-pane'
                        type='button'
                        role='tab'
                        onClick={() => setActiveTab("division")}
                        aria-controls='profile-tab-pane'
                        aria-selected='false'>
                        Division
                      </button>
                    </li>
                  )}
                  {hasPermission("Statistics_Team") && (
                    <li className='nav-item' role='presentation'>
                      <button
                        className={`nav-link ${
                          activeTab === "team" ? "active" : ""
                        }`}
                        id='profile-tab'
                        data-bs-toggle='tab'
                        data-bs-target='#team-tab-pane'
                        type='button'
                        role='tab'
                        onClick={() => setActiveTab("team")}
                        aria-controls='profile-tab-pane'
                        aria-selected='false'>
                        Team
                      </button>
                    </li>
                  )}
                  <li className='nav-item ms-auto d-flex align-items-center'>
                    <h6 className='me-2 text-dark'>{printDateRange}</h6>
                    <button
                      type='button'
                      onClick={() =>
                        openOffcanvas({
                          title: "Filter",
                          subtitle: "Customize your filters",
                          icon: <Filter className='me-2' size={18} />,
                          content: (
                            <DepartmentDivisionTeamFilterByDateComponent
                              closeOffcanvas={closeOffcanvas}
                              setTeamData={setTeamData}
                              setDivisionData={setDivisionData}
                              setDepartmentData={setDepartmentData}
                              setPrintDateRange={setPrintDateRange}
                              setIsLoadingTeamStatisticsAllEntities={
                                setIsLoadingTeamStatisticsAllEntities
                              }
                              setIsLoadingDivisionStatisticsAllEntities={
                                setIsLoadingDivisionStatisticsAllEntities
                              }
                              setIsLoadingDepartmentStatisticsAllEntities={
                                setIsLoadingDepartmentStatisticsAllEntities
                              }
                              setActiveTab={setActiveTab}
                            />
                          ),
                        })
                      }
                      className='btn bg-transparent'>
                      <Settings size={16} />
                    </button>
                  </li>
                </ul>

                <div className='tab-content' id='myTabContent'>
                  {individualSectionLoader["isDepartment"] ? (
                    <DivLoader />
                  ) : (
                    <div
                      className={`tab-pane fade ${
                        activeTab === "department" ? "show active" : ""
                      }`}
                      id='department-tab-pane'
                      role='tabpanel'
                      aria-labelledby='home-tab'
                      tabIndex='0'>
                      <div className='table-responsive'>
                        <table className='table table-bordered mt-4'>
                          <thead>
                            <tr>
                              <th>Department</th>
                              <th>Open</th>
                              <th>Closed</th>
                              <th>Created</th>
                              {/* <th>Request Resolved</th> */}
                              <th>SLA Violated (Response) </th>
                              <th>SLA Violated (Resolved)</th>
                              <th>Avg. Response Time</th>
                              <th>Avg. Resolved Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {departmentData?.map((item, index) => (
                              <tr key={index}>
                                <th className='left-item'>
                                  {item.department_name}
                                </th>
                                <td>{item.ticket_open_by_team}</td>
                                <td>{item.ticket_closed_by_team}</td>
                                <td>{item.total_created}</td>
                                {/* <td>{item.total_resolved}</td> */}
                                <td>{item.over_due_fr}</td>
                                <td>{item.over_due}</td>
                                <td>{item.average_time}</td>
                                <td>{item.average_srv_time}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {individualSectionLoader["isDivision"] ? (
                    <DivLoader />
                  ) : (
                    <div
                      className={`tab-pane fade ${
                        activeTab === "division" ? "show active" : ""
                      }`}
                      id='division-tab-pane'
                      role='tabpanel'
                      aria-labelledby='profile-tab'
                      tabIndex='0'>
                      <div className='table-responsive'>
                        <table className='table table-bordered mt-4'>
                          <thead>
                            <tr>
                              <th>Division</th>
                              <th>Open</th>
                              <th>Closed</th>
                              <th>Created</th>
                              {/* <th>Request Resolved</th> */}
                              <th>SLA Violated (Response) </th>
                              <th>SLA Violated (Resolved)</th>
                              <th>Avg. Response Time</th>
                              <th>Avg. Resolved Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {divisionData?.map((item, index) => (
                              <tr key={index}>
                                <th className='left-item'>
                                  {item.division_name}
                                </th>
                                <td>{item.ticket_open_by_team}</td>
                                <td>{item.ticket_closed_by_team}</td>
                                <td>{item.total_created}</td>
                                {/* <td>{item.total_resolved}</td> */}
                                <td>{item.over_due_fr}</td>
                                <td>{item.over_due}</td>
                                <td>{item.average_time}</td>
                                <td>{item.average_srv_time}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {individualSectionLoader["isTeam"] ? (
                    <DivLoader />
                  ) : (
                    <div
                      className={`tab-pane fade ${
                        activeTab === "team" ? "show active" : ""
                      }`}
                      id='team-tab-pane'
                      role='tabpanel'
                      aria-labelledby='profile-tab'
                      tabIndex='0'>
                      <div className='table-responsive'>
                        <table className='table table-bordered mt-4'>
                          <thead>
                            <tr>
                              <th>Team</th>
                              <th>Open</th>
                              <th>Closed</th>
                              <th>Created</th>
                              <th>Escalated In</th>
                              <th>Escalated Out</th>
                              <th>SLA Violated (Response) </th>
                              <th>SLA Violated (Resolved)</th>
                              <th>Avg. Open Age</th>
                              <th>Avg. Response Time</th>
                              <th>Avg. Resolved Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {teamData?.map((item, index) => (
                              <tr key={index}>
                                <th className='left-item'>{item.team_name}</th>
                                <td>{item.ticket_open_by_team}</td>
                                <td>{item.ticket_closed_by_team}</td>
                                <td>{item.total_created}</td>
                                <td>{item.escalated_in}</td>
                                <td>{item.ticket_forwarded}</td>
                                <td>{item.over_due_fr}</td>
                                <td>{item.over_due}</td>
                                <td>{item.avg_open_ticket_age}</td>
                                <td>{item.average_time}</td>
                                <td>{item.average_srv_time}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {offcanvasConfig.isOpen && (
        <DynamicOffcanvas
          isOpen={offcanvasConfig.isOpen}
          onClose={closeOffcanvas}
          title={offcanvasConfig.title}
          subtitle={offcanvasConfig.subtitle}
          icon={offcanvasConfig.icon}
          width={offcanvasConfig.width}
          content={offcanvasConfig.content}
        />
      )}
    </div>
  );
};
