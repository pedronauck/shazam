import App from './'

import home from './modules/Home/routes'

const routes = () => ({
  component: App,
  childRoutes: [
    home()
  ]
})

export default routes
