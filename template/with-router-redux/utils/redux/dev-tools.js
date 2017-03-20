const IS_DEV = (process.env.NODE_ENV === 'development')

const hasDevTools = () =>
  ((typeof window === 'object') && (typeof window.devToolsExtension !== 'undefined'))

const devToolsEnhancer = () =>
  (IS_DEV && hasDevTools()) ? window.devToolsExtension() : f => f

export default devToolsEnhancer
