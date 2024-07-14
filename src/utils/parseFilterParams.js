const parseContactType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isContactType = (type) => ['work', 'home', 'personal'].includes(type);

  if (isContactType(type)) return type;
};

const parseIsFavourite = (isFavourite) => {
  const isBoolean = typeof isFavourite === 'boolean';
  if (!isBoolean) return;
  const isFavouriteType = (isFavourite) => [true, false].includes(isFavourite);

  if (isFavouriteType(isFavourite)) return isFavourite;
};
// const parseIsFavourite = (isFavourite) => {
//   const isBoolean = typeof isFavourite === 'boolean';
//   if (!isBoolean) return;
//   return isFavourite;
// };
export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedContactType = parseContactType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
