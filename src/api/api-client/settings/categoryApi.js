import { apiClient } from '../../api-config/config';

export const store = async (data) => {
  try {
    const response = await apiClient.post('settings/category/store', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCategory = async () => {
  try {
    const response = await apiClient.get('settings/category/show');
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchCategoryById = async (id) => {
  try {
    const response = await apiClient.get(`settings/category/show/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchCategoryByDefaultBusinessEntityId = async (id) => {
  try {
    const response = await apiClient.get(`settings/category/default-business-entity/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUniqueCategory = async (id) => {
  try {
    const response = await apiClient.get(`settings/category/unique-category/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const response = await apiClient.put(`settings/category/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCategoryAll = async () => {
  try {
    const response = await apiClient.get('settings/category/showall');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCategoryAllForPartner = async (id) => {
  try {
    const response = await apiClient.get(`settings/category/showall-partner/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategoryVisibility = async (data) => {
  try {
    const response = await apiClient.post(`settings/category/visibility`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
