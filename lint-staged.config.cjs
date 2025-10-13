module.exports = {
  // Use the flat config that works with our ESLint v9 setup
  '*.{js,ts,tsx}': ['eslint --config eslint.config.cjs --ext .js,.ts --fix', 'prettier --write'],
  '*.{json,md,css,scss}': ['prettier --write'],
};
