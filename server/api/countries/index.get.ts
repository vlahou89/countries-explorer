// GET /api/countries: proxies to REST Countries so the API key never reaches the browser.
// Nitro automatically serializes the return value to JSON.
export default defineEventHandler(() => fetchAllCountries())
