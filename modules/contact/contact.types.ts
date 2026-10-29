export interface Contact {
  id: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  isAvailable: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showWhatsapp: boolean;
  showAddress: boolean;
  showAvailability: boolean;
  createdAt: string;
  updatedAt: string;
}