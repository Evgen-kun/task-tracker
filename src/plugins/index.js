/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import store from './store'
import router from './router'

export function registerPlugins (app) {
  loadFonts()
  app.use(store).use(router).use(vuetify)
}
