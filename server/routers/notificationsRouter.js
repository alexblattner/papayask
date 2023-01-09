const router = require('express').Router();

const notificationsController = require('../controllers/notificationsController');
const middleware = require('../middleware/Middleware');

router.get('/', middleware.decodeToken, notificationsController.getAll);
router.patch(
  '/read-notifications',
  middleware.decodeToken,
  notificationsController.readNotifications
);

module.exports = router;
