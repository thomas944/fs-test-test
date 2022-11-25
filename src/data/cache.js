const cache = {}

const getItem = (query) => {
  const item = cache[query];
  if (item !== undefined && item.expireAt > Date.now()) {
    return item.data;
  } else {
    return undefined;
  }
}

const setItem = (key, data) => {
  cache[key] = {
    data: data,
    expireAt: Date.now() + (1 * 1000),
  }
}

export default { getItem, setItem}