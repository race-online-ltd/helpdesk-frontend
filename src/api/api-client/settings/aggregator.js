import { apiClient } from "../../api-config/config";


export const store = async (data) => {
    try {
        const response = await apiClient.post(
            "settings/aggregator/store",
            data
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const fetchAggregator = async () => {
    try {
        const response = await apiClient.get(
            "settings/aggregator/show"
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const fetchAggregatorById = async (id) => {
    try {
        const response = await apiClient.get(
            `settings/aggregator/edit/${id}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const update = async (id, data) => {
    try {
        const response = await apiClient.put(
            `settings/aggregator/update/${id}`,
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
            `settings/aggregator/delete/${id}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
