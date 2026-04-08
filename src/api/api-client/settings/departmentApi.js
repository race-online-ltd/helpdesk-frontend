import { apiClient } from "../../api-config/config";

export const store = async (data) => {
  try {
    const response = await apiClient.post("settings/department/store", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDepartment = async () => {
  try {
    const response = await apiClient.get("settings/department/show");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchDepartmentById = async (id) => {
  try {
    const response = await apiClient.get(`settings/department/show/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const update = async (id, data) => {
  try {
    const response = await apiClient.put(
      `settings/department/update/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
