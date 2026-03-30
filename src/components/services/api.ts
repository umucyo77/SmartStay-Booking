import axios from 'axios';

const api = axios.create({
  baseURL: 'https://airbnb19.p.rapidapi.com',
  headers: {
    'Content-Type': 'application/json',
    'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
    'x-rapidapi-host': 'airbnb19.p.rapidapi.com',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) throw new Error('Invalid API key.');
    if (status === 403) throw new Error('Not subscribed to Airbnb19 on RapidAPI.');
    if (status === 429) throw new Error('Rate limit reached. Create a new app on RapidAPI.');
    throw new Error(error.response?.data?.message ?? 'Something went wrong.');
  }
);

export default api;