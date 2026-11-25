import { EnquiryRequest } from '../types/domain';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';

export async function sendEnquiry(payload: EnquiryRequest): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/enquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.text()) || res.statusText);
  return res.json();
}
