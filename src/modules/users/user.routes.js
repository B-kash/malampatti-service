import { Router } from 'express';
import validate from 'express-validation';
import * as userController from './user.controllers';
import { authLocal, authJwt } from '../../services/auth.services';
import userValidation from './user.validations';

const routes = new Router();

routes.post('/signup', validate(userValidation.signup), userController.signUp);
routes.post('/login', authLocal, userController.login);
routes.get('/test', authJwt, userController.roleAuth(['USER']), function (req, res) { res.send("hello")});

export default routes;