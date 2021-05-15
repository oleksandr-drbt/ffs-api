import { Request, Response } from 'express';
import SearchService from '../services/SearchService';

class SearchController {
  /**
   * Search for users
   * @param req
   * @param res
   */
  public static async searchForUsers(req: Request, res: Response) {
    const value = req.query.value || '';
    const skills = req.query.skills ? JSON.parse(req.query.skills) : [];
    const users = await SearchService.findUsers(value, skills, 'student');

    res.send(users);
  }

  /**
   * Search for projects
   * @param req
   * @param res
   */
  public static async searchForProjects(req: Request, res: Response) {
    const value = req.query.value || '';
    const skills = req.query.skills ? JSON.parse(req.query.skills) : [];
    const projects = await SearchService.findProjects(value, skills);

    res.send(projects);
  }
}

export default SearchController;
