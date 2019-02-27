import { Router } from 'express';
import validate from 'express-validation';
import * as userController from './user.controllers';
import { authLocal, authJwt } from '../../services/auth.services';
import userValidation from './user.validations';

const routes = new Router();

// routes.get('/', authLocal, res.send({}));
routes.get('/',  userController.getAllUsers);
routes.get('/test', authJwt, userController.roleAuth(['USER']), function (req, res) { res.send("hello")});
routes.post('/signup', validate(userValidation.signup), userController.signUp);
routes.post('/login', authLocal, userController.login);

export default routes;