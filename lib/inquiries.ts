import { prisma } from '@/lib/prisma';

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

// In-memory fallback store used when the database is unreachable (e.g. local/demo testing).
const demoInquiries: Inquiry[] = [];

function isDbUnreachable(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Can't reach database server") ||
    message.includes('ECONNREFUSED') ||
    message.includes('does not exist in the current database') ||
    /P20(01|02|10|21)/.test(message)
  );
}

export async function createInquiry(input: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<Inquiry> {
  try {
    return await prisma.inquiry.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        subject: input.subject,
        message: input.message,
      },
    });
  } catch (error) {
    if (!isDbUnreachable(error)) throw error;

    const inquiry: Inquiry = {
      id: `inquiry_${crypto.randomUUID()}`,
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      subject: input.subject,
      message: input.message,
      status: 'NEW',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    demoInquiries.unshift(inquiry);
    return inquiry;
  }
}

export async function listInquiries(): Promise<Inquiry[]> {
  try {
    return await prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    if (!isDbUnreachable(error)) throw error;
    return demoInquiries;
  }
}

export async function updateInquiryStatus(id: string, status: string): Promise<void> {
  try {
    await prisma.inquiry.update({ where: { id }, data: { status } });
  } catch (error) {
    if (!isDbUnreachable(error)) throw error;
    const inquiry = demoInquiries.find((item) => item.id === id);
    if (inquiry) {
      inquiry.status = status;
      inquiry.updatedAt = new Date();
    }
  }
}

export async function deleteInquiry(id: string): Promise<void> {
  try {
    await prisma.inquiry.delete({ where: { id } });
  } catch (error) {
    if (!isDbUnreachable(error)) throw error;
    const index = demoInquiries.findIndex((item) => item.id === id);
    if (index !== -1) demoInquiries.splice(index, 1);
  }
}
