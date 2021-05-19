export const randomInt = (a = 1, b = 0, floor = true) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return floor ? Math.floor(lower + Math.random() * (upper - lower + 1)) : Number((lower + Math.random() * (upper - lower)).toFixed(1));
};

export const getRandomArrayElement = (arr) => {
  return arr[randomInt(0, arr.length - 1)];
};

// export const updateItem = (items, update) => {
//   const index = items.findIndex((item) => item.id === update.id);
//
//   if (index === -1) {
//     return items;
//   }
//
//   return [
//     ...items.slice(0, index),
//     update,
//     ...items.slice(index + 1),
//   ];
// };
