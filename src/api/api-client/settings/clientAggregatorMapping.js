import { apiClient } from "../../api-config/config";


export const store = async (data) => {
    try {
        const response = await apiClient.post(
            "settings/client-aggregator-mapping/store",
            data
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const fetchClientAggregatorMapping = async () => {
    try {
        const response = await apiClient.get(
            "settings/client-aggregator-mapping/show"
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const fetchClientAggregatorMappingById = async (id) => {
    try {
        const response = await apiClient.get(
            `settings/client-aggregator-mapping/edit/${id}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const update = async (id, data) => {
    try {
        const response = await apiClient.put(
            `settings/client-aggregator-mapping/update/${id}`,
            data
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const destroy = async (id) => {
    try {
        const response = await apiClient.delete(
            `settings/client-aggregator-mapping/delete/${id}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const fetchClientAggregatorMappingList = async () => {
    try {
        const response = await apiClient.get(
            "settings/client-aggregator-mapping/list"
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}



export const fetchAggregatorsByClient = async (clientId) => {
  try {
    const response = await apiClient.get(`/client-aggregators/${clientId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


