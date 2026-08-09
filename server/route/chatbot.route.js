import { Router } from 'express';
import { chatbotController } from '../controllers/chatbot.controller.js';

const chatbotRouter = Router();

chatbotRouter.post('/chat', chatbotController);

export default chatbotRouter;
