const router = require('express').Router();
const {required} = require('../../middleware/auth');
const {userLogin,userRegister,getUser,updateUser} = require('../../controller/userController');

router.post('/users/login', userLogin);

router.post('/users', userRegister);

router.get('/user', required, getUser);

router.put('/user', required, updateUser);

module.exports = router;