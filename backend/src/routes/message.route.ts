import express from 'express';
import protectRoute from '../middleware/protectRoute';
import { getMessage, sendMessage, getUsersForSidebar } from '../controllers/message.controller';
const router  = express.Router();

router.get('/conversations', protectRoute, getUsersForSidebar);
router.get('/:id',protectRoute, getMessage)
router.post('/send/:id',protectRoute, sendMessage)





export default router;