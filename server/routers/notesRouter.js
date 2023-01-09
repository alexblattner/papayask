const router = require('express').Router();

const notesController = require('../controllers/noteController');
const middleware = require('../middleware/Middleware');

router.post('/', middleware.decodeToken, notesController.create);
router.patch('/', middleware.decodeToken, notesController.edit);
router.delete('/:id', middleware.decodeToken, notesController.delete);

module.exports = router;