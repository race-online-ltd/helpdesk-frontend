import { apiClient } from "../../api-config/config";

export const store = async (data) => {
  try {
    const response = await apiClient.post("settings/division/store", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDivision = async () => {
  try {
    const response = await apiClient.get("settings/division/show");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchDivisionById = async (id) => {
  try {
    const response = await apiClient.get(`settings/division/show/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const update = async (id, data) => {
  try {
    const response = await apiClient.put(
      `settings/division/update/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
