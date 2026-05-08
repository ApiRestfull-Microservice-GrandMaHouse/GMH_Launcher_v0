export async function shared(): Promise<{ message: string; }> {
  return { message: 'Hello API' };
}
