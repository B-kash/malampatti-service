import HTTPStatus from 'http-status';
import User from './user.model';

export async function signUp(req, res) {
    try {
        const user = await User.create(req.body);
        return res.status(HTTPStatus.CREATED).json(user.toAuthJSON());
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

export function login(req, res, next) {
    res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
    return next();
}

export const roleAuth = function (roles) {
    return function (req, res, next) {

        const user = req.user;

        User.findById(user._id, function (err, foundUser) {

            if (err) {
                res.status(422).json({ error: 'No user found.' });
                return next(err);
            }

            if (roles.indexOf(foundUser.role) > -1) {
                return next();
            }

            res.status(401).json({ error: 'You are not authorized to view this content' });
            return next('Unauthorized');

        });

    }
}