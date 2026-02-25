/**
 * Safely parse JSON from a Response object, returning an error if parsing fails.
 *
 * @param response The Response object to parse JSON from.
 *
 * @returns An object containing either the parsed JSON or an error if parsing fails.
 */
export async function safeJson(response: Response) {
  try {
    const json = await response.json();
    return { json, error: null };
  } catch (error) {
    return { json: null, error };
  }
}
