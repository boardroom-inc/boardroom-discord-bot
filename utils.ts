type Params = {
  [key: string]: string | number | string[];
}

export const buildQueryString = (parameters: Params): string => {
  const queryString = new URLSearchParams();
  Object.entries(parameters).forEach(([key, value]) => {
    if (typeof value === 'string') {
      queryString.set(key, value);
    }
    if (typeof value === 'number') {
      queryString.set(key, String(value));
    }
    if (typeof value === 'object') {
      queryString.set(key, value.join(','));
    }
  });

  return queryString.toString();
};
