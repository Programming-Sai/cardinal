import { apiSuccess } from '../utils/helpers.js';
import { countAdmins } from '../models/Admin.js';
import { countApplicationsByStatus } from '../models/Application.js';
import { countInquiriesByStatus } from '../models/Inquiry.js';
import { countPrograms } from '../models/Program.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const applicationStats = await countApplicationsByStatus();
    const inquiryStats = await countInquiriesByStatus();
    const adminsCount = await countAdmins();
    const programsCount = await countPrograms();

    apiSuccess(res, {
      applications: applicationStats,
      inquiries: inquiryStats,
      programs: { total: programsCount },
      admins: { total: adminsCount },
      summary: {
        newApplications: applicationStats.new_count,
        pendingReview: applicationStats.reviewed_count,
        acceptedThisWeek: applicationStats.accepted_count,
        totalPartnerships: inquiryStats.partnered_count,
      },
    });
  } catch (error) {
    next(error);
  }
};
