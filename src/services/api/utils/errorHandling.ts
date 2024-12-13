export function handleApiError(error: any, context: string) {
  console.error(context + ':', error);
  throw error;
}