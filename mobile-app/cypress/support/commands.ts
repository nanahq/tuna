import "@testing-library/cypress/add-commands";


/* eslint-disable @typescript-eslint/no-var-requires */
const compareSnapshotCommand = require("cypress-image-diff-js/dist/command");
compareSnapshotCommand();

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * @description Custom command to select DOM element by data-testid attribute.
             * @example cy.getByTestID('settings')
             */
            getByTestID: (value: string, opts?: any) => Chainable<Element>;

        }
    }
}

// @ts-ignore
Cypress.Commands.add("getByTestID", (selector: string, opts?: any) => {
    /* eslint-disable @typescript-eslint/restrict-template-expressions */
    const args = opts != null ? opts : { timeout: 10000 };
    return cy.get(`[data-testid=${Cypress.$.escapeSelector(selector)}]`, args);
});
