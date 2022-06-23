// enables intelligent code completion for Cypress commands
/// <reference types="Cypress" />

context('Digiluonto Client -- Agree Use of Location et al.', () => {
	beforeEach(() => {
		// go to root page of the static pages (i.e. baseUrl)
		cy.visit("/")
	})

	it('Hylkää sijaintipalvelut', {  browser: '!electron' }, () => {
		cy.get('[data-cy="dialog-alert"]').should('be.visible')
		cy.get('[data-cy="content-loc-instructions"').should("not.exist")
		cy.get('button[data-cy="btn-loc-disagree"]').click()
		cy.get('[data-cy="dialog-alert"]').should('not.exist')
	})

	it('Hyväksy sijaintipalvelut', () => {
		cy.agreeGeolocation()
		cy.get('[data-cy="dialog-alert"]').should("not.exist")
	})
})
