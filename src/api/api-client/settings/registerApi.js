import { apiClient } from "../../api-config/config";

export const store = async (data) => {
  try {
    const response = await apiClient.post("settings/register/store", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchRegister = async () => {
  try {
    const response = await apiClient.get("settings/register/show");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchRegisterById = async (id) => {
  try {
    const response = await apiClient.get(`settings/register/show/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const update = async (id, data) => {
  try {
    const response = await apiClient.put(
      `settings/register/update/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
