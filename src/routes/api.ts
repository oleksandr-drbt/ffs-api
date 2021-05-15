import { Router } from 'express';
import auth from '../middlewares/auth';
import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UserController';
import SkillController from '../controllers/SkillController';
import WorkController from '../controllers/WorkController';
import ProjectController from '../controllers/ProjectController';
import SearchController from '../controllers/SearchController';

const router = Router();

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth/me', auth, AuthController.me);
router.get('/auth/logout', auth, AuthController.logout);

router.get('/users', auth, UserController.list);
router.get('/users/:id', auth, UserController.get);
router.put('/user/edit-profile', auth, UserController.update);
router.post('/user/upload-avatar', auth, UserController.uploadAvatar);
router.put('/user/change-password', auth, UserController.changePassword);
router.delete('/user/delete-account', auth, UserController.remove);

router.post('/skills', auth, SkillController.create);
router.get('/skills', auth, SkillController.list);

router.post('/user/works', auth, WorkController.create);
router.get('/user/works', auth, WorkController.list);
router.put('/user/works/:id', auth, WorkController.update);
router.delete('/user/works/:id', auth, WorkController.remove);

router.post('/user/projects', auth, ProjectController.create);
router.get('/user/projects', auth, ProjectController.list);
router.put('/user/projects/:id', auth, ProjectController.update);
router.delete('/user/projects/:id', auth, ProjectController.remove);

router.get('/search/users', auth, SearchController.searchForUsers);
router.get('/search/projects', auth, SearchController.searchForProjects);

export default router;
