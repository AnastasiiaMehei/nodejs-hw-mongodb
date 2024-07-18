import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
  upsertContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();
router.get('/', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

router.post(
  '/contacts',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));
router.patch(
  '/contacts/:contactId',
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);
router.put(
  '/contacts/:contactId',
  validateBody(createContactSchema),
  ctrlWrapper(upsertContactController),
);
router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));
export default router;
