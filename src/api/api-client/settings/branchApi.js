import { apiClient } from "../../api-config/config";

export const store = async (data) => {
    try {
        const response = await apiClient.post("settings/branch/store", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchBranch = async () => {
    try {
        const response = await apiClient.get("settings/branch/show");
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const fetchBranchListByClientId = async (id) => {
    try {
        const response = await apiClient.get(`settings/branch/show/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchBranchById = async (id) => {
    try {
        const response = await apiClient.get(`settings/branch/edit/${id}`); // ✅ must call edit/{id}
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const update = async (id, data) => {
    try {
        const response = await apiClient.put(
            `settings/branch/update/${id}`, // ✅ corrected route
            data
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
