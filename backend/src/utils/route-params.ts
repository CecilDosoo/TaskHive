/**
 * Safely extract route parameter as string
 * Express params can be string | string[], but we always expect a string
 */
export function getParam(req: { params: Record<string, string | string[] | undefined> }, key: string): string {
  const value = req.params[key];
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.length > 0) {
    return value[0];
  }
  throw new Error(`Missing required parameter: ${key}`);
}
