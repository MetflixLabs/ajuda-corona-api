const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const BASE_URL = process.env.BASE_URL;
const SITE_KEY = process.env.SITE_KEY;
const X_API_ID = process.env.X_API_ID;
const X_API_KEY = process.env.X_API_KEY;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-ID': X_API_ID,
    'X-API-KEY': X_API_KEY,
  },
});

const params = {
  'site-key': SITE_KEY,
  currency: 'mintme',
};

const get = async (endpoint = '') => {
  try {
    const res = await api.get(endpoint, { params });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = get;
