const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.NEWS_API_KEY || '2bfb5371fd3d4cffa58938e21c256054';
const BASE_URL = 'https://newsapi.org/v2';

app.use(express.json());

app.get('/api/top-headlines', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        ...req.query,
        apiKey: API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const payload = error.response?.data || { message: 'Yangiliklar serverdan olishda xatolik yuz berdi.' };
    res.status(status).json(payload);
  }
});

app.get('/api/everything', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        ...req.query,
        apiKey: API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const payload = error.response?.data || { message: 'Qidiruv natijalari olinmadi.' };
    res.status(status).json(payload);
  }
});

app.listen(PORT, () => {
  console.log(`News proxy running at http://localhost:${PORT}`);
});
