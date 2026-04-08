import React, { useContext, useEffect, useState } from 'react';
import { OpenTicketHeaderFilter } from '../components/ticket/OpenTicketHeaderFilter';
import { ClosedDataTable } from './../components/ticket/ClosedDataTable';
import { OpenDataTable } from '../components/ticket/OpenDataTable';
import { closedIcon, openIcon, plusIcon } from '../../../data/data';
import { ClosedTicketHeaderFilter } from '../components/ticket/ClosedTicketHeaderFilter';
import { AdvancedTicketFilter } from '../components/ticket/AdvancedTicketFilter';
import {
  fetchTicketByStatusAndDefaultEntity,
  ticketCount,
} from '../../../api/api-client/ticketApi';
import { userContext } from '../../context/UserContext';
import { errorMessage } from '../../../api/api-config/apiResponseMessage';
import { IsLoadingContext } from '../../context/LoaderContext';

export const Tickets = () => {
  const { user } = useContext(userContext);
  const { setIsLoadingContextUpdated } = useContext(IsLoadingContext);
  const [activeTab, setActiveTab] = useState('open');
  const [ticketFilter, setTicketFilter] = useState(false);
  const [tikcetData, setTikcetData] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [totalCount, setTotalCount] = useState(null);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const parameterData = {
    status: activeTab,
    businessEntity1: user?.default_entity_id,
    businessEntity: '',
    team1: '',
    team: user?.team_id,
    slaMissed: '',
    fromDate: '',
    toDate: '',
    userType: user?.type,
    userId: user?.id,
  };

  useEffect(() => {
    const fetchTickets = () => {
      setIsLoading(true);
      fetchTicketByStatusAndDefaultEntity(parameterData).then((response) => {
        setTikcetData(response.data);
        setIsLoading(false);
      });
    };
    const fetchCount = () => {
      ticketCount({
        userId: user?.id,
        team: user?.user_teams,
        userType: user?.type,
        businessEntity1: user?.default_entity_id,
      }).then((response) => {
        setTotalCount(response.data);
      });
    };

    Promise.all([fetchTickets(), fetchCount()])
      .catch(errorMessage)
      .finally(() => {});
  }, [activeTab, clickCount]);

  // const renderTabContent = () => {
  //   switch (activeTab) {
  //     case "open":
  //       return (
  //         <div className='bg-white'>
  //           <OpenTicketHeaderFilter
  //             ticketFilter={ticketFilter}
  //             setActiveTab={setActiveTab}
  //           />
  //           <OpenDataTable
  //             ticketList={tikcetData}
  //             setActiveTab={setActiveTab}
  //           />
  //         </div>
  //       );
  //     case "closed":
  //       return (
  //         <div className='bg-white'>
  //           <ClosedTicketHeaderFilter
  //             ticketFilter={ticketFilter}
  //             setActiveTab={setActiveTab}
  //           />
  //           <ClosedDataTable ticketList={tikcetData} setActiveTab={setActiveTab} />
  //         </div>
  //       );

  //     default:
  //       return null;
  //   }
  // };

  // console.log(user);
  // console.log(parameterData);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div className="d-flex align-items-center">
            <ul
              className="nav nav-tabs responsive-nav-tabs w-100 d-flex align-items-center"
              id="myTab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className={`position-relative nav-link ${activeTab === 'open' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('open');
                    setClickCount((prevCount) => prevCount + 1);
                  }}
                  type="button"
                  role="tab"
                >
                  {openIcon}
                  Open{' '}
                  {activeTab === 'closed' ? (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger z-3">
                      {totalCount?.open_count}
                    </span>
                  ) : (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger z-3">
                      {tikcetData?.length}
                    </span>
                  )}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`position-relative nav-link ${activeTab === 'closed' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('closed');
                    setClickCount((prevCount) => prevCount + 1);
                  }}
                  type="button"
                  role="tab"
                >
                  {closedIcon}
                  Closed
                  {activeTab === 'open' ? (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {totalCount?.close_count}
                    </span>
                  ) : (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {tikcetData?.length}
                    </span>
                  )}
                </button>
              </li>
              {/* 👉 RIGHT SIDE BUTTON */}
              <li className="ms-auto">
                <button
                  type="button"
                  className="btn text-black btn-sm me-2"
                  onClick={() => setIsAdvancedFilterOpen(true)}
                  style={{ border: '1px solid #80808061' }}
                >
                  <i className="bi bi-funnel"></i> Advanced Filter
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="btn-button d-block d-sm-none "
                  onClick={() => setTicketFilter(!ticketFilter)}
                >
                  <i className="bi bi-filter"></i>
                </button>
              </li>
            </ul>
          </div>
          <div className="tab-content" id="myTabContent" style={{ borderTop: 'none' }}>
            {/* {renderTabContent()} */}
            <div className="bg-white">
              {/* <OpenTicketHeaderFilter
                ticketFilter={ticketFilter}
                setTikcetData={setTikcetData}
                activeTab={activeTab}
                setIsLoading={setIsLoading}
              /> */}
              <OpenDataTable
                ticketList={tikcetData}
                setTikcetData={setTikcetData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isLoadingTableData={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      <AdvancedTicketFilter
        setIsLoading={setIsLoading}
        setTikcetData={setTikcetData}
        activeTab={activeTab}
        isOpen={isAdvancedFilterOpen}
        onClose={() => setIsAdvancedFilterOpen(false)}
      />
    </div>
  );
};
