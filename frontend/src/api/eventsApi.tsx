// src/api/eventsApi.ts

import axios from "axios";

const API_BASE = "http://localhost:5000/api/events";

const api = axios.create({
  baseURL: API_BASE,
  // if you need auth tokens, set headers here or interceptors
});

// returns { event, message } or event depending on backend
export const createEvent = async (formData: FormData) => {
  const res = await api.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // backend may return { message, event } or event directly
  return res.data.event ?? res.data;
};

export const updateEvent = async (id: string, formData: FormData) => {
  const res = await api.put(`/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.event ?? res.data;
};

export const deleteEvent = async (id: string) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};

export const getEvents = async () => {
  const res = await api.get("/");
  return res.data;
};

export const getEventById = async (id: string) => {
  const res = await api.get(`/${id}`);
  return res.data;
};

export default {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventById,
};
