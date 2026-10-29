
import { prisma } from "@/infrastructure/database/prisma";

export async function getContact() {
  const contact = await prisma.contact.findFirst({
    select: {
      email: true,
      phone: true,
      whatsapp: true,
      address: true,
      isAvailable: true,
      showEmail: true,
      showPhone: true,
      showWhatsapp: true,
      showAddress: true,
      showAvailability: true,
    },
  });

  if (!contact) {
    return null;
  }

  return {
    email: contact.showEmail ? contact.email : null,
    phone: contact.showPhone ? contact.phone : null,
    whatsapp: contact.showWhatsapp ? contact.whatsapp : null,
    address: contact.showAddress ? contact.address : null,
    isAvailable: contact.showAvailability
      ? contact.isAvailable
      : null,
  };
}
