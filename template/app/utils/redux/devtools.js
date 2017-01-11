const hasDevTools = () => {
  const isWindowAnObject = (typeof window === 'object');
  const isDevToolsDefined = (typeof window.devToolsExtension !== 'undefined');

  return (isWindowAnObject && isDevToolsDefined);
};

const devToolsEnhancer = hasDevTools() ? window.devToolsExtension() : (f) => f;

export { devToolsEnhancer, hasDevTools };
