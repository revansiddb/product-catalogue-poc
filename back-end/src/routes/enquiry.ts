import { Router } from 'express';
import { validateEnquiryBody } from '../validators/enquiryValidator';
import { sendEnquiry } from '../controllers/enquiryController';

const router = Router();

router.post('/', validateEnquiryBody, sendEnquiry);

export default router;
