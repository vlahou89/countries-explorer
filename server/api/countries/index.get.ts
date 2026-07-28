// GET /api/countries: proxies to REST Countries so the API key never reaches the browser.
export default defineEventHandler(() => fetchAllCountries())
