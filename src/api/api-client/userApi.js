import { apiClient } from "../api-config/config";

export const getUsers = async () => {
  try {
    const response = await apiClient.get("/users");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const authenticateUser = async (data) => {
  try {
    const response = await apiClient.post("/user/userauthentication", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    const response = await apiClient.post("/user/userlogout");
    return response;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (data) => {
  try {
    const response = await apiClient.post("/user/change-password", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to handle API errors
const handleApiError = (error) => {
  // Example: Log errors or handle them in a centralized way
  console.error("API error occurred:", error);
};
