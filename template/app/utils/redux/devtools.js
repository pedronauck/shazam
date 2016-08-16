const fallBack = (returnableFunction) => returnableFunction;

const hasDevTools = () => {
  const isWindowAnObject = (typeof window === 'object');
  const isDevToolsDefined = (typeof window.devToolsExtension !== 'undefined');

  return (isWindowAnObject && isDevToolsDefined);
};

export const devToolsEnhancer = hasDevTools() ? window.devToolsExtension() : fallBack;

export { hasDevTools };
