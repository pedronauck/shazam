import App from './'

import home from './Home/routes'

const routes = () => ({
  component: App,
  childRoutes: [
    home()
  ]
})

export default routes
