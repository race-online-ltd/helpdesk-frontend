import { apiClient } from "../../api-config/config";

export const fetchEmailAttribute = async () => {
    try {
      const response = await apiClient.get("settings/email/attribute");
      return response.data;
    } catch (error) {
      throw error;
    }
  };
export const store = async (data) => {
  try {
    const response = await apiClient.post("settings/email/store", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchEmailTemplate = async () => {
  try {
    const response = await apiClient.get("settings/email/show");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchEmailTemplateById = async (id) => {
  try {
    const response = await apiClient.get(`settings/email/show/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const update = async (id, data) => {
  try {
    const response = await apiClient.put(`settings/email/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
