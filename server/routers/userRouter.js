const router = require('express').Router();

const userController = require('../controllers/userController');
const middleware = require('../middleware/Middleware');

router.post('/', userController.createOrLogin);
router.patch('/:userId', middleware.decodeToken, userController.update);
router.get('/:userId', userController.getById);
router.post('/:userId/register-token', userController.registerToken);
router.post('/search', userController.search);
router.get('/search', userController.search);
router.post('/favorite/:id', middleware.decodeToken, userController.favorite);

module.exports = router;