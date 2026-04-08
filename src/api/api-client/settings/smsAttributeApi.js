// src/api/api-client/settings/smsAttributeApi.js
import { apiClient } from "../../api-config/config";

/**
 * Fetch all active SMS attributes (placeholders)
 */
export const fetchSmsAttributes = () => {
  return apiClient.get("/sms-attributes");
};

/**
 * Store a new SMS attribute
 */
export const storeSmsAttribute = (data) => {
  return apiClient.post("/sms-attributes", data);
};

/**
 * Update an existing SMS attribute
 */
export const updateSmsAttribute = (id, data) => {
  return apiClient.put(`/sms-attributes/${id}`, data);
};

/**
 * Delete an SMS attribute
 */
export const deleteSmsAttribute = (id) => {
  return apiClient.delete(`/sms-attributes/${id}`);
};