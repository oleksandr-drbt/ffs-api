import bcrypt from 'bcrypt';

class PasswordService {
  public static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password, salt);
  }

  public static async comparePasswords(password: string, userPassword: string) {
    return bcrypt.compare(password, userPassword);
  }
}

export default PasswordService;
