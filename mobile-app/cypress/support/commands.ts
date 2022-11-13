import "@testing-library/cypress/add-commands";
import "./onboardingCommands";
import "./walletCommands";

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

            /**
             * @description Redirects to main page and creates an empty wallet for testing. Useful on starts of tests.
             * @param {boolean} [isRandom=false] default = false, creates randomly generated mnemonic seed or abandon x23
             * @example cy.createEmptyWallet(isRandom?: boolean)
             */
            createEmptyWallet: (isRandom?: boolean) => Chainable<Element>;

            /**
             * @description Sends UTXO DFI to wallet.
             * @example cy.sendDFItoWallet().wait(4000)
             */
            sendDFItoWallet: () => Chainable<Element>;

            /**
             * @description Sends DFI Token to wallet.
             * @example cy.sendDFITokentoWallet().wait(4000)
             */
            sendDFITokentoWallet: () => Chainable<Element>;

            /**
             * @description Sends token to wallet. Accepts a list of token symbols to be sent.
             * @param {string[]} tokens to be sent
             * @example cy.sendTokenToWallet(['BTC', 'ETH']).wait(4000)
             */
            sendTokenToWallet: (tokens: string[]) => Chainable<Element>;

            /**
             * @description Wait for the ocean interface to be confirmed then close the drawer
             * @param {string} pin - accepts optional pin
             * @example cy.closeOceanInterface('000000')
             */
            closeOceanInterface: (pin?: string) => Chainable<Element>;

            /**
             * @description Exit current wallet
             * @example cy.exitWallet()
             */
            exitWallet: () => Chainable<Element>;

            /**
             * @description Fetch wallet balance
             * @example cy.fetchWalletBalance()
             */
            fetchWalletBalance: () => Chainable<Element>;

            /**
             * @description Switch networks via app
             * @param {string} network to be used
             * @example cy.switchToMainnet('MainNet')
             */
            switchNetwork: (network: string) => Chainable<Element>;

            /**
             * @description Stores local storage for dependent tests
             */
            saveLocalStorage: () => Chainable<Element>;

            /**
             * @description Restores local storage for dependent tests
             */
            restoreLocalStorage: () => Chainable<Element>;

            /**
             * @description Compare snapshot from image
             */
            compareSnapshot: (element?: string) => Chainable<Element>;

            /**
             * @description Set wallet theme
             * @param {any} walletTheme
             */
            setWalletTheme: (walletTheme: any) => Chainable<Element>;

            /**
             * @description Return empty array of feature flag
             */
            blockAllFeatureFlag: () => Chainable<Element>;
            /**
             * @description Set feature flags
             * @param {string[]} flags to be set
             * @example cy.setFeatureFlags(['feature_a', 'feature_b'], 'beta')
             */
            setFeatureFlags: (flags: string[], stage?: string) => Chainable<Element>;

            /**
             * @description
             Future swap settles every 20 blocks. To ensure that there"s ample time (20 blocks) to:
             Future Swap -> Withdraw Future Swap -> Do checks
             the flow must start to a block divisible by 20 + 1
             */
            waitUntilFutureSwapSettles: () => Chainable<Element>;
        }
    }
}

Cypress.Commands.add("getByTestID", (selector: string, opts?: any) => {
    /* eslint-disable @typescript-eslint/restrict-template-expressions */
    const args = opts != null ? opts : { timeout: 10000 };
    return cy.get(`[data-testid=${Cypress.$.escapeSelector(selector)}]`, args);
});



