// const parseNumber = (number, defaultValue) => {
//   const isString = typeof number === 'string';
//   if (!isString) return defaultValue;

//   const parsedNumber = parseInt(number);
//   if (Number.isNaN(parsedNumber)) {
//     return defaultValue;
//   }

//   return parsedNumber;
// };
// export const parsePaginationParams = (query) => {
//   const { page, perPage } = query;

//   const parsedPage = parseNumber(page, 2);
//   const parsedPerPage = parseNumber(perPage, 4);

//   return {
//     page: parsedPage,
//     perPage: parsedPerPage,
//   };
// };
export const parsePaginationParams = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const perPage = parseInt(query.perPage, 10) || 10;
  return { page, perPage };
};

export const parseSortParams = (query) => {
  const sortBy = query.sortBy || '_id';
  const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
  return { sortBy, sortOrder };
};
