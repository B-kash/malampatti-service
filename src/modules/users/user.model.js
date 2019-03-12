import mongoose, {Schema} from 'mongoose';
import validator from 'validator';
import extendSchema from 'mongoose-extend-schema'
import {passwordReg} from './user.validations';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import constants from '../../config/constants';
import  {Base,setAddedDate,setUpdatedDate} from '../../commons/models/Base.model';

const UserSchema = new Schema( {
        ...Base,
        email: {
            type: String,
            unique: true,
            required: [true, 'Email is required!'],
            trim: true,
            validate: {
                validator(email) {
                    return validator.isEmail(email);
                },
                message: '{VALUE} is not a valid email!',
            },
        },
        firstName: {
            type: String,
            required: [true, 'FirstName is required!'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'LastName is required!'],
            trim: true,
        },
        userName: {
            type: String,
            required: [true, 'UserName is required!'],
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required!'],
            trim: true,
            minlength: [6, 'Password need to be longer!'],
            validate: {
                validator(password) {
                    return passwordReg.test(password);
                },
                message: '{VALUE} is not a valid password!',
            },
        },
        role: {
            type: String,
            enum: constants.ROLE,
            required: [true, 'Role is required!'],
            default: constants.USER_ROLES.USER
        }
    },
    {timestamps: false},
);

UserSchema.pre('save', function (next) {
    var user = this;
    var SALT_FACTOR = 5;

    if (!user.isModified('password')) {
        return next();
    }

    setAddedDate();
// user.addedDate = new Date();
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {

        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, null, function (err, hash) {

            if (err) {
                return next(err);
            }

            user.password = hash;
            next();

        });

    });
});

UserSchema.pre('update',function (next) {
    setUpdatedDate();
});

UserSchema.methods = {
    authenticateUser(password) {
        return bcrypt.compareSync(password, this.password);
    },
    createToken() {
        return jwt.sign(
            {
                _id: this._id,
            },
            constants.JWT_SECRET,
        );
    },
    // toJSON() {
    //     return {
    //         _id: this._id,
    //         userName: this.userName,
    //     };
    // },
    toAuthJSON() {
        return {
            _id: this._id,
            userName: this.userName,
            token: `${this.createToken()}`,
            role: this.role
        };
    },
};


export default mongoose.model('User', UserSchema);