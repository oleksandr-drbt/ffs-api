import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UserController';
import auth from '../middlewares/auth';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', auth, AuthController.me);
router.get('/logout', auth, AuthController.logout);

router.get('/users', auth, UserController.list);
router.get('/users/:id', auth, UserController.get);
router.put('/user/edit-profile', auth, UserController.update);
router.delete('/user/delete-account', auth, UserController.remove);

export default router;
