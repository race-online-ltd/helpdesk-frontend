import { apiClient } from '../../api-config/config';

export const store = async (data) => {
  try {
    const response = await apiClient.post('settings/subcategory/store', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSubCategory = async () => {
  try {
    const response = await apiClient.get('settings/subcategory/show');
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchSubCategoryById = async (id) => {
  try {
    const response = await apiClient.get(`settings/subcategory/show/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchSubCategoryByCategoryId = async (companyId, id) => {
  try {
    const response = await apiClient.get(`settings/subcategory/show/bycategory/${companyId}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const update = async (id, data) => {
  try {
    const response = await apiClient.put(`settings/subcategory/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSubcategoryAll = async () => {
  try {
    const response = await apiClient.get('settings/subcategory/showall');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const fetchSubcategoryAllForPartner = async (id) => {
//   try {
//     const response = await apiClient.get(`settings/subcategory/showall-partner/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };



export const fetchSubcategoryAllForPartner = async (categoryId, entityId) => {
  try {
    const response = await apiClient.get(
      `settings/subcategory/showall-partner/${categoryId}/${entityId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const updateSubCategoryVisibility = async (data) => {
  try {
    const response = await apiClient.post(`settings/subcategory/visibility`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};