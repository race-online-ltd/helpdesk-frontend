import { apiClient } from "../api-config/config";

export const getSource = async () => {
  try {
    const response = await apiClient.get("utility/source/show");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStatus = async () => {
  try {
    const response = await apiClient.get("utility/status/show");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCcEmail = async () => {
  try {
    const response = await apiClient.get("utility/cc-email/show");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPriority = async () => {
  try {
    const response = await apiClient.get("utility/priority/show");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await apiClient.post("utility/reset-password", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const clientResetPassword = async (data) => {
  try {
    const response = await apiClient.post(
      "utility/client-reset-password",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
