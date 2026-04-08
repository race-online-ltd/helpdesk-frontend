import React, { useContext, useEffect, useState } from 'react';
import { Settings, Filter } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {
  barChartData,
  barChartOptions,
  doughnutChartOptions,
  doughnutSlaFrViolatedChartOptions,
  doughnutSlaSrViolatedChartOptions,
  doughnutSlaSuccessChartOptions,
  lineChartData,
  lineChartOptions,
  orbitOwnDoughnutChartOptions,
} from '../../../data/chart';
import { DashboardFilter } from '../components/DashboardFilter';
import { userContext } from '../../context/UserContext';
import { useUserRolePermissions } from '../../custom-hook/useUserRolePermissions';

import {
  dashboardLastThirtyDays,
  dashboardStatisticsBasedOnDepartment,
  dashboardStatisticsBasedOnDivision,
  dashboardStatisticsBasedOnTeam,
  dashboardStatisticsGraphBasedOnTeam,
  dashboardSubcategoryVsCreated,
  dashboardSummary,
  getOpenTicketCountByBusinessEntity,
  getSLAstatisticsTeamWise,
  getTicketCountAndAvgTimeByTeam,
  getTicketCountByClientCustomer,
  getTicketSummaryByBusinessEntity,
  fetchTicketCountTeamVsOrbitOwnEntities,
  fetchTicketCountOrbitOwnEntities,
} from '../../../api/api-client/dashboardApi';
import { errorMessage } from '../../../api/api-config/apiResponseMessage';
import { fetchCompany } from '../../../api/api-client/settings/companyApi';
import { dashboardPermission } from '../../../data/permission';
import { printDateRangeLastThirtyDays } from '../../../utils/utility';
import { TeamStatisticGraphFilterComponent } from '../components/TeamStatisticGraphFilterComponent';
import { DynamicOffcanvas } from '../components/DynamicOffcanvas';
import { IsLoadingContext } from '../../context/LoaderContext';
import { BusinessEntityStatisticsBarChartFilterComponent } from '../components/BusinessEntityStatisticsBarChartFilterComponent';
import { DepartmentDivisionTeamFilterByDateComponent } from '../components/DepartmentDivisionTeamFilterByDateComponent';
import { DashboardTicketCountDetailsComponent } from '../components/DashboardTicketCountDetailsComponent';
import { DivLoader } from '../components/loader/DivLoader';
import { SubcategoriesVsCreatedBarChartFilter } from '../components/SubcategoriesVsCreatedBarChartFilter';
import { ExportToExcel } from '../components/ExportToExcel';
import { DashboardTeamVsBusinessEntityTicketDetailsComponent } from '../components/DashboardTeamVsBusinessEntityTicketDetailsComponent';
import { ClientVsCustomerFilterComponent } from '../components/ClientVsCustomerFilterComponent';
import { TeamVsOrbitOwnEntityTicketDetails } from '../components/TeamVsOrbitOwnEntityTicketDetails';
import { DashboardBusinessEntityWiseTicketCountDetails } from '../components/DashboardBusinessEntityWiseTicketCountDetails';


