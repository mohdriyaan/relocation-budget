import axios from "axios"

export const getExchangedRate = async(req,res,next) => {
  try {
    const { base } = req.params; // e.g. "INR"
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${base}`);
    res.json(response.data.rates); // { NZD: 0.018, USD: 0.012, ... }
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch exchange rates' });
  }
}