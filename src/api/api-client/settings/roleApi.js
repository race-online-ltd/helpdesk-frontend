import { apiClient } from "../../api-config/config";

export const fetchRole = async () => {
  try {
    const response = await apiClient.get("settings/role/show");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDefaultClientRole = async () => {
  try {
    const response = await apiClient.get("settings/role/default-client");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDefaultAgentRole = async () => {
  try {
    const response = await apiClient.get("settings/role/default-agent");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSidebarItems = async () => {
  try {
    const response = await apiClient.get("settings/role/showsidebaritems");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDashboardItems = async () => {
  try {
    const response = await apiClient.get("settings/role/showdashboarditems");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSettingItems = async () => {
  try {
    const response = await apiClient.get("settings/role/showsettingitems");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPageInfoByName = async (id) => {
  try {
    const response = await apiClient.get(`settings/role/showpageitems/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const store = async (data) => {
  try {
    const response = await apiClient.post("settings/role/store", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
