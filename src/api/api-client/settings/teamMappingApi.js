import { apiClient } from "../../api-config/config";

/**
 * Store a new team mapping
 * @param {Object} data - Team mapping data
 * @returns {Promise}
 */
export const storeTeamMapping = async (data) => {
  try {
    const response = await apiClient.post("team-mapping/store", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch all team mappings
 * @returns {Promise}
 */
export const fetchTeamMapping = async () => {
  try {
    const response = await apiClient.get("team-mapping");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch team mapping by ID
 * @param {number} id - Team mapping ID
 * @returns {Promise}
 */
export const fetchTeamMappingById = async (id) => {
  try {
    const response = await apiClient.get(`team-mapping/show/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update team mapping
 * @param {number} id - Team mapping ID
 * @param {Object} data - Updated team mapping data
 * @returns {Promise}
 */
export const updateTeamMapping = async (id, data) => {
  try {
    const response = await apiClient.put(`team-mapping/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete team mapping
 * @param {number} id - Team mapping ID
 * @returns {Promise}
 */
export const deleteTeamMapping = async (id) => {
  try {
    const response = await apiClient.delete(`team-mapping/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch team mappings by company ID
 * @param {number} companyId - Company ID
 * @returns {Promise}
 */
export const fetchTeamMappingByCompanyId = async (companyId) => {
  try {
    const response = await apiClient.get(`team-mapping/company/${companyId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch team mappings by category ID
 * @param {number} categoryId - Category ID
 * @returns {Promise}
 */
export const fetchTeamMappingByCategoryId = async (categoryId) => {
  try {
    const response = await apiClient.get(`team-mapping/category/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch team mappings by subcategory ID
 * @param {number} subcategoryId - Subcategory ID
 * @returns {Promise}
 */
export const fetchTeamMappingBySubcategoryId = async (subcategoryId) => {
  try {
    const response = await apiClient.get(`team-mapping/subcategory/${subcategoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};




export const fetchSubCategoriesByCategoryId = async (categoryId) => {
  try {
    const response = await apiClient.get(
      `team-mapping/subcategory/by-category/${categoryId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Alternative: Fetch subcategories with full details by category ID
 * @param {number} categoryId - Category ID
 * @returns {Promise}
 */
export const fetchSubCategoriesByCategory = async (categoryId) => {
  try {
    const response = await apiClient.get(
      `team-mapping/subcategory/category/${categoryId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};