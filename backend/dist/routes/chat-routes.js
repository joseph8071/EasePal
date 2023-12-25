import { Router } from 'express';
import { verifyToken } from '../utils/token-manager.js';
// Protectd Api
const chatRoutes = Router();
chatRoutes.post('/new', verifyToken);
export default chatRoutes; // export the router
//# sourceMappingURL=chat-routes.js.map