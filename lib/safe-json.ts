export async function safeJson(response: Response) {
  try {
    const json = await response.json();
    return { json, error: null };
  } catch (error) {
    return { json: null, error };
  }
}
