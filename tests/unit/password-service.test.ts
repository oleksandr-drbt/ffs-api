import PasswordService from '../../src/services/PasswordService';

describe('Hash password', () => {
  it('Compare passwords succeeded', async (done) => {
    const plainPassword = '123456';
    const hashedPassword = await PasswordService.hashPassword(plainPassword);

    return PasswordService.comparePasswords(plainPassword, hashedPassword)
    .then((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('Compare passwords failure', async (done) => {
    const plainPassword = '123456';
    const wrongPassword = '654321';
    const hashedPassword = await PasswordService.hashPassword(plainPassword);

    return PasswordService.comparePasswords(wrongPassword, hashedPassword)
      .then((result) => {
        expect(result).toBe(false);
        done();
      });
  });
});
