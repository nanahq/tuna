context('Onbaording', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('should display elements', () => {
        cy.getByTestID('OnboardingScreen.View').should('exist')
        cy.getByTestID('OnboardingCover').should('exist')
        cy.getByTestID('OnboardingScreen.Heading').should('exist')
        cy.getByTestID('OnboardingScreen.Text').should('exist')
        cy.getByTestID('GenericButton.Onboarding.Continue').should('exist')
        cy.getByTestID('OnboardingScreen.Login.Button').should('exist')
        cy.getByTestID('OnboardingScreen.Login.Text').should('exist')
    })
})
