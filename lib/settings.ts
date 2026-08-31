import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export type AppSettings = {
  supportEmail: string;
  supportPhone: string;
  supportHours: string;
  supportAddress: string;
};

const defaultSettings: AppSettings = {
  supportEmail: 'support@oky.local',
  supportPhone: '+1 (555) 010-2450',
  supportHours: 'Mon-Fri 9:00 AM - 6:00 PM UTC',
  supportAddress: 'OKY Support Desk, 100 Test Street, Suite 200, London',
};

export async function getAppSettings(): Promise<AppSettings> {
  try {
    const existing = await prisma.settings.findFirst();
    return {
      supportEmail: existing?.supportEmail ?? defaultSettings.supportEmail,
      supportPhone: existing?.supportPhone ?? defaultSettings.supportPhone,
      supportHours: existing?.supportHours ?? defaultSettings.supportHours,
      supportAddress: existing?.supportAddress ?? defaultSettings.supportAddress,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      ['P2021', 'P2002', 'P2010'].includes(error.code)
    ) {
      return defaultSettings;
    }

    const message = error instanceof Error ? error.message : String(error);
    if (
      message.includes("Can't reach database server") ||
      message.includes('ECONNREFUSED')
    ) {
      return defaultSettings;
    }

    throw error;
  }
}

export async function saveAppSettings(input: Partial<AppSettings>) {
  try {
    const existing = await prisma.settings.findFirst();

    if (existing) {
      return prisma.settings.update({
        where: { id: existing.id },
        data: {
          supportEmail: input.supportEmail ?? existing.supportEmail,
          supportPhone: input.supportPhone ?? existing.supportPhone,
          supportHours: input.supportHours ?? existing.supportHours,
          supportAddress: input.supportAddress ?? existing.supportAddress,
        },
      });
    }

    return prisma.settings.create({
      data: {
        supportEmail: input.supportEmail ?? defaultSettings.supportEmail,
        supportPhone: input.supportPhone ?? defaultSettings.supportPhone,
        supportHours: input.supportHours ?? defaultSettings.supportHours,
        supportAddress: input.supportAddress ?? defaultSettings.supportAddress,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return null;
    }
    throw error;
  }
}
