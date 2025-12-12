// src/api/offresApi.js
import apiClient from "./client";

// body for POST /offres/all
export const fetchOffres = async (filters = {}) => {
  const payload = {
    name: filters.name || "",
    summary: filters.summary || "",
    keywords: filters.keywords || [],
    customer_segment: filters.customer_segment || "",
    geography: filters.geography || "",
    start_date: filters.start_date || "2000-01-01",
    end_date: filters.end_date || "2035-12-31",
  };

  console.log("[fetchOffres] Request payload:", payload);

  try {
    const { data } = await apiClient.post("/offres/all", payload);
    console.log(
      "[fetchOffres] Response received:",
      Array.isArray(data) ? `array length = ${data.length}` : data
    );
    return data; // array of offers from backend
  } catch (error) {
    console.error(
      "[fetchOffres] Error:",
      error.response?.data || error.message || error
    );
    throw error; // let UI decide what to do (no local fallback)
  }
};

export const createOffres = async (offersObject) => {
  console.log("[createOffres] Request payload:", offersObject);

  try {
    const { data } = await apiClient.post("/offres/", offersObject);
    console.log("[createOffres] Response received:", data);
    return data; // { status: 200, detail: "Offre created." }
  } catch (error) {
    console.error(
      "[createOffres] Error:",
      error.response?.data || error.message || error
    );
    throw error;
  }
};
