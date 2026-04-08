import { apiClient } from "../../api-config/config";


export const store = async (data) => {
  try {
    const response = await apiClient.post("settings/email/notification/store", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchNotification = async () => {
  try {
    const response = await apiClient.get("settings/email/notification/show");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchNotificationById = async (id) => {
  try {
    const response = await apiClient.get(`settings/email/notification/show/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const update = async (id, data) => {
  try {
    const response = await apiClient.put(`settings/email/notification/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
