import { contactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
// import { parseFilterParams } from '../utils/parseFilterParams.js';
export const getAllContacts = async ({
  page,
  perPage,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = contactsCollection.find();

  const parsedFilters = parseFilterParams(filter);

  if (parsedFilters.type) {
    contactsQuery.where('type').equals(parsedFilters.type);
  }
  // if (parsedFilters.isFavourite !== undefined) {
  //   contactsQuery.where('isFavourite').equals(parsedFilters.isFavourite);
  // }
  const [contactsCount, contacts] = await Promise.all([
    contactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};
export const getContactById = async (contactId) => {
  const contact = await contactsCollection.findById(contactId);
  return contact;
};
export const createContact = async (payload) => {
  const contact = await contactsCollection.create(payload);
  return contact;
};
export const deleteContact = async (contactId) => {
  const contact = await contactsCollection.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};
export const patchContact = async (id, contactData) => {
  return await contactsCollection.findByIdAndUpdate(id, contactData, {
    new: true,
  });
};
export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await contactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
