import { apiClient } from "../../api-config/config";

export const store = async (data) => {
  try {
    const response = await apiClient.post("settings/client/store", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchAgentOptions = async () => {
  try {
    const response = await apiClient.get("settings/agent/options");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchAgent = async () => {
  try {
    const response = await apiClient.get("settings/agent/show");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAgentAll = async () => {
  try {
    const response = await apiClient.get("settings/agent/show-all");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAgentById = async (id) => {
  try {
    const response = await apiClient.get(`settings/agent/show/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const update = async (id, data) => {
  try {
    const response = await apiClient.put(`settings/agent/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAgentsByDefaultBusinessEntityTeam = async (id) => {
  try {
    const response = await apiClient.get(
      `settings/agent/show/agents/by/team-of-default-business-entity/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAgentsByTeam = async (id) => {
  try {
    const response = await apiClient.get(`settings/agent/show/byteam/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
