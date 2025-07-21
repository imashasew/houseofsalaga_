const express = require('express');
const router = express.Router();
const personalInfoController = require('../controllers/personalInfoController');
const authenticateToken = require('../middleware/authenticateToken');

// Token-based personal info routes
router.get('/me', authenticateToken, personalInfoController.getPersonalInfoByToken);
router.post('/me', authenticateToken, personalInfoController.createOrUpdatePersonalInfoByToken);

router.post('/', personalInfoController.createPersonalInfo);
router.get('/', personalInfoController.getAllPersonalInfo);
router.get('/:id', personalInfoController.getPersonalInfoById);
router.put('/:id', personalInfoController.updatePersonalInfo);
router.delete('/:id', personalInfoController.deletePersonalInfo);

module.exports = router;
