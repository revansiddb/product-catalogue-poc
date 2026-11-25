const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error((await res.text()) || res.statusText);
  return res.json();
}
