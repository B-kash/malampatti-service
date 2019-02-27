import HTTPStatus from 'http-status';
import User from './user.model';

export async function signUp(req, res) {
    console.log(req.body);
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

export function getAllUsers(req,res,next) {
     User.find({},function(err,data){
         console.log("data  ", data);

         if(!err){
            return res.status(HTTPStatus.OK).json(data);

        }else{
            console.log("Err here ", err);
            return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json(err);
        }
    });
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