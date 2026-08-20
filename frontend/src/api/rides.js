import api from "./axios";

export async function searchRides({src, dest, date, cursor = null,signal}) {
  const response = await api.get("/ride/search", {
    params: {
      src,
      dest,
      date,
      cursor,
    },
    signal,
  });

  return response.data;
}