import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: "https://ivan-demo.netlify.app/",
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