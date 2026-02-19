import prisma from '../utils/prisma';
import { User, Application, UserStatus } from '@prisma/client';

export class ApplicationService {
  static async submitApplication(data: {
    email: string;
    name: string;
    motivation: string;
    cvUrl: string;
    researchInterests?: string[];
    expertise?: string[];
    githubUrl?: string;
    linkedinUrl?: string;
  }) {
    const application = await prisma.application.create({
      data: {
        email: data.email,
        name: data.name,
        motivation: data.motivation,
        cvUrl: data.cvUrl,
        researchInterests: data.researchInterests || [],
        expertise: data.expertise || [],
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        status: 'PENDING'
      }
    });

    return application;
  }

  static async getAllApplications(status?: UserStatus) {
    const whereClause = status ? { status } : {};
    return await prisma.application.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getApplication(id: string) {
    return await prisma.application.findUnique({
      where: { id }
    });
  }

  static async approveApplication(id: string, reviewerId: string) {
    const application = await prisma.application.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewerId
      }
    });

    // Create/update the user account with TEAM_MEMBER role
    await prisma.user.upsert({
      where: { email: application.email },
      update: {
        role: 'TEAM_MEMBER',
        status: 'APPROVED',
        name: application.name,
        researchInterests: application.researchInterests,
        expertise: application.expertise
      },
      create: {
        email: application.email,
        password: '', // Will be set when user resets password
        name: application.name,
        role: 'TEAM_MEMBER',
        status: 'APPROVED',
        researchInterests: application.researchInterests,
        expertise: application.expertise
      }
    });

    return application;
  }

  static async rejectApplication(id: string, reviewerId: string, feedback?: string) {
    return await prisma.application.update({
      where: { id },
      data: {
        status: 'REJECTED',
        feedback,
        reviewedAt: new Date(),
        reviewerId
      }
    });
  }
}
