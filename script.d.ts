export type AppointmentLead = {
  name: string;
  phone: string;
  email: string;
  interest: string;
};

export function sanitizeInput(value: string): string;
export function isValidName(value: string): boolean;
export function isValidEmail(value: string): boolean;
export function isValidBrazilianPhone(value: string): boolean;
export function isValidInterest(value: string): boolean;
export function submitAppointmentRequest(lead: AppointmentLead): Promise<{
  ok: boolean;
  simulated: boolean;
}>;