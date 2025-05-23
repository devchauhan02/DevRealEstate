import express from 'express';
import { updateProfilePic , updateUser , deleteUser , getUserListings} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.put('/updateProfilePic' , updateProfilePic)
router.put('/update/:id' ,verifyToken, updateUser);
router.delete('/delete/:id' ,verifyToken, deleteUser);
router.get('/listings/:id' ,verifyToken, getUserListings);

export default router;