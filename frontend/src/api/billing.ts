import apiClient from './client';
import type { InvoiceResponse, PaymentResponse, PayInvoiceRequest } from '../types';

export async function listInvoices(userId: string): Promise<InvoiceResponse[]> {
  const response = await apiClient.get<InvoiceResponse[]>('/billing/invoices', {
    params: { userId },
  });
  return response.data;
}

export async function getInvoice(id: string): Promise<InvoiceResponse> {
  const response = await apiClient.get<InvoiceResponse>(`/billing/invoices/${id}`);
  return response.data;
}

export async function payInvoice(id: string, data: PayInvoiceRequest): Promise<PaymentResponse> {
  const response = await apiClient.post<PaymentResponse>(`/billing/invoices/${id}/pay`, data);
  return response.data;
}
