import { apiClient } from '../../api-config/config';


export const storeSlaSubcatConfig = async (data) => {
  try {
    const response = await apiClient.post('sla-subcat-configs', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchAllSlaSubcatConfigs = async () => {
  try {
    const response = await apiClient.get('sla-subcat-configs');
    return response.data;
  } catch (error) {
    throw error;
  }
};




// FIXED: Missing opening backtick
export const fetchSlaSubcatConfigById = async (id) => {
  try {
    const response = await apiClient.get(`sla-subcat-configs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// FIXED: Missing opening backtick and wrong syntax
export const updateSlaSubcatConfig = async (id, data) => {
  try {
    const response = await apiClient.put(`sla-subcat-configs/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteSlaSubcatConfig = async (id) => {
  try {
    const response = await apiClient.delete(`sla-subcat-configs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchSlaSubcatConfigsByBusinessEntity = async (businessEntityId) => {
  try {
    const response = await apiClient.get(`sla-subcat-configs/business-entity/${businessEntityId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchSlaSubcatConfigsByTeam = async (teamId) => {
  try {
    const response = await apiClient.get(`sla-subcat-configs/team/${teamId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch SLA Subcategory Configs by Subcategory ID
export const fetchSlaSubcatConfigsBySubcategory = async (subcategoryId) => {
  try {
    const response = await apiClient.get(`sla-subcat-configs/subcategory/${subcategoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
