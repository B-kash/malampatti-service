import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import User from '../modules/users/user.model';
import constants from '../config/constants';

//local strategy
const localOpts = {
    usernameField: 'userName',
};
const localStrategy = new LocalStrategy(localOpts, async (userName, password, done) => {
    try {
        console.log(userName);
        const user = await User.findOne({
            userName
        });
        if (!user) {
            return done(null, false, { error: 'Login failed. Please try again.' });
        } else if (!user.authenticateUser(password)) {
            return done(null, false, { error: 'Login failed. Please try again.' });
        }
        return done(null, user);
    } catch (e) {
        return done(e, false);
    }
});

// Jwt strategy
const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('bearer'),
    secretOrKey: constants.JWT_SECRET,
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
    try {
        const user = await User.findById(payload._id);

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    } catch (e) {
        return done(e, false);
    }
});

passport.use(localStrategy);
passport.use(jwtStrategy);

export const authLocal = passport.authenticate('local', { session: false });
export const authJwt = passport.authenticate('jwt', { session: false });
