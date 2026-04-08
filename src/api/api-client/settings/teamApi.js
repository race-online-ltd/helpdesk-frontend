import { apiClient } from '../../api-config/config';

export const store = async (data) => {
  try {
    const response = await apiClient.post('settings/team/store', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllTeam = async () => {
  try {
    const response = await apiClient.get('settings/team/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTeam = async () => {
  try {
    const response = await apiClient.get('settings/team/show');
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchTeamBySubCategory = async (id) => {
  try {
    const response = await apiClient.get(`settings/team/show/bysubcategory/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchTeamById = async (id) => {
  try {
    const response = await apiClient.get(`settings/team/show/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const update = async (id, data) => {
  try {
    const response = await apiClient.put(`settings/team/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTeamByDefaultBusinessEntity = async (id) => {
  try {
    const response = await apiClient.get(`settings/team/show/by/default/business/entity/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const teamAdditionalConfigStore = async (data) => {
  try {
    const response = await apiClient.post('settings/team/additional-config', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchConfigurationByTeamId = async (id) => {
  try {
    const response = await apiClient.get(`settings/team/config-show/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
