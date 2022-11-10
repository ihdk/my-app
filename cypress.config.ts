import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000/",//"https://ivan-demo.netlify.app/",
    env: {
      appNameText: "My App Demo",
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  "component": {
    "devServer": {
      "framework": "react",
      "bundler": "webpack"
    }
  }
})