import { apiClient } from "../api-config/config";

// export const dashboardSummary = async (data) => {
//   try {
//     const response = await apiClient.post("dashboard/summary/show", data);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const dashboardSummary = async (data) => {
  try {
    const response = await apiClient.post("dashboard/summary/show", data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

// export const dashboardLastThirtyDays = async () => {
//   try {
//     const response = await apiClient.get("dashboard/last/thirty/days");
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const dashboardLastThirtyDays = async (data) => {
  try {
    const response = await apiClient.post("dashboard/last/thirty/days", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const dashboardLastThirtyDays = async (data) => {
//   try {
//     const response = await apiClient.post("dashboard/last/thirty/days", data);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const dashboardStatisticsGraphBasedOnTeam = async (data) => {
  try {
    const response = await apiClient.post(
      "dashboard/statistics/graph/by/team",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const dashboardStatisticsBasedOnDepartment = async (data) => {
  try {
    const response = await apiClient.post(
      "dashboard/statistics/show/by/department",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const dashboardStatisticsBasedOnDivision = async (data) => {
  try {
    const response = await apiClient.post(
      "dashboard/statistics/show/by/division",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const dashboardStatisticsBasedOnTeam = async (data) => {
  try {
    const response = await apiClient.post(
      "dashboard/statistics/show/by/team",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOpenTicketCountByBusinessEntity = async () => {
  try {
    const response = await apiClient.get(
      "dashboard/all-business-entity-open-ticket"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTicketSummaryByBusinessEntity = async (data) => {
  try {
    const response = await apiClient.post(
      "dashboard/business-entity-ticket-summary",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTicketCountDetails = async (data) => {
  try {
    const response = await apiClient.post(
      "dashboard/ticket-count-details",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const dashboardSubcategoryVsCreated = async (data) => {
  try {
    const response = await apiClient.post(
      "dashboard/statistics/subcategory-vs-created/show",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTicketCountByClientCustomer = async (data) => {
  try {
    const response = await apiClient.post(
      "dashboard/ticket-customer-client-wise",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTicketCountAndAvgTimeByTeam = async () => {
  try {
    const response = await apiClient.get(
      "dashboard/ticket-count-breakdown/team-wise"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTeamVsBusinessTicketCountDetails = async (data) => {
  try {
    const response = await apiClient.post(
      "dashboard/team-vs-business-entity-ticket-count-details",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTeamVsBusinessTicketCountDetailsByBusinessEntityId = async (data) => {
  try {
    const response = await apiClient.post(
      "dashboard/team-vs-business-entity-ticket-count-details-by-business-entity-id",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSLAstatisticsTeamWise = async () => {
  try {
    const response = await apiClient.get("dashboard/sla-statistics-team-wise");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTicketCountOrbitOwnEntities = async () => {
  try {
    const response = await apiClient.get(
      `dashboard/ticket-count/entity-wise-own`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTicketCountTeamVsOrbitOwnEntities = async () => {
  try {
    const response = await apiClient.get(
      `dashboard/ticket-count-breakdown/team-wise-own`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTeamVsOrbitOwnEntityTicketCountDetails = async (data) => {
  try {
    const response = await apiClient.post(
      "dashboard/team-vs-own-business-entity-ticket-count-details",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
