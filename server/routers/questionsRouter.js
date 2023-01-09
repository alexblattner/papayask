const router = require('express').Router();

const questionsController = require('../controllers/questionController');
const middleware = require('../middleware/Middleware');


router.get('/', middleware.decodeToken, questionsController.getAll);
router.get('/:id', middleware.decodeToken, questionsController.getById);
router.post('/', middleware.decodeToken, questionsController.create);
router.post('/finish', middleware.decodeToken, questionsController.finish);
router.post('/pay', middleware.decodeToken, questionsController.pay);
router.post('/update-status/:id', middleware.decodeToken, questionsController.updateStatus);
module.exports = router;