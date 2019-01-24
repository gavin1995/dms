export const getParams = (search) => {
  if (!search) return {};
  const vars = search.substring(1).split('&');
  const queryString = {};
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split('=');
    const key = decodeURIComponent(pair[0]);
    const value = decodeURIComponent(pair[1]);
    if (typeof queryString[key] === 'undefined') {
      queryString[key] = decodeURIComponent(value);
    } else if (typeof queryString[key] === 'string') {
      queryString[key] = [queryString[key], decodeURIComponent(value)];
    } else {
      queryString[key].push(decodeURIComponent(value));
    }
  }
  return queryString;
};

export const getBaseHashUrlPrefix = url => url.match(/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]#/g)[0] || url;

export const formatReviewUrl = associationUrl => {
  // eslint-disable-next-line no-use-before-define
  const url = window.location.href;
  const urlSplit = url.split('?');
  const search = `?${urlSplit[urlSplit.length - 1]}`;
  const params = getParams(search);
  if (Object.keys(params).length < 2) {
    // 该模块没有关联参数
    return `${associationUrl}?enableReview=1`;
  }
  const urlArray = associationUrl.split('{');
  const formatUrl = urlArray.map(item => {
    if (!item.includes('}')) {
      return item;
    }
    const tempArray = item.split('}');
    const key = tempArray[0];
    return params[key] + tempArray[1];
  }).join('');
  return `${formatUrl}&enableReview=1`;
} 
