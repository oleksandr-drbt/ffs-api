import { Router } from 'express';
import auth from '../middlewares/auth';
import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UserController';
import SkillController from '../controllers/SkillController';

const router = Router();

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/me', auth, AuthController.me);
router.get('/logout', auth, AuthController.logout);

router.get('/users', auth, UserController.list);
router.get('/users/:id', auth, UserController.get);
router.put('/user/edit-profile', auth, UserController.update);
router.delete('/user/delete-account', auth, UserController.remove);

router.post('/skills', auth, SkillController.create);
router.get('/skills', auth, SkillController.list);

export default router;
