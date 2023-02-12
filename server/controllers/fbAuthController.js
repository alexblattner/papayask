const admin = require('../middleware/config');
exports.createSession = async (req, res, next) => {
  const idToken = req.body.idToken.toString();

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        // Set cookie policy for session cookie.
        const options = {
          maxAge: expiresIn,
          httpOnly: true,
          secure: false,
        };
        res.end(JSON.stringify({ sessionCookie }));
      },
      (error) => {
        console.error(error);
        res.status(401).send('UNAUTHORIZED REQUEST!');
      }
    );
};
