module.exports = {
  '*.{js,ts,tsx}': ['eslint --ext .js,.ts --fix', 'prettier --write'],
  '*.{json,md,css,scss}': ['prettier --write'],
};