export const Dashboard = () => {
  const { user } = useContext(userContext);
  const { hasPermission } = useUserRolePermissions();
  const { setIsLoadingContextUpdated } = useContext(IsLoadingContext);
  const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [opentTicketbusinessEntityWiseSummaryData, setOpentTicketbusinessEntityWiseSummaryData] =
    useState([]);
  const [ticketbusinessEntityWiseSummaryData, setTicketbusinessEntityWiseSummaryData] = useState(
    []
  );

  const [lastThirtyDaysSummaryData, setLastThirtyDaysSummaryData] = useState([]);
  const [lastThirtyDaysGraphData, setLastThirtyDaysGraphData] = useState([]);

  const [statisticsTeamSummaryData, setStatisticsTeamSummaryData] = useState([]);
  const [statisticsTeamGraphData, setStatisticsTeamGraphData] = useState([]);
  const [subcategoryVsCreatedGraphData, setSubcategoryVsCreatedGraphData] = useState([]);

  const [teamData, setTeamData] = useState([]);
  const [divisionData, setDivisionData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [printDateRange, setPrintDateRange] = useState(printDateRangeLastThirtyDays());
  const [printDateRangeForTeamStatisticsGraph, setPrintDateRangeForTeamStatisticsGraph] = useState(
    printDateRangeLastThirtyDays()
  );
  const [printDateRangeForCreatedVsClosed, setPrintDateRangeForCreatedVsClosed] = useState(
    printDateRangeLastThirtyDays()
  );
  const [displayTeamName, setDisplayTeamName] = useState(user?.user_team_names[0]);
  const [displayBusinessEntityName, setDisplayBusinessEntityName] =
    useState('All Business Entities');

  const [displayNameForSubcategoryVsCreated, setDisplayNameForSubcategoryVsCreated] = useState(
    user?.user_team_names[0]
  );
  const [printDateRangeForSubcategoryVsCreated, setPrintDateRangeForSubcategoryVsCreated] =
    useState(printDateRangeLastThirtyDays());

  const [isLoadingBusinessEntities, setIsLoadingBusinessEntities] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingCreatedVsClosedTickets, SetsLoadingCreatedVsClosedTickets] = useState(false);
  const [isLoadingOpenTickets, setIsLoadingOpenTickets] = useState(false);
  const [isLoadingLastThirtyDays, setIsLoadingLastThirtyDays] = useState(false);
  const [isLoadingSpecificTeamTickets, setIsLoadingSpecificTeamTickets] = useState(false);
  const [isLoadingStatisticsAllEntities, setIsLoadingStatisticsAllEntities] = useState(false);
  const [isLoadingSubcategoryVsCreatedTickets, setIsLoadingSubcategoryVsCreatedTickets] =
    useState(false);

  const [isLoadingTicketCountAndAvgTimeTeam, setIsLoadingTicketCountAndAvgTimeTeam] =
    useState(false);
  const [isLoadingSLAstatisticsTeamWise, setIsLoadingSLAstatisticsTeamWise] = useState(false);
  const [ticketCountAndAvgTimeByTeamData, setTicketCountAndAvgTimeByTeamData] = useState([]);
  const [isLoadingTicketCountClientVsCustomer, setIsLoadingTicketCountClientVsCustomer] =
    useState(false);
  const [ticketCountClientVsCustomer, setTicketCountClientVsCustomer] = useState([]);
  const [printDateRangeForClientVsCustomer, setPrintDateRangeForClientVsCustomer] = useState(
    printDateRangeLastThirtyDays()
  );

  const [displayClientVsCustomerBusinessEntityName, setDisplayClientVsCustomerBusinessEntityName] =
    useState(ticketCountClientVsCustomer?.[0]?.company_name);

  const [ticketCountDetailsParam, setTicketCountDetailsParam] = useState({
    isOpen: false,
    isClose: false,
    isCreated: false,
    isEscaletedOut: false,
    isEscaletedIn: false,
    isFrViolated: false,
    isSrViolated: false,
    businessId: null,
    teamId: null,
    fromDate: null,
    toDate: null,
  });
  const [clientVsCustomerParam, setClientVsCustomerParam] = useState({
    businessEntity: user?.default_entity_id,
    fromDate: null,
    toDate: null,
  });
  const [slaStatisticsTicketCount, setSLAstatisticsTicketCount] = useState([]);

  const [ticketCountTeamVsOwnEntities, setTicketCountTeamVsOwnEntities] = useState([]);
  const [ticketCountOwnEntities, setTicketCountOwnEntities] = useState([]);
  const [isLoadingOpenTicketsOwnEntities, setIsLoadingOpenTicketsOwnEntities] = useState(false);
  const [isLoadingTeamVsOwnEntities, setIsLoadingTeamVsOwnEntities] = useState(false);

  useEffect(() => {
    if (statisticsTeamSummaryData) {
      setTicketCountDetailsParam((prev) => ({
        ...prev,
        teamId: statisticsTeamSummaryData.team_id,
      }));
    }
  }, [statisticsTeamSummaryData]);

  useEffect(() => {
    const fromDateSplit = printDateRangeForTeamStatisticsGraph?.split('-')?.[0]?.trim();
    const toDateSplit = printDateRangeForTeamStatisticsGraph?.split('-')?.[1]?.trim();
    setTicketCountDetailsParam((prev) => ({
      ...prev,
      fromDate: fromDateSplit,
      toDate: toDateSplit,
    }));
  }, [printDateRangeForTeamStatisticsGraph]);

  const [offcanvasConfig, setOffcanvasConfig] = useState({
    isOpen: false,
    title: '',
    subtitle: '',
    icon: null,
    width: '40%',
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

  useEffect(() => {
    const fetchBusinessEntityOptions = () => {
      setIsLoadingBusinessEntities(false);
      fetchCompany({
        userType: user?.type,
        userId: user?.id,
      })
        .then((response) => {
          setBusinessEntityOptions(
            response.result.map((option) => ({
              value: option.id,
              label: option.company_name,
            }))
          );
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingBusinessEntities(false);
        });
    };

    const fetchDashboardSummary = () => {
      setIsLoadingSummary(true);
      dashboardSummary({
        businessEntity: user?.default_entity_id,
        fromDate: '',
        toDate: '',
        userType: user?.type,
        userId: user?.id,
      })
        .then((response) => {
          setSummaryData(response.data[0] ? response.data[0] : []);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingSummary(false);
        });
    };

    const fetchOpenTicketCountByBusinessEntity = () => {
      setIsLoadingOpenTickets(true);
      getOpenTicketCountByBusinessEntity()
        .then((response) => {
          setOpentTicketbusinessEntityWiseSummaryData(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingOpenTickets(false);
        });
    };

    const fetchTicketSummaryByBusinessEntity = () => {
      setIsLoadingLastThirtyDays, true;
      getTicketSummaryByBusinessEntity()
        .then((response) => {
          setTicketbusinessEntityWiseSummaryData(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingLastThirtyDays(false);
        });
    };
    const fetchDashboardLastThirtyDays = () => {
      setIsLoadingLastThirtyDays(true);
      dashboardLastThirtyDays({
        businessEntity: user?.default_entity_id,
        userType: user?.type,
        userId: user?.id,
      })
        .then((response) => {
          setLastThirtyDaysSummaryData(response.data.summary);
          setLastThirtyDaysGraphData(response.data.opencloseByLast30Days);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingLastThirtyDays(false);
        });
    };

    const fetchStatisticGraphByTeam = () => {
      setIsLoadingSpecificTeamTickets(true);
      dashboardStatisticsGraphBasedOnTeam({
        team: user?.user_teams[0] || '',
        fromDate: '',
        toDate: '',
      })
        .then((response) => {
          if (response?.data?.ticketCountsTotal) {
            setStatisticsTeamSummaryData(response.data.ticketCountsTotal?.[0] || {});
            setStatisticsTeamGraphData(response.data.ticketCounts || []);
          }
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingSpecificTeamTickets(false);
        });
    };

    const fetchSubcategoryVsCreatedGraph = () => {
      setIsLoadingSubcategoryVsCreatedTickets(true);
      dashboardSubcategoryVsCreated({
        teamId: user?.user_teams[0] || '',
        businessId: '',
        fromDate: '',
        toDate: '',
      })
        .then((response) => {
          setSubcategoryVsCreatedGraphData(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingSubcategoryVsCreatedTickets(false);
        });
    };

    const fetchDashboardStatisticsTeam = () => {
      setIsLoadingStatisticsAllEntities(true);
      dashboardStatisticsBasedOnTeam({
        fromDate: '',
        toDate: '',
      })
        .then((response) => {
          setTeamData(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingStatisticsAllEntities(false);
        });
    };

    const fetchDashboardStatisticsDivision = () => {
      setIsLoadingStatisticsAllEntities(true);
      dashboardStatisticsBasedOnDivision({
        fromDate: '',
        toDate: '',
      })
        .then((response) => {
          setDivisionData(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingStatisticsAllEntities(false);
        });
    };

    const fetchDashboardStatisticsDepartment = () => {
      setIsLoadingStatisticsAllEntities(true);
      dashboardStatisticsBasedOnDepartment({
        fromDate: '',
        toDate: '',
      })
        .then((response) => {
          setDepartmentData(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingStatisticsAllEntities(false);
        });
    };
    const fetchTicketCountAndAvgTimeByTeam = () => {
      setIsLoadingTicketCountAndAvgTimeTeam(true);
      getTicketCountAndAvgTimeByTeam()
        .then((response) => {
          setTicketCountAndAvgTimeByTeamData(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingTicketCountAndAvgTimeTeam(false);
        });
    };

    const fetchTicketCountClientVsCustomer = () => {
      setIsLoadingTicketCountClientVsCustomer(true);
      getTicketCountByClientCustomer(clientVsCustomerParam)
        .then((response) => {
          setTicketCountClientVsCustomer(response.data);
          setDisplayClientVsCustomerBusinessEntityName(response.data?.dayWise?.[0]?.company_name);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingTicketCountClientVsCustomer(false);
        });
    };

    const fetchSlaStatisticsTeamWiseData = () => {
      setIsLoadingSLAstatisticsTeamWise(true);
      getSLAstatisticsTeamWise()
        .then((response) => {
          setSLAstatisticsTicketCount(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingSLAstatisticsTeamWise(false);
        });
    };
    const fetchOpenTicketsTeamVsOwnEntities = () => {
      setIsLoadingTeamVsOwnEntities(true);
      fetchTicketCountTeamVsOrbitOwnEntities()
        .then((response) => {
          setTicketCountTeamVsOwnEntities(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingTeamVsOwnEntities(false);
        });
    };
    const fetchOpenTicketsCountOwnEntities = () => {
      setIsLoadingOpenTicketsOwnEntities(true);
      fetchTicketCountOrbitOwnEntities()
        .then((response) => {
          setTicketCountOwnEntities(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingOpenTicketsOwnEntities(false);
        });
    };

    Promise.all([
      fetchBusinessEntityOptions(),
      fetchDashboardSummary(),
      fetchTicketSummaryByBusinessEntity(),
      fetchOpenTicketCountByBusinessEntity(),
      fetchDashboardLastThirtyDays(),
      fetchStatisticGraphByTeam(),
      fetchSubcategoryVsCreatedGraph(),
      // fetchDashboardStatisticsTeam(),
      // fetchDashboardStatisticsDivision(),
      // fetchDashboardStatisticsDepartment(),
      fetchTicketCountAndAvgTimeByTeam(),
      fetchTicketCountClientVsCustomer(),
      fetchSlaStatisticsTeamWiseData(),
      fetchOpenTicketsTeamVsOwnEntities(),
      fetchOpenTicketsCountOwnEntities(),
    ]);
  }, []);

  // useEffect(() => {
  //   Promise.all([fetchStatisticGraphByTeam()]);
  // }, [printDateRangeForTeamStatisticsGraph]);

  const graph = {
    labels: lastThirtyDaysGraphData && lastThirtyDaysGraphData.map((date) => date.report_date),
    datasets: [
      {
        label: 'Open',
        data: lastThirtyDaysGraphData && lastThirtyDaysGraphData.map((date) => date.open_tickets),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Closed',
        data: lastThirtyDaysGraphData && lastThirtyDaysGraphData.map((date) => date.closed_tickets),

        borderColor: 'rgba(75, 192, 75, 1)',
        backgroundColor: 'rgba(75, 192, 75, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Created',
        data: lastThirtyDaysGraphData && lastThirtyDaysGraphData.map((date) => date.create_tickets),

        borderColor: 'rgba(0, 123, 255, 1)', // Blue border color
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
      },
    ],
  };
  const teamGraph = {
    labels: statisticsTeamGraphData && statisticsTeamGraphData.map((date) => date.date),
    datasets: [
      {
        label: 'Open',
        data:
          statisticsTeamGraphData &&
          statisticsTeamGraphData.map((date) => parseInt(date.open_ticket)),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        fill: false,
        tension: 0.3,
      },
      {
        label: 'Closed',
        data:
          statisticsTeamGraphData &&
          statisticsTeamGraphData.map((date) => parseInt(date.close_ticket)),

        borderColor: 'rgba(75, 192, 75, 1)',
        backgroundColor: 'rgba(75, 192, 75, 0.2)',
        borderWidth: 2,
        fill: false,
        tension: 0.3,
      },
      {
        label: 'Created',
        data:
          statisticsTeamGraphData &&
          statisticsTeamGraphData.map((date) => parseInt(date.total_created_tickets)),

        borderColor: 'rgba(0, 123, 255, 1)', // Blue border color
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderWidth: 2,
        fill: false,
        tension: 0.3,
      },
      {
        label: 'Escalated Out',
        data:
          statisticsTeamGraphData &&
          statisticsTeamGraphData.map((date) => parseInt(date.ticket_forwarded)),

        borderColor: 'rgba(255, 159, 64, 1)', // Orange border color
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderWidth: 2,
        fill: false,
        tension: 0.3,
      },
      {
        label: 'Escalated In',
        data:
          statisticsTeamGraphData &&
          statisticsTeamGraphData.map((date) => parseInt(date.escalated_in)),

        borderColor: 'rgba(211, 12, 211, 0.86)',
        backgroundColor: 'rgba(55, 208, 239, 0.2)',
        borderWidth: 2,
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const generatePastelColors = (count) => {
    return Array.from({ length: count }, () => {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 70%, 60%)`;
    });
  };

  const doughnutData = {
    labels: opentTicketbusinessEntityWiseSummaryData?.map(
      (entity) => entity.customized_company_name
    ),
    datasets: [
      {
        label: 'Open',
        data: opentTicketbusinessEntityWiseSummaryData?.map((entity) => entity.open_ount),

        // backgroundColor: [
        //   "#66C2A5",
        //   "#FC8D62",
        //   "#8DA0CB",
        //   "#A6D854",
        //   "#E78AC3",
        //   "#FFD92F",
        // ],

        // borderColor: [
        //   "#66C2A5",
        //   "#FC8D62",
        //   "#8DA0CB",
        //   "#A6D854",
        //   "#E78AC3",
        //   "#FFD92F",
        // ],

        // backgroundColor: [
        //   "#66C2A5",
        //   "#FC8D62",
        //   "#8DA0CB",
        //   "#A6D854",
        //   "#E78AC3",
        //   "#FFD92F",
        //   "#1B9E77",
        //   "#D95F02",
        //   "#7570B3",
        //   "#E6AB02",
        // ],

        // borderColor: [
        //   "#66C2A5",
        //   "#FC8D62",
        //   "#8DA0CB",
        //   "#A6D854",
        //   "#E78AC3",
        //   "#FFD92F",
        //   "#1B9E77",
        //   "#D95F02",
        //   "#7570B3",
        //   "#E6AB02",
        // ],

        backgroundColor: opentTicketbusinessEntityWiseSummaryData?.map((_, index) => {
          const colors = [
            '#66C2A5',
            '#FC8D62',
            '#8DA0CB',
            '#A6D854',
            '#E78AC3',
            '#FFD92F',
            '#1B9E77',
            '#D95F02',
            '#7570B3',
            '#E6AB02',
          ];
          return colors[index % colors.length];
        }),
        borderColor: opentTicketbusinessEntityWiseSummaryData?.map((_, index) => {
          const colors = [
            '#66C2A5',
            '#FC8D62',
            '#8DA0CB',
            '#A6D854',
            '#E78AC3',
            '#FFD92F',
            '#1B9E77',
            '#D95F02',
            '#7570B3',
            '#E6AB02',
          ];
          return colors[index % colors.length];
        }),
        borderWidth: 1,
        hoverLabels: opentTicketbusinessEntityWiseSummaryData?.map(
          (entity) => entity.company_name // Add additional column for hover
        ),
      },
    ],
  };
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const orbitOwnEntitiesDoughnutData = {
    labels: ticketCountOwnEntities?.map((entity) => entity.client_name),
    datasets: [
      {
        label: 'Open',
        data: ticketCountOwnEntities?.map((entity) => entity.Open_Count),
        backgroundColor: ticketCountOwnEntities?.map(() => getRandomColor()),
        borderColor: ticketCountOwnEntities?.map(() => getRandomColor()),
        borderWidth: 0,
        hoverLabels: ticketCountOwnEntities?.map((entity) => entity.client_name),
      },
    ],
  };

  const doughnutSlaSuccessData = {
    labels: slaStatisticsTicketCount?.map((entity) => entity.team_name),
    datasets: [
      {
        label: 'SLA Success',
        data: slaStatisticsTicketCount?.map((entity) => entity.fr_response_success),

        backgroundColor: generatePastelColors(slaStatisticsTicketCount?.length || 0),
        borderColor: generatePastelColors(slaStatisticsTicketCount?.length || 0),
        borderWidth: 0,
        hoverLabels: slaStatisticsTicketCount?.map((entity) => entity.team_name),
      },
    ],
  };
  const doughnutSlaFrViolatedData = {
    labels: slaStatisticsTicketCount?.map((entity) => entity.team_name),
    datasets: [
      {
        label: 'Open',
        data: slaStatisticsTicketCount?.map((entity) => entity.fr_response_violated),
        backgroundColor: generatePastelColors(slaStatisticsTicketCount?.length || 0),
        borderColor: generatePastelColors(slaStatisticsTicketCount?.length || 0),
        borderWidth: 0,
        hoverLabels: slaStatisticsTicketCount?.map((entity) => entity.team_name),
      },
    ],
  };

  const doughnutSlaSrViolatedData = {
    labels: slaStatisticsTicketCount?.map((entity) => entity.team_name),
    datasets: [
      {
        label: 'Open',
        data: slaStatisticsTicketCount?.map((entity) => entity.srv_time_violated),
        backgroundColor: generatePastelColors(slaStatisticsTicketCount?.length || 0),
        borderColor: generatePastelColors(slaStatisticsTicketCount?.length || 0),
        borderWidth: 0,
        hoverLabels: slaStatisticsTicketCount?.map((entity) => entity.team_name),
      },
    ],
  };
  const barChartData = {
    labels: ticketbusinessEntityWiseSummaryData?.dayWise?.map((date) => date.ticket_created_date),
    datasets: [
      {
        label: 'Created : ' + ticketbusinessEntityWiseSummaryData?.total_count?.[0]?.created_count,
        data: ticketbusinessEntityWiseSummaryData?.dayWise?.map((date) => date.created_count),
        backgroundColor: '#5C809C',
      },
      {
        label: 'Closed : ' + ticketbusinessEntityWiseSummaryData?.total_count?.[0]?.close_count,
        data: ticketbusinessEntityWiseSummaryData?.dayWise?.map((date) => date.close_count),
        backgroundColor: '#ABD7D5',
      },
    ],
  };

  const clientVsCustomerBarChartData = {
    labels: ticketCountClientVsCustomer?.dayWise?.map((date) => date.ticket_created_date),
    datasets: [
      {
        label: 'Agent : ' + +ticketCountClientVsCustomer?.count?.[0]?.agent_tickets,
        data: ticketCountClientVsCustomer?.dayWise?.map((date) => date.Agent),
        backgroundColor: '#5C809C',
      },
      {
        label: 'Client : ' + ticketCountClientVsCustomer?.count?.[0]?.client_tickets,
        data: ticketCountClientVsCustomer?.dayWise?.map((date) => date.Client),
        backgroundColor: '#a6d854',
      },
      {
        label: 'Customer : ' + ticketCountClientVsCustomer?.count?.[0]?.customer_tickets,
        data: ticketCountClientVsCustomer?.dayWise?.map((date) => date.Customer),
        backgroundColor: '#ABD7D5',
      },
    ],
  };
  const subcategoryVSCreatedBarChartData = {
    labels: subcategoryVsCreatedGraphData?.map((date) => date.sub_category_in_english),
    datasets: [
      {
        label: 'Created',
        data: subcategoryVsCreatedGraphData?.map((date) => date.ticket_count),
        backgroundColor: '#5C809C',
      },
    ],
  };

  const individualSectionLoader = {
    isOpen: isLoadingSummary,
    isClose: isLoadingSummary,
    isLastThirtyDays: isLoadingLastThirtyDays,
    isCreatedVsclosed: isLoadingCreatedVsClosedTickets,
    isOpenTickets: isLoadingOpenTickets,
    isSpecificTeam: isLoadingSpecificTeamTickets,
    isSubcategoryVsCreated: isLoadingSubcategoryVsCreatedTickets,
    isStatisticsAllEntities: isLoadingStatisticsAllEntities,
    isCreatedofClientVsCustomer: isLoadingTicketCountClientVsCustomer,
    isSLAstatistics: isLoadingSLAstatisticsTeamWise,
    isOpenTicketsOwn: isLoadingOpenTicketsOwnEntities,
    isOpenTicketsTeamVsOwn: isLoadingTeamVsOwnEntities,
  };

  const frResponseSuccessCount = slaStatisticsTicketCount?.reduce(
    (total, entity) => total + (entity.fr_response_success || 0),
    0
  );
  const frResponseViolatedCount = slaStatisticsTicketCount?.reduce(
    (total, entity) => total + (entity.fr_response_violated || 0),
    0
  );
  const serviceTimeViolatedCount = slaStatisticsTicketCount?.reduce(
    (total, entity) => total + (entity.srv_time_violated || 0),
    0
  );

  // console.log(ticketCountOwnEntities);
  // console.log(ticketCountTeamVsOwnEntities);
  // console.log(ticketCountAndAvgTimeByTeamData);

  return (
    <div className="container-fluid">
      {hasPermission('Default_Entity_Wise_Open_Close') && (
        <>
          <DashboardFilter
            setSummaryData={setSummaryData}
            setLastThirtyDaysSummaryData={setLastThirtyDaysSummaryData}
            setLastThirtyDaysGraphData={setLastThirtyDaysGraphData}
            setPrintDateRange={setPrintDateRange}
          />

          <div className="row d-flex justify-content-center">
            {hasPermission('Open') && (
              <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-3 mb-sm-0">
                {individualSectionLoader['isOpen'] ? (
                  <DivLoader />
                ) : (
                  <div className="ticket-box">
                    <h6>Open</h6>
                    <h2>{summaryData?.open_tickets || '0'}</h2>
                  </div>
                )}
              </div>
            )}

            {hasPermission('Closed') && (
              <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-3 mb-sm-0">
                {individualSectionLoader['isClose'] ? (
                  <DivLoader />
                ) : (
                  <div className="ticket-box">
                    <h6>Closed</h6>
                    <h2>{summaryData?.closed_tickets || '0'}</h2>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {hasPermission('Created_Vs_Closed') && (
        <div className="row my-3">
          <div className="col-sm-12 col-md-8 col-lg-8 col-xl-8">
            {individualSectionLoader['isCreatedofClientVsCustomer'] ? (
              <DivLoader />
            ) : (
              <div className="todays-trand-box">
                <div className="d-flex justify-content-between">
                  <h6>
                    Created (Agent, Partner, Customer){' '}
                    <span style={{ color: '#00bcd4' }}>
                      [ {displayClientVsCustomerBusinessEntityName} ]
                    </span>
                  </h6>
                  <div className="d-flex align-items-center">
                    <h6>{printDateRangeForClientVsCustomer}</h6>
                    <button
                      type="button"
                      onClick={() =>
                        openOffcanvas({
                          title: 'Filter',
                          subtitle: 'Customize your filters',
                          icon: <Filter className="me-2" size={18} />,
                          content: (
                            <ClientVsCustomerFilterComponent
                              closeOffcanvas={closeOffcanvas}
                              setIsLoadingTicketCountClientVsCustomer={
                                setIsLoadingTicketCountClientVsCustomer
                              }
                              setTicketCountClientVsCustomer={setTicketCountClientVsCustomer}
                              setPrintDateRangeForClientVsCustomer={
                                setPrintDateRangeForClientVsCustomer
                              }
                              setDisplayClientVsCustomerBusinessEntityName={
                                setDisplayClientVsCustomerBusinessEntityName
                              }
                            />
                          ),
                        })
                      }
                      className="btn bg-transparent"
                    >
                      <Settings size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ height: '300px', width: '100%' }}>
                  <Bar options={barChartOptions} data={clientVsCustomerBarChartData} />
                </div>
              </div>
            )}
          </div>
          <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4">
            {individualSectionLoader['isOpenTickets'] ? (
              <DivLoader />
            ) : (
              <div className="todays-trand-box h-100">
                <h6>Open Tickets</h6>
                <div className="doughnut">
                  <div style={{ width: '100%', height: '270px' }}>
                    <Doughnut options={doughnutChartOptions} data={doughnutData} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {hasPermission('Created_Vs_Closed') && (
        <div className="row">
          <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4">
            {individualSectionLoader['isLoadingOpenTicketsOwnEntities'] ? (
              <DivLoader />
            ) : (
              <div className="todays-trand-box h-100">
                <h6>
                  Open Tickets <span style={{ color: '#00bcd4' }}>[ Orbit Own Entities ]</span>
                </h6>
                <div className="doughnut">
                  <div style={{ width: '100%', height: '270px' }}>
                    <Doughnut
                      options={orbitOwnDoughnutChartOptions}
                      data={orbitOwnEntitiesDoughnutData}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="col-sm-12 col-md-8 col-lg-8 col-xl-8">
            {individualSectionLoader['isCreatedVsclosed'] ? (
              <DivLoader />
            ) : (
              <div className="todays-trand-box">
                <div className="d-flex justify-content-between">
                  <h6>
                    Created Vs Closed{' '}
                    <span style={{ color: '#00bcd4' }}>[ {displayBusinessEntityName} ]</span>
                  </h6>
                  <div className="d-flex align-items-center">
                    <h6>{printDateRangeForCreatedVsClosed}</h6>
                    <button
                      type="button"
                      onClick={() =>
                        openOffcanvas({
                          title: 'Filter',
                          subtitle: 'Customize your filters',
                          icon: <Filter className="me-2" size={18} />,
                          content: (
                            <BusinessEntityStatisticsBarChartFilterComponent
                              closeOffcanvas={closeOffcanvas}
                              setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                              setTicketbusinessEntityWiseSummaryData={
                                setTicketbusinessEntityWiseSummaryData
                              }
                              // setPrintDateRangeForTeamStatisticsGraph={
                              //   setPrintDateRangeForTeamStatisticsGraph
                              // }
                              setPrintDateRangeForCreatedVsClosed={
                                setPrintDateRangeForCreatedVsClosed
                              }
                              setDisplayBusinessEntityName={setDisplayBusinessEntityName}
                            />
                          ),
                        })
                      }
                      className="btn bg-transparent"
                    >
                      <Settings size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ height: '300px', width: '100%' }}>
                  <Bar options={barChartOptions} data={barChartData} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {hasPermission('Last_Thirty_Days') && (
        <div className="row my-3">
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            {individualSectionLoader['isLastThirtyDays'] ? (
              <DivLoader />
            ) : (
              <div className="todays-trand-box">
                <div className="row d-flex align-items-center h-auto">
                  <div className="col-sm-12 col-md-8 col-lg-8 col-xl-8">
                    <h6>Last 30 days</h6>
                    <div className="todays-trand">
                      <Line options={lineChartOptions} data={graph} />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div className="row">
                      <div className="col-sm-12 col-md-6 col-lg-6 col-lg-6">
                        <div className="todays-trand-summary-box">
                          <h6>Open</h6>
                          <h2 style={{ color: '#ff6384' }}>
                            {lastThirtyDaysSummaryData?.ticket_open_by_team || '0'}
                          </h2>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6 col-lg-6">
                        <div className="todays-trand-summary-box">
                          <h6>Closed</h6>
                          <h2 style={{ color: '#4bc04b' }}>
                            {lastThirtyDaysSummaryData?.ticket_closed_by_team || '0'}
                          </h2>
                        </div>
                      </div>
                      {/* <div className='col-sm-12 col-md-6 col-lg-6 col-lg-6'>
                      <div className='todays-trand-summary-box'>
                        <h6>Avg First Response Time</h6>
                        <h2>
                          {lastThirtyDaysSummaryData?.average_time || "N/A"}
                        </h2>
                      </div>
                    </div> */}
                      {/* <div className='col-sm-12 col-md-6 col-lg-6 col-lg-6'>
                      <div className='todays-trand-summary-box'>
                        <h6>Avg Service Response Time</h6>
                        <h2>
                          {lastThirtyDaysSummaryData?.average_srv_time || "N/A"}
                        </h2>
                      </div>
                    </div> */}

                      <div className="col-sm-12 col-md-6 col-lg-6 col-lg-6">
                        <div className="todays-trand-summary-box">
                          <h6>Created</h6>
                          <h2 style={{ color: '#007bff' }}>
                            {lastThirtyDaysSummaryData?.ticket_create_by_team || '0'}
                          </h2>
                        </div>
                      </div>

                      {/* <div className='col-sm-12 col-md-6 col-lg-6 col-lg-6'>
                      <div className='todays-trand-summary-box'>
                        <h6>Escalated_In</h6>
                        <h2 style={{ color: "red" }}>
                          {lastThirtyDaysSummaryData?.escalated_in ||
                            "0"}
                        </h2>
                      </div>
                    </div> */}

                      {hasPermission('SLA Success') && (
                        <div className="col-sm-12 col-md-6 col-lg-6 col-lg-6">
                          <div className="todays-trand-summary-box">
                            <h6>
                              SLA
                              <small className="text-success">{' (success)'}</small>
                            </h6>
                            <h2>{lastThirtyDaysSummaryData?.sla_success || '0'}</h2>
                          </div>
                        </div>
                      )}
                      {hasPermission('SLA Success') && (
                        <div className="col-sm-12 col-md-6 col-lg-6 col-lg-6">
                          <div className="todays-trand-summary-box">
                            <h6>
                              SLA F.Response <small className="text-danger">{'(violated)'}</small>
                            </h6>
                            <h2>{lastThirtyDaysSummaryData?.fr_violated_sla || '0'}</h2>
                          </div>
                        </div>
                      )}
                      {hasPermission('SLA Success') && (
                        <div className="col-sm-12 col-md-6 col-lg-6 col-lg-6">
                          <div className="todays-trand-summary-box">
                            <h6>
                              SLA Resolved <small className="text-danger">{'(violated)'}</small>
                            </h6>
                            <h2>{lastThirtyDaysSummaryData?.srv_violated_sla || '0'}</h2>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {hasPermission('Created_Vs_Closed') && (
        <div className="row my-3">
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            {individualSectionLoader['isSLAstatistics'] ? (
              <DivLoader />
            ) : (
              <div className="todays-trand-box h-100">
                <div className="d-flex justify-content-between">
                  <h6>
                    SLA Statistics
                    <span style={{ color: '#00bcd4' }}> [ {' Team All '} ]</span>
                  </h6>
                  <div className="d-flex align-items-center">
                    <h6>{printDateRange}</h6>
                  </div>
                </div>
                <div className="doughnut" style={{ height: '270px' }}>
                  <div className="text-center" style={{ width: '100%', height: '195px' }}>
                    <h6 className="mb-2">SLA Success : {frResponseSuccessCount}</h6>
                    <Doughnut
                      options={doughnutSlaSuccessChartOptions}
                      data={doughnutSlaSuccessData}
                    />
                  </div>
                  <div className="text-center" style={{ width: '100%', height: '195px' }}>
                    <h6 className="mb-2">
                      SLA Violated{'(First Response)'} : {frResponseViolatedCount}
                    </h6>
                    <Doughnut
                      options={doughnutSlaFrViolatedChartOptions}
                      data={doughnutSlaFrViolatedData}
                    />
                  </div>
                  <div className="text-center" style={{ width: '100%', height: '195px' }}>
                    <h6 className="mb-2">
                      SLA Violated {'(Resolved Time)'} : {serviceTimeViolatedCount}
                    </h6>
                    <Doughnut
                      options={doughnutSlaSrViolatedChartOptions}
                      data={doughnutSlaSrViolatedData}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {hasPermission('Statistics_of_Team') && (
        <div className="row my-3">
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            {individualSectionLoader['isSpecificTeam'] ? (
              <DivLoader />
            ) : (
              <div className="todays-trand-box">
                <div className="row d-flex align-items-center h-auto">
                  <div className="d-flex justify-content-between">
                    <h6>
                      Statistics of Team{' '}
                      <span style={{ color: '#00bcd4' }}>[ {displayTeamName} ]</span>
                    </h6>
                    <div className="d-flex align-items-center">
                      <h6>{printDateRangeForTeamStatisticsGraph}</h6>
                      <button
                        type="button"
                        onClick={() =>
                          openOffcanvas({
                            title: 'Filter',
                            subtitle: 'Customize your filters',
                            icon: <Filter className="me-2" size={18} />,
                            content: (
                              <TeamStatisticGraphFilterComponent
                                closeOffcanvas={closeOffcanvas}
                                setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                setStatisticsTeamSummaryData={setStatisticsTeamSummaryData}
                                setStatisticsTeamGraphData={setStatisticsTeamGraphData}
                                setPrintDateRangeForTeamStatisticsGraph={
                                  setPrintDateRangeForTeamStatisticsGraph
                                }
                                setDisplayTeamName={setDisplayTeamName}
                              />
                            ),
                          })
                        }
                        className="btn bg-transparent"
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-8 col-lg-8 col-xl-8">
                    <div className="todays-trand" style={{ height: '300px', width: '100%' }}>
                      <Line options={lineChartOptions} data={teamGraph} />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mt-3">
                    <div className="row">
                      <div className="col-sm-12 col-md-6 col-lg-6 col-lg-6">
                        <div
                          onClick={() =>
                            openOffcanvas({
                              title: 'Open Ticket Details',
                              subtitle: '',
                              icon: <Filter className="me-2" size={18} />,
                              width: '90%',
                              content: (
                                <DashboardTicketCountDetailsComponent
                                  closeOffcanvas={closeOffcanvas}
                                  setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                  data={{
                                    ...ticketCountDetailsParam,
                                    teamId: statisticsTeamSummaryData?.team_id,
                                    isOpen: true,
                                  }}
                                />
                              ),
                            })
                          }
                          className="todays-trand-summary-box cursor-pointer mb-2"
                        >
                          <h6>Open</h6>
                          <h2 style={{ color: '#ff6384' }}>
                            {statisticsTeamSummaryData?.open_ticket || '0'}
                          </h2>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6 col-lg-6">
                        <div
                          onClick={() =>
                            openOffcanvas({
                              title: 'Closed Ticket Details',
                              subtitle: '',
                              icon: <Filter className="me-2" size={18} />,
                              width: '90%',
                              content: (
                                <DashboardTicketCountDetailsComponent
                                  closeOffcanvas={closeOffcanvas}
                                  setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                  data={{
                                    ...ticketCountDetailsParam,
                                    teamId: statisticsTeamSummaryData?.team_id,
                                    isClose: true,
                                  }}
                                />
                              ),
                            })
                          }
                          className="todays-trand-summary-box cursor-pointer mb-2"
                        >
                          <h6>Closed</h6>
                          <h2 style={{ color: '#4bc04b' }}>
                            {statisticsTeamSummaryData?.close_ticket || '0'}
                          </h2>
                        </div>
                      </div>

                      <div className="col-sm-12 col-md-6 col-lg-6 col-lg-6">
                        <div
                          onClick={() =>
                            openOffcanvas({
                              title: 'Created Ticket Details',
                              subtitle: '',
                              icon: <Filter className="me-2" size={18} />,
                              width: '90%',
                              content: (
                                <DashboardTicketCountDetailsComponent
                                  closeOffcanvas={closeOffcanvas}
                                  setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                  data={{
                                    ...ticketCountDetailsParam,
                                    teamId: statisticsTeamSummaryData?.team_id,
                                    isCreated: true,
                                  }}
                                />
                              ),
                            })
                          }
                          className="todays-trand-summary-box cursor-pointer mb-2"
                        >
                          <h6>Created</h6>
                          <h2 style={{ color: '#007bff' }}>
                            {statisticsTeamSummaryData?.total_created_tickets || '0'}
                          </h2>
                        </div>
                      </div>

                      {hasPermission('SLA Success') && (
                        <div className="col-sm-12 col-md-6 col-lg-6 col-lg-6">
                          <div
                            onClick={() =>
                              openOffcanvas({
                                title: 'Escalated Out Ticket Details',
                                subtitle: '',
                                icon: <Filter className="me-2" size={18} />,
                                width: '90%',
                                content: (
                                  <DashboardTicketCountDetailsComponent
                                    closeOffcanvas={closeOffcanvas}
                                    setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                    data={{
                                      ...ticketCountDetailsParam,
                                      teamId: statisticsTeamSummaryData?.team_id,
                                      isEscaletedOut: true,
                                    }}
                                  />
                                ),
                              })
                            }
                            className="todays-trand-summary-box cursor-pointer mb-2"
                          >
                            <h6>Escalated Out</h6>
                            <h2 style={{ color: '#ff9f40' }}>
                              {statisticsTeamSummaryData?.ticket_forwarded || '0'}
                            </h2>
                          </div>
                        </div>
                      )}

                      {hasPermission('SLA Success') && (
                        <div className="col-sm-12 col-md-6 col-lg-6 col-lg-6">
                          <div
                            onClick={() =>
                              openOffcanvas({
                                title: 'Escalated In Ticket Details',
                                subtitle: '',
                                icon: <Filter className="me-2" size={18} />,
                                width: '90%',
                                content: (
                                  <DashboardTicketCountDetailsComponent
                                    closeOffcanvas={closeOffcanvas}
                                    setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                    data={{
                                      ...ticketCountDetailsParam,
                                      teamId: statisticsTeamSummaryData?.team_id,
                                      isEscaletedIn: true,
                                    }}
                                  />
                                ),
                              })
                            }
                            className="todays-trand-summary-box cursor-pointer mb-2"
                          >
                            <h6>Escalated In</h6>
                            <h2 style={{ color: '#e911d1' }}>
                              {statisticsTeamSummaryData?.escalated_in || '0'}
                            </h2>
                          </div>
                        </div>
                      )}
                      {hasPermission('SLA Success') && (
                        <div className="col-sm-12 col-md-6 col-lg-6 col-lg-6">
                          <div
                            onClick={() =>
                              openOffcanvas({
                                title: 'First Response Violated Ticket Details',
                                subtitle: '',
                                icon: <Filter className="me-2" size={18} />,
                                width: '90%',
                                content: (
                                  <DashboardTicketCountDetailsComponent
                                    closeOffcanvas={closeOffcanvas}
                                    setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                    data={{
                                      ...ticketCountDetailsParam,
                                      teamId: statisticsTeamSummaryData?.team_id,
                                      isFrViolated: true,
                                    }}
                                  />
                                ),
                              })
                            }
                            className="todays-trand-summary-box cursor-pointer mb-2"
                          >
                            <h6>
                              SLA F.Response <small className="text-danger">{'(violated)'}</small>
                            </h6>
                            <h2>{statisticsTeamSummaryData?.fr_violated_sla || '0'}</h2>
                          </div>
                        </div>
                      )}
                      {hasPermission('SLA Success') && (
                        <div className="col-sm-12 col-md-6 col-lg-6 col-lg-6">
                          <div
                            onClick={() =>
                              openOffcanvas({
                                title: 'Service Time Violated Ticket Details',
                                subtitle: '',
                                icon: <Filter className="me-2" size={18} />,
                                width: '90%',
                                content: (
                                  <DashboardTicketCountDetailsComponent
                                    closeOffcanvas={closeOffcanvas}
                                    setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                    data={{
                                      ...ticketCountDetailsParam,
                                      teamId: statisticsTeamSummaryData?.team_id,
                                      isSrViolated: true,
                                    }}
                                  />
                                ),
                              })
                            }
                            className="todays-trand-summary-box cursor-pointer mb-2"
                          >
                            <h6>
                              SLA Resolved <small className="text-danger">{'(violated)'}</small>
                            </h6>
                            <h2>{statisticsTeamSummaryData?.srv_violated_sla || '0'}</h2>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {hasPermission('Created_Vs_Closed') && (
        <div className="row my-3">
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            {individualSectionLoader['isCreatedVsclosed'] ? (
              <DivLoader />
            ) : (
              <div className="todays-trand-box">
                <div className="d-flex justify-content-between">
                  <h6>
                    Sub-category Vs Created{' '}
                    <span style={{ color: '#00bcd4' }}>
                      [ {displayNameForSubcategoryVsCreated} ]
                    </span>
                  </h6>
                  <div className="d-flex align-items-center">
                    <h6>{printDateRangeForSubcategoryVsCreated}</h6>
                    <button
                      type="button"
                      onClick={() =>
                        openOffcanvas({
                          title: 'Filter',
                          subtitle: 'Customize your filters',
                          icon: <Filter className="me-2" size={18} />,
                          content: (
                            <SubcategoriesVsCreatedBarChartFilter
                              closeOffcanvas={closeOffcanvas}
                              setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                              setSubcategoryVsCreatedGraphData={setSubcategoryVsCreatedGraphData}
                              setPrintDateRangeForSubcategoryVsCreated={
                                setPrintDateRangeForSubcategoryVsCreated
                              }
                              setDisplayNameForSubcategoryVsCreated={
                                setDisplayNameForSubcategoryVsCreated
                              }
                            />
                          ),
                        })
                      }
                      className="btn bg-transparent"
                    >
                      <Settings size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ height: '300px', width: '100%' }}>
                  <Bar options={barChartOptions} data={subcategoryVSCreatedBarChartData} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {hasPermission('Statistics_of_Business_Entities') && (
        <div className="row d-none">
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            {individualSectionLoader['isStatisticsAllEntities'] ? (
              <DivLoader />
            ) : (
              <div className="overdue-ticket">
                <div className="d-flex justify-content-between">
                  <h6 className="header-title">Statistics of All Entities</h6>

                  <div className="d-flex align-items-center">
                    <h6 className="header-title">{printDateRange}</h6>
                    <button
                      type="button"
                      onClick={() =>
                        openOffcanvas({
                          title: 'Filter',
                          subtitle: 'Customize your filters',
                          icon: <Filter className="me-2" size={18} />,
                          content: (
                            <DepartmentDivisionTeamFilterByDateComponent
                              closeOffcanvas={closeOffcanvas}
                              setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                              setTeamData={setTeamData}
                              setDivisionData={setDivisionData}
                              setDepartmentData={setDepartmentData}
                              setPrintDateRange={setPrintDateRange}
                            />
                          ),
                        })
                      }
                      className="btn bg-transparent"
                    >
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
                <div className="body">
                  <ul className="nav nav-tabs" id="myTab" role="tablist">
                    {hasPermission('Statistics_Department') && (
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="home-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#department-tab-pane"
                          type="button"
                          role="tab"
                          aria-controls="home-tab-pane"
                          aria-selected="true"
                        >
                          Department
                        </button>
                      </li>
                    )}
                    {hasPermission('Statistics_Division') && (
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="profile-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#division-tab-pane"
                          type="button"
                          role="tab"
                          aria-controls="profile-tab-pane"
                          aria-selected="false"
                        >
                          Division
                        </button>
                      </li>
                    )}
                    {hasPermission('Statistics_Team') && (
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          id="profile-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#team-tab-pane"
                          type="button"
                          role="tab"
                          aria-controls="profile-tab-pane"
                          aria-selected="false"
                        >
                          Team
                        </button>
                      </li>
                    )}
                  </ul>
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade"
                      id="department-tab-pane"
                      role="tabpanel"
                      aria-labelledby="home-tab"
                      tabIndex="0"
                    >
                      <div className="table-responsive">
                        <table className="table table-bordered mt-4">
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
                            {departmentData &&
                              departmentData.map((item, index) => (
                                <tr key={index}>
                                  <th className="left-item">{item.department_name}</th>
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
                    <div
                      className="tab-pane fade"
                      id="division-tab-pane"
                      role="tabpanel"
                      aria-labelledby="profile-tab"
                      tabIndex="0"
                    >
                      <div className="table-responsive">
                        <table className="table table-bordered mt-4">
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
                            {divisionData &&
                              divisionData.map((item, index) => (
                                <tr key={index}>
                                  <th className="left-item">{item.division_name}</th>
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
                    <div
                      className="tab-pane fade show active"
                      id="team-tab-pane"
                      role="tabpanel"
                      aria-labelledby="profile-tab"
                      tabIndex="0"
                    >
                      <div className="table-responsive">
                        <table className="table table-bordered mt-4">
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
                            {teamData &&
                              teamData.map((item, index) => (
                                <tr key={index}>
                                  <th className="left-item">{item.team_name}</th>
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
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {hasPermission('can_view_team_vs_business_entity') && (
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            {isLoadingTicketCountAndAvgTimeTeam ? (
              <DivLoader />
            ) : (
              <div className="overdue-ticket">
                <div className="d-flex justify-content-between mb-3">
                  <h6>
                    Team Vs Business Entity <span style={{ color: '#00bcd4' }}>[ {'Open'} ]</span>
                  </h6>

                  <button
                    className="custom-btn"
                    type="button"
                    disabled={ticketCountAndAvgTimeByTeamData.length == 0 ? true : false}
                    onClick={() => ExportToExcel(ticketCountAndAvgTimeByTeamData)}
                  >
                    <i className="bi bi-file-earmark-excel-fill me-1"></i>
                    {'Export'}
                  </button>
                </div>

                <div className="table-responsive" style={{ height: '350px', overflowY: 'scroll' }}>
                  <table className="table table-bordered">
                    <thead style={{ position: 'sticky', top: '0' }}>
                      <tr>
                        <th>Team</th>
                        <th>Orbit Partner</th>
                        <th>Race Partner</th>
                        <th>Race</th>
                        <th>Earth</th>
                        <th>Dhaka Colo</th>
                        <th>Network & Backbone</th>
                        <th>Orbit Own</th>
                        <th>Internal Operation</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ticketCountAndAvgTimeByTeamData &&
                        ticketCountAndAvgTimeByTeamData.map((item, index) => (
                          <tr key={index}>
                            <th className="left-item">{item.team_name}</th>
                            <td
                              onClick={() =>
                                openOffcanvas({
                                  title: 'Ticket Details',
                                  subtitle: '',
                                  icon: <Filter className="me-2" size={18} />,
                                  width: '90%',
                                  content: (
                                    <DashboardBusinessEntityWiseTicketCountDetails
                                      closeOffcanvas={closeOffcanvas}
                                      setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                      data={{
                                        ...ticketCountDetailsParam,
                                        businessEntityId: 8,
                                        teamId: item.team_id
                                      }}
                                    />
                                  ),
                                })
                              }
                              style={{ height: '55px' }}
                              className=" cursor-pointer"
                            >
                              <div className="d-flex justify-content-center align-items-center">
                              {item.orbit_partner_open == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.orbit_partner_open}</p>
                                  <p>{item.avg_time_orbit_partner}</p>
                                </div>
                              )}
                              </div>
                            </td>


                            <td
                              onClick={() =>
                                openOffcanvas({
                                  title: 'Ticket Details',
                                  subtitle: '',
                                  icon: <Filter className="me-2" size={18} />,
                                  width: '90%',
                                  content: (
                                    <DashboardBusinessEntityWiseTicketCountDetails
                                      closeOffcanvas={closeOffcanvas}
                                      setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                      data={{
                                        ...ticketCountDetailsParam,
                                        businessEntityId: 11,
                                        teamId: item.team_id
                                      }}
                                    />
                                  ),
                                })
                              }
                              style={{ height: '55px' }}
                              className=" cursor-pointer"
                            >
                              <div className="d-flex justify-content-center align-items-center">
                              {item.orbit_partner_open == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.race_partner_open}</p>
                                  <p>{item.avg_time_race_partner}</p>
                                </div>
                              )}
                              </div>
                            </td>

                            <td
                              onClick={() =>
                                openOffcanvas({
                                  title: 'Ticket Details',
                                  subtitle: '',
                                  icon: <Filter className="me-2" size={18} />,
                                  width: '90%',
                                  content: (
                                    <DashboardBusinessEntityWiseTicketCountDetails
                                      closeOffcanvas={closeOffcanvas}
                                      setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                      data={{
                                        ...ticketCountDetailsParam,
                                        businessEntityId: 5,
                                        teamId: item.team_id
                                      }}
                                    />
                                  ),
                                })
                              }
                              style={{ height: '55px' }}
                              className="cursor-pointer"
                            >
                              <div className="d-flex justify-content-center align-items-center ">
                              {item.race_online_open == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.race_online_open}</p>
                                  <p>{item.avg_time_race_online}</p>
                                </div>
                              )}
                              </div>
                            </td>

                            <td
                              onClick={() =>
                                openOffcanvas({
                                  title: 'Ticket Details',
                                  subtitle: '',
                                  icon: <Filter className="me-2" size={18} />,
                                  width: '90%',
                                  content: (
                                    <DashboardBusinessEntityWiseTicketCountDetails
                                      closeOffcanvas={closeOffcanvas}
                                      setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                      data={{
                                        ...ticketCountDetailsParam,
                                        businessEntityId: 6,
                                        teamId: item.team_id
                                      }}
                                    />
                                  ),
                                })
                              }
                              style={{ height: '55px' }}
                              className=" cursor-pointer"
                            >
                              <div className="d-flex justify-content-center align-items-center">
                              {item.earth_open == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.earth_open}</p>
                                  <p>{item.avg_time_earth}</p>
                                </div>
                              )}
                              </div>
                            </td>
                            <td
                              onClick={() =>
                                openOffcanvas({
                                  title: 'Ticket Details',
                                  subtitle: '',
                                  icon: <Filter className="me-2" size={18} />,
                                  width: '90%',
                                  content: (
                                    <DashboardBusinessEntityWiseTicketCountDetails
                                      closeOffcanvas={closeOffcanvas}
                                      setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                      data={{
                                        ...ticketCountDetailsParam,
                                        businessEntityId: 4,
                                        teamId: item.team_id
                                      }}
                                    />
                                  ),
                                })
                              }
                              style={{ height: '55px' }}
                              className=" cursor-pointer"
                            >
                              <div className="d-flex justify-content-center align-items-center">
                              {item.dhakacolo_open == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.dhakacolo_open}</p>
                                  <p>{item.avg_time_dhaka_colo}</p>
                                </div>
                              )}
                              </div>
                            </td>

                            <td
                              onClick={() =>
                                openOffcanvas({
                                  title: 'Ticket Details',
                                  subtitle: '',
                                  icon: <Filter className="me-2" size={18} />,
                                  width: '90%',
                                  content: (
                                    <DashboardBusinessEntityWiseTicketCountDetails
                                      closeOffcanvas={closeOffcanvas}
                                      setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                      data={{
                                        ...ticketCountDetailsParam,
                                        businessEntityId: 7,
                                        teamId: item.team_id
                                      }}
                                    />
                                  ),
                                })
                              }
                              style={{ height: '55px' }}
                              className="cursor-pointer"
                            >
                              <div className="d-flex justify-content-center align-items-center ">
                              {item.network_backbone_open == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.network_backbone_open}</p>
                                  <p>{item.avg_time_network_backbone}</p>
                                </div>
                              )}
                              </div>
                            </td>
                            <td
                              onClick={() =>
                                openOffcanvas({
                                  title: 'Ticket Details',
                                  subtitle: '',
                                  icon: <Filter className="me-2" size={18} />,
                                  width: '90%',
                                  content: (
                                    <DashboardBusinessEntityWiseTicketCountDetails
                                      closeOffcanvas={closeOffcanvas}
                                      setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                      data={{
                                        ...ticketCountDetailsParam,
                                        businessEntityId: 9,
                                        teamId: item.team_id
                                      }}
                                    />
                                  ),
                                })
                              }
                              style={{ height:'55px' }}
                              className=" cursor-pointer"
                            >
                              <div className="d-flex justify-content-center align-items-center">
                              {item.orbit_own_open == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.orbit_own_open}</p>
                                  <p>{item.avg_time_orbit_own}</p>
                                </div>
                              )}
                              </div>
                            </td>

                            <td
                              onClick={() =>
                                openOffcanvas({
                                  title: 'Ticket Details',
                                  subtitle: '',
                                  icon: <Filter className="me-2" size={18} />,
                                  width: '90%',
                                  content: (
                                    <DashboardBusinessEntityWiseTicketCountDetails
                                      closeOffcanvas={closeOffcanvas}
                                      setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                      data={{
                                        ...ticketCountDetailsParam,
                                        businessEntityId: 10,
                                        teamId: item.team_id
                                      }}
                                    />
                                  ),
                                })
                              }
                              style={{ height: '55px' }}
                              className=" cursor-pointer"
                            >
                              <div className="d-flex justify-content-center align-items-center">
                              {item.internal_operation_open == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.internal_operation_open}</p>
                                  <p>{item.avg_time_internal_operation}</p>
                                </div>
                              )}
                              </div>
                            </td>

                            <td
                              onClick={() =>
                                openOffcanvas({
                                  title: 'Ticket Details',
                                  subtitle: '',
                                  icon: <Filter className="me-2" size={18} />,
                                  width: '90%',
                                  content: (
                                    <DashboardTeamVsBusinessEntityTicketDetailsComponent
                                      closeOffcanvas={closeOffcanvas}
                                      setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                      data={{
                                        ...ticketCountDetailsParam,
                                        teamId: item.team_id,
                                      }}
                                    />
                                  ),
                                })
                              }
                              style={{ height: '55px' }}
                              className="d-flex justify-content-center align-items-center cursor-pointer"
                            >
                              <p className="fw-bold fs-5" style={{ color: '#183247' }}>
                                {item.total_open == 0 ? '--' : item.total_open}
                              </p>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                    
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {hasPermission('can_view_team_vs_business_entity') && (
        <div className="row mt-3">
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            {individualSectionLoader['isOpenTicketsTeamVsOwn'] ? (
              <DivLoader />
            ) : (
              <div className="overdue-ticket">
                <div className="d-flex justify-content-between mb-3">
                  <h6>
                    Team Vs Own Entity <span style={{ color: '#00bcd4' }}>[ {'Open'} ]</span>
                  </h6>

                  <button
                    className="custom-btn"
                    type="button"
                    disabled={ticketCountTeamVsOwnEntities.length == 0 ? true : false}
                    onClick={() => ExportToExcel(ticketCountTeamVsOwnEntities)}
                  >
                    <i className="bi bi-file-earmark-excel-fill me-1"></i>
                    {'Export'}
                  </button>
                </div>

                <div className="table-responsive" style={{ height: '350px', overflowY: 'scroll' }}>
                  <table className="table table-bordered">
                    <thead style={{ position: 'sticky', top: '0' }}>
                      <tr>
                        <th>Team</th>
                        <th>Banani</th>
                        <th>Bashundhara</th>
                        <th>Chittagong</th>
                        {/* <th>Corporate</th> */}
                        <th>Cox`s</th>
                        <th>Dhanmondi</th>
                        <th>Khulna</th>
                        <th>Motijheel</th>
                        <th>Niketon</th>
                        <th>Race</th>
                        <th>Rajshahi</th>
                        <th>Sylhet</th>
                        <th>Uttara</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ticketCountTeamVsOwnEntities &&
                        ticketCountTeamVsOwnEntities.map((item, index) => (
                          <tr key={index}>
                            <th className="left-item" style={{ width: '174px' }}>
                              {item.team_name}
                            </th>
                            <td>
                              {item.Banani_Area_Office_Total == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.Banani_Area_Office_Total}</p>
                                  <p>{item.Avg_time_Banani_Area_Office}</p>
                                </div>
                              )}
                            </td>
                            <td>
                              {item.Bashundhara_Area_Office_Total == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">
                                    {item.Bashundhara_Area_Office_Total}
                                  </p>
                                  <p>{item.Avg_time_Bashundhara_Area_Office}</p>
                                </div>
                              )}
                            </td>

                            <td>
                              {item.Chittagong_Zonal_Office_Total == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">
                                    {item.Chittagong_Zonal_Office_Total}
                                  </p>
                                  <p>{item.Avg_time_Chittagong_Zonal_Office}</p>
                                </div>
                              )}
                            </td>
                            {/* <td>
                              {item.Corporate_User_Total == 0 ? (
                                "--"
                              ) : (
                                <div style={{ color: "#183247" }}>
                                  <p className='fw-bold fs-4'>
                                    {item.Corporate_User_Total}
                                  </p>
                                  <p>{item.Avg_time_Corporate_User}</p>
                                </div>
                              )}
                            </td> */}

                            <td>
                              {item.Coxs_Bazar_Total == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.Coxs_Bazar_Total}</p>
                                  <p>{item.Avg_time_Coxs_Bazar}</p>
                                </div>
                              )}
                            </td>
                            <td>
                              {item.Dhanmondi_Area_Office_Total == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.Dhanmondi_Area_Office_Total}</p>
                                  <p>{item.Avg_time_Dhanmondi_Area_Office}</p>
                                </div>
                              )}
                            </td>

                            <td>
                              {item.Khulna_Zonal_Office_Total == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.Khulna_Zonal_Office_Total}</p>
                                  <p>{item.Avg_time_Khulna_Zonal_Office}</p>
                                </div>
                              )}
                            </td>
                            <td>
                              {item.Motijheel_Area_Office_Total == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.Motijheel_Area_Office_Total}</p>
                                  <p>{item.Avg_time_Motijheel_Area_Office}</p>
                                </div>
                              )}
                            </td>
                            <td>
                              {item.Niketon_Area_Office_Total == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.Niketon_Area_Office_Total}</p>
                                  <p>{item.Avg_time_Niketon_Area_Office}</p>
                                </div>
                              )}
                            </td>

                            <td>
                              {item.Race_Online_Limited_Total == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.Race_Online_Limited_Total}</p>
                                  <p>{item.Avg_time_Race_Online_Limited}</p>
                                </div>
                              )}
                            </td>
                            <td>
                              {item.Rajshahi_Zonal_Office_Total == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.Rajshahi_Zonal_Office_Total}</p>
                                  <p>{item.Avg_time_Rajshahi_Zonal_Office}</p>
                                </div>
                              )}
                            </td>

                            <td>
                              {item.Sylhet_Zonal_Office_Total == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.Sylhet_Zonal_Office_Total}</p>
                                  <p>{item.Avg_time_Sylhet_Zonal_Office}</p>
                                </div>
                              )}
                            </td>
                            <td>
                              {item.Uttara_Area_Office_Total == 0 ? (
                                '--'
                              ) : (
                                <div style={{ color: '#183247' }}>
                                  <p className="fw-bold fs-4">{item.Uttara_Area_Office_Total}</p>
                                  <p>{item.Avg_time_Uttara_Area_Office}</p>
                                </div>
                              )}
                            </td>

                            <td
                              onClick={() =>
                                openOffcanvas({
                                  title: 'Ticket Details',
                                  subtitle: '',
                                  icon: <Filter className="me-2" size={18} />,
                                  width: '90%',
                                  content: (
                                    <TeamVsOrbitOwnEntityTicketDetails
                                      closeOffcanvas={closeOffcanvas}
                                      setIsLoadingContextUpdated={setIsLoadingContextUpdated}
                                      data={{
                                        ...ticketCountDetailsParam,
                                        teamId: item.id,
                                      }}
                                    />
                                  ),
                                })
                              }
                              style={{ height: '55px' }}
                              className="d-flex justify-content-center align-items-center cursor-pointer"
                            >
                              <p className="fw-bold fs-5" style={{ color: '#183247' }}>
                                {item.total_open == 0 ? '--' : item.total_open}
                              </p>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
