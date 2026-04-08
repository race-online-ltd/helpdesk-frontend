import { apiClient } from "../../api-config/config";

export const storeElement = async (data) => {
  try {
    const response = await apiClient.post(
      "settings/network-backbone/store/element",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const storeElementList = async (data) => {
  try {
    const response = await apiClient.post(
      "settings/network-backbone/store/element-list",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchElement = async () => {
  try {
    const response = await apiClient.get(
      "settings/network-backbone/element/show"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchNetworkBackboneEelements = async () => {
  try {
    const response = await apiClient.get("settings/network-backbone/elements");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchElementById = async (id) => {
  try {
    const response = await apiClient.get(
      `settings/network-backbone/show/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateElement = async (id, data) => {
  try {
    const response = await apiClient.put(
      `settings/network-backbone/update/element${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateElementList = async (id, data) => {
  try {
    const response = await apiClient.put(
      `settings/network-backbone/update/element-list${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
