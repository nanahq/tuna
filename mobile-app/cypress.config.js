// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
const { defineConfig } = require("cypress");

module.exports = defineConfig({
    projectId: "rj4b2m",
    fixturesFolder: false,
    viewportWidth: 1000,
    viewportHeight: 812,
    orientation: "portrait",
    retries: {
        runMode: 1,
        openMode: 0,
    },
    numTestsKeptInMemory: 0,
    chromeWebSecurity: false,
    e2e: {
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        setupNodeEvents(on, config) {
            // eslint-disable-next-line global-require
            return require("./cypress/plugins/index")(on, config);
        },
        baseUrl: "http://localhost:19006",
        specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    },
});
