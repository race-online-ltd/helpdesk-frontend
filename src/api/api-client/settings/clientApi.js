import { apiClient } from "../../api-config/config";

export const store = async (data) => {
  try {
    const response = await apiClient.post("settings/client/store", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const storeMultipleClientWithBusinessEntity = async (data) => {
  try {
    const response = await apiClient.post("settings/client/entity/store", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchClient = async () => {
  try {
    const response = await apiClient.get("settings/client/show");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchUserSerial = async (id) => {
  try {
    const response = await apiClient.get(`settings/client/user-serial/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchClientById = async (id, businessId) => {
  try {
    const response = await apiClient.get(
      `settings/client/show/${id}/entityId/${businessId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const update = async (id, data) => {
  try {
    const response = await apiClient.put(`settings/client/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchClientByDefaultEntity = async (data) => {
  try {
    const response = await apiClient.post(
      "settings/client/by-default-entity",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
