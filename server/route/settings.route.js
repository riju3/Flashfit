import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getSettingsController, updateSettingsController } from '../controllers/settings.controller.js';

const settingsRouter = Router();

settingsRouter.get('/get', getSettingsController);
settingsRouter.put('/update', auth, updateSettingsController);

export default settingsRouter;
