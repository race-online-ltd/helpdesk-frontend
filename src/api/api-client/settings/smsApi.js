// api/api-client/settings/smsApi.js
import { apiClient } from '../../api-config/config';

export const fetchSmsTemplate = async () => {
  try {
    const response = await apiClient.get('settings/sms/show');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSmsTemplateById = async (id) => {
  try {
    const response = await apiClient.get(`settings/sms/show/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const storeSms = async (data) => {
  try {
    const response = await apiClient.post('settings/sms/store', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSms = async (id, data) => {
  try {
    const response = await apiClient.put(`settings/sms/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkExcludeNotify = (businessEntityId, userId) => {
  return apiClient.post('/sms-templates/check-exclude-notify', {
    business_entity_id: businessEntityId,
    user_id: String(userId),
  });
};

export const sendSMSForClient = (data) => {
  return apiClient.post('/sms/send-client', data);
};
