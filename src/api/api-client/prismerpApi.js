import {
  DhakaColoApiClient,
  EarthApiClient,
  RaceApiClient,
} from "../api-config/config";

export const raceClients = async () => {
  try {
    const response = await RaceApiClient.get("prismerp/race/customers");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const raceClientDetails = async (id) => {
  try {
    const response = await RaceApiClient.get(`prismerp/race/customers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const earthClients = async () => {
  try {
    const response = await EarthApiClient.get("prismerp/earth/customers");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const earthClientDetails = async (id) => {
  try {
    const response = await EarthApiClient.get(`prismerp/earth/customers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const dhakaColoClients = async () => {
  try {
    const response = await DhakaColoApiClient.get(
      "prismerp/dhakacolo/customers"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const dhakaColoClientDetails = async (id) => {
  try {
    const response = await DhakaColoApiClient.get(
      `prismerp/dhakacolo/customers/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
