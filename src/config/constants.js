const devConfig = {
    MONGO_URL: 'mongodb://admin:admin123@ds133875.mlab.com:33875/mp',
    JWT_SECRET: 'thisisasecret',
    USER_ROLES: {
        ADMIN: 'ADMIN',
        USER: 'USER',
        DOCTOR: 'DOCTOR'
    },
    ROLE: ['ADMIN','USER','DOCTOR']
};
const testConfig = {};
const prodConfig = {};
const defaultConfig = {
    PORT: process.env.PORT || 3000,
};

function envConfig(env) {
    switch (env) {
        case 'development':
            return devConfig;
        case 'test':
            return testConfig;
        default:
            return prodConfig;
    }
}

// Take defaultConfig and make it a single object
// So, we have concatenated two objects into one
export default {
    ...defaultConfig,
    ...envConfig(process.env.NODE_ENV),
};
