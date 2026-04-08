import { apiClient } from "../../api-config/config";

export const store = async (data) => {
  try {
    const response = await apiClient.post("settings/company/store", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCompany = async (data) => {
  try {
    const response = await apiClient.post("settings/company/show", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchClientBusinessEntity = async (data) => {
  try {
    const response = await apiClient.post(
      "settings/company/cliententityshow",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCompanyById = async (id) => {
  try {
    const response = await apiClient.get(`settings/company/show/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const update = async (id, data) => {
  try {
    const response = await apiClient.put(`settings/company/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
