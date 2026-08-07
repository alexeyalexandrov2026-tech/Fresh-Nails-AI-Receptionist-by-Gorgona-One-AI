CREATE INDEX idx_ai_conversations_client_id ON public.ai_conversations(client_id);
CREATE INDEX idx_appointments_client_id ON public.appointments(client_id);
CREATE INDEX idx_appointments_master_id ON public.appointments(master_id);
CREATE INDEX idx_appointments_service_id ON public.appointments(service_id);
CREATE INDEX idx_clients_favorite_master_id ON public.clients(favorite_master_id);
CREATE INDEX idx_payments_appointment_id ON public.payments(appointment_id);
CREATE INDEX idx_payments_client_id ON public.payments(client_id);
