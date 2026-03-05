/**
 * Safely parse JSON from a Response object, returning an error if parsing fails.
 *
 * @param response The Response object to parse JSON from.
 *
 * @returns An object containing either the parsed JSON or an error if parsing fails.
 */
export async function safeJson(response: Response) {
  const response2 = response.clone() // Clone the response to avoid consuming the body

  try {
    const json = await response.json()
    return { json, error: null, body: null }
  } catch (error) {
    return { json: null, error: error as Error, body: await response2.text() }
  }
}
