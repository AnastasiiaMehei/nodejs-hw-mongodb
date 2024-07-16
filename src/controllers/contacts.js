import { isValidObjectId } from 'mongoose';
import {
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  getAllContacts,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};
export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(
      createHttpError(400, {
        status: 400,
        message: 'Invalid contact ID',
        data: {
          message: 'Invalid contact ID',
        },
      }),
    );
  }

  const contact = await getContactById(contactId);

  if (!contact) {
    return next(
      createHttpError(404, {
        status: 404,
        message: 'Contact not found',
        data: {
          message: 'Contact not found',
        },
      }),
    );
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};
export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};
export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(
      createHttpError(400, {
        status: 400,
        message: 'Invalid contact ID',
        data: {
          message: 'Invalid contact ID',
        },
      }),
    );
  }
  const contact = await deleteContact(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const result = await updateContact(contactId, req.body);
  if (!result) {
    return next(
      createHttpError(404, {
        status: 404,
        message: 'Contact not found',
        data: {
          message: 'Contact not found',
        },
      }),
    );
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result,
  });
};
export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body, {
    upsert: true,
  });
  if (!result) {
    return next(
      createHttpError(404, {
        status: 404,
        message: 'Contact not found',
        data: {
          message: 'Contact not found',
        },
      }),
    );
  }
  const status = result.isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.contact,
  });
};
