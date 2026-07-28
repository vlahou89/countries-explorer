// A typed, user-facing error: `kind` drives which message/retry UI is shown, `status` is the raw HTTP code.
// Normalizes every possible failure.
type ApiErrorKind = 'network' | 'timeout' | 'not-found' | 'server'
export class ApiError extends Error {
  constructor(
    readonly kind: ApiErrorKind,
    readonly userMessage: string,
    readonly status: number | null = null,
  ) {
    super(`[${kind}] ${userMessage}`)
    this.name = 'ApiError'
  }
}

// Fetch with a timeout and one retry, translating whatever $fetch throws into an ApiError by status code.
export async function apiGet<T>(path: string, query?: Record<string, string>): Promise<T> {
  try {
    return await $fetch<T>(path, { query, timeout: 10_000, retry: 1 }) as T
  } catch (e) {
    const err = e as { name?: string; status?: number; statusCode?: number }
    const status = err.status ?? err.statusCode ?? null
    if (err.name === 'AbortError') throw new ApiError('timeout', 'That took too long. Try again.')
    if (status === 404) throw new ApiError('not-found', "We couldn't find that country.", 404)
    if (status && status >= 500) throw new ApiError('server', 'The countries service is having problems.', status)
    throw new ApiError('network', "Couldn't reach the countries service. Check your connection.", status)
  }
}
