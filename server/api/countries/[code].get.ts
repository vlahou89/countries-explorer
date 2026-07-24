export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')!.toUpperCase()
  const country = await fetchCountryByCode(code)
  if (!country) throw createError({ statusCode: 404, statusMessage: "We couldn't find that country." })
  return country
})
