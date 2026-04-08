import { apiClient } from "../../api-config/config";

// export const fetchSubcategoryByTeam = async (id) => {
//   try {
//     const response = await apiClient.get(
//       `settings/sla/subcategorybyteam/${id}`
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const fetchSubcategoryByTeam = async (teamId, businessEntity) => {
  try {
    const response = await apiClient.get(
      `settings/sla/subcategorybyteam/${teamId}/${businessEntity}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchSubcategoryByTeamNew = async (teamId, businessEntity) => {
  try {
    const response = await apiClient.get(
      `settings/sla/subcategorybyteamnew/${teamId}/${businessEntity}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSubcategoryByBusinessEntity = async (id) => {
  try {
    const response = await apiClient.get(
      `settings/sla/subcategorybybusinessentity/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const store = async (data) => {
  try {
    const response = await apiClient.post("settings/sla/store", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSLA = async () => {
  try {
    const response = await apiClient.get("settings/sla/show");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSLAById = async (id) => {
  try {
    const response = await apiClient.get(`settings/sla/show/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSLAByTeamId = async (id) => {
  try {
    const response = await apiClient.get(`settings/sla/show/by/team/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const update = async (id, data) => {
  try {
    const response = await apiClient.put(`settings/sla/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSLABySubcategoryId = async (id) => {
  try {
    const response = await apiClient.get(
      `settings/sla/show/by/subcategoryid/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};



// export const fetchSubCategoriesByTeamId = async (teamId) => {
//   try {
//     const response = await apiClient.get(
//       `settings/sla/teams/${teamId}/sub-categories`
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };



export const fetchSubCategoriesByTeamId = async (teamId, businessEntityId) => {
  try {
    const response = await apiClient.get(
      `settings/sla/teams/${teamId}/business-entity/${businessEntityId}/sub-categories`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};




export const fetchClientsByBusinessEntityId = async (id) => {
  try {
    const response = await apiClient.get(
      `settings/sla/clients/show/by/business-entity/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

