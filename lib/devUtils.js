const sass = require('sass'); // eslint-disable-line
const crypto = require('crypto');

const generateScopedName = (localName, resourcePath) => {
  const getHash = value => crypto.createHash('sha256').update(value).digest('hex');
  const hash = getHash(`${resourcePath}${localName}`).slice(0, 5);
  return `${localName}--${hash}`;
};

const preprocessCss = (data, filename) => {
  if (!filename.endsWith('module.scss')) return '';
  return sass.renderSync({ file: filename }).css.toString('utf8');
};

const clearCache = moduleAbsPath => {
  const imodule = require.cache[moduleAbsPath];
  if (!imodule) return;

  if (imodule.id.match(/node_modules/)) return;

  delete require.cache[moduleAbsPath];
  imodule.children.forEach(el => clearCache(el.id));
};

module.exports = {
  generateScopedName,
  preprocessCss,
  clearCache,
};
