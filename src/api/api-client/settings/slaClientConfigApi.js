import { apiClient } from '../../api-config/config';


export const storeSlaClientConfig = async (data) => {
  try {
    const response = await apiClient.post('sla-client-configs', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchAllSlaClientConfigs = async () => {
  try {
    const response = await apiClient.get('sla-client-configs');
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchSlaClientConfigById = async (id) => {
  try {
    const response = await apiClient.get(`sla-client-configs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateSlaClientConfig = async (id, data) => {
  try {
    const response = await apiClient.put(`sla-client-configs/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteSlaClientConfig = async (id) => {
  try {
    const response = await apiClient.delete(`sla-client-configs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
