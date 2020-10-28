export const clearCache = (rootModulePath, { ignoreRegex = null } = {}) => {
  const clearCacheInner = moduleAbsPath => {
    const imodule = require.cache[moduleAbsPath];
    if (!imodule) return;

    if (imodule.id.match(/node_modules/) || (ignoreRegex && imodule.id.match(ignoreRegex))) return;

    delete require.cache[moduleAbsPath];
    imodule.children.forEach(el => clearCacheInner(el.id));
  };

  clearCacheInner(rootModulePath);
};
