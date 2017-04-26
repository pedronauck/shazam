import { app, notfound } from './modules'

const routes = () => ({
  childRoutes: [
    app(),
    notfound()
  ]
})

export default routes
