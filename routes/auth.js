let express = require('express');
const router = express.Router();
const register_controller = require('../controllers/auth_account')

router.post('/register',register_controller.addAccount);
router.post('/login', register_controller.loginAccount);
router.get('/updateform/:student_id', register_controller.updateAccount);
router.post('/updateuser', register_controller.updateUser);
router.get('/deleteuser/:student_id', register_controller.deleteAccount);
router.post('/student', register_controller.studentAccount);


router.get('logout',register_controller.logoutAccount);



module.exports = router;