import User from '../models/User';
import Project from '../models/Project';

class SearchService {
  public static async findUsers(value: string, skills: string[], role: string = 'student') {
    const users = await User.query()
      .where(builder =>
        builder
          .where('first_name', 'ILIKE', `%${value}%`)
          .orWhere('last_name', 'ILIKE', `%${value}%`)
          .orWhereRaw("CONCAT_WS(' ',first_name,last_name) ILIKE ?", `%${value}%`)
          .orWhere('position', 'ILIKE', `%${value}%`)
          .orWhere('description', 'ILIKE', `%${value}%`),
      )
      .andWhere('role', role)
      .orderBy('created_at', 'desc')
      .withGraphFetched(User.relationsExpr);

    if (skills.length) {
      return this.filterBySkills(users, skills);
    }

    return users;
  }

  public static async findProjects(value: string, skills: string[]) {
    const projects = await Project.query()
      .where(builder =>
        builder
          .where('title', 'ILIKE', `%${value}%`)
          .orWhere('description', 'ILIKE', `%${value}%`),
      )
      .andWhere('status', 'backlog')
      .orderBy('updated_at', 'desc')
      .withGraphFetched(Project.relationsExpr);

    if (skills.length) {
      return this.filterBySkills(projects, skills);
    }

    return projects;
  }

  private static filterBySkills(entities: any[], skills: string[]) {
    return entities.filter((entity) => {
      // @ts-ignore
      const entitySkills = entity.skills.map(({ name }) => name);
      return skills.every(skillName => entitySkills.includes(skillName));
    });
  }
}

export default SearchService;
