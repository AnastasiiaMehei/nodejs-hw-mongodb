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
  const userId = req.user._id; // Get user ID from authenticated user

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    userId, // Фильтр по ID
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id; // ID авторизированного пользователя

  if (!isValidObjectId(contactId)) {
    return next(createHttpError(400, 'Invalid contact ID'));
  }

  const contact = await getContactById(contactId);
  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  if (contact.userId.toString() !== userId.toString()) {
    return next(createHttpError(403, 'Forbidden'));
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const userId = req.user._id; // ID авторизированного пользователя
  const contactData = { ...req.body, userId }; // Связать контакт с ID

  const contact = await createContact(contactData);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id; // ID авторизированного пользователя

  if (!isValidObjectId(contactId)) {
    return next(createHttpError(400, 'Invalid contact ID'));
  }

  const contact = await getContactById(contactId);
  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  if (contact.userId.toString() !== userId.toString()) {
    return next(createHttpError(403, 'Forbidden'));
  }

  await deleteContact(contactId);
  res.status(204).send();
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id; // ID авторизированного пользователя

  if (!isValidObjectId(contactId)) {
    return next(createHttpError(400, 'Invalid contact ID'));
  }

  const contact = await getContactById(contactId);
  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  if (contact.userId.toString() !== userId.toString()) {
    return next(createHttpError(403, 'Forbidden'));
  }

  const updatedContact = await updateContact(contactId, req.body);
  res.json({
    status: 200,
    message: 'Successfully updated contact!',
    data: updatedContact,
  });
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id; // ID авторизированного пользователя

  if (!isValidObjectId(contactId)) {
    return next(createHttpError(400, 'Invalid contact ID'));
  }

  const contact = await getContactById(contactId);
  if (contact && contact.userId.toString() !== userId.toString()) {
    return next(createHttpError(403, 'Forbidden'));
  }

  const updatedContact = await updateContact(contactId, req.body, {
    upsert: true,
  });
  const status = updatedContact.isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: 'Successfully upserted a contact!',
    data: updatedContact.contact,
  });
};
