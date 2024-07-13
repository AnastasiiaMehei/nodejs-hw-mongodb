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
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
const router = Router();
router.get('/contacts', ctrlWrapper(getContactsController));
router.get(
  '/contacts/:contactId',
  // isValidId,
  ctrlWrapper(getContactByIdController),
);
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
  isValidId,
  ctrlWrapper(upsertContactController),
);
export default router;
