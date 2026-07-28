// Reads the code route param, uppercases it, and asks fetchCountryByCode for that country. 
// If nothing came back, it throws a real 404 instead of silently returning undefined as JSON
// so a bad code fails loudly and predictably, not as a confusing empty 200 OK.
export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')!.toUpperCase()
  const country = await fetchCountryByCode(code)
  if (!country) throw createError({ statusCode: 404, statusMessage: "We couldn't find that country." })
  return country
})
