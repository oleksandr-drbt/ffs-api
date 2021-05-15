import { Request, Response } from 'express';
import DashboardService from '../services/DashboardService';

class DashboardController {
  /**
   * Get dashboard
   * @param req
   * @param res
   */
  public static async get(req: Request, res: Response) {
    // @ts-ignore
    const { id, role } = req.user;

    let dashboard = null;
    if (role === 'student') {
      // @ts-ignore
      dashboard = await DashboardService.getStudentDashboard(id);
    } else if (role === 'teacher') {
      // @ts-ignore
      dashboard = await DashboardService.getTeacherDashboard(id);
    }

    res.send(dashboard);
  }
}

export default DashboardController;
