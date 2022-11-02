
const admin = require('./config');

class Middleware {
    async decodeToken(req, res, next) {
        console.log(req.headers,req.body);
        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = req.headers.authorization.split(' ')[1];
        try{
            const decoded = admin.auth().verifyIdToken(token);
            if(decoded) {
                return next();
            }
            return res.status(401).send('Unauthorized');
        }catch(err){
            return res.status(400).send('Internal Server Error');
        }
    }
}
module.exports = new Middleware();