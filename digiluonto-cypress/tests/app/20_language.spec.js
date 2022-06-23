// enables intelligent code completion for Cypress commands
/// <reference types="Cypress" />

context('Digiluonto Client -- Language Tests', () => {
	beforeEach(() => {
		// go to root page of the static pages (i.e. baseUrl)
		cy.visit("/")
		let defaultLocation = Cypress.env('defaultLocation')
		let geolocation = cy.mockGeolocation(defaultLocation.lat,defaultLocation.lon)
	})

	it('Vaihda kielivalintaa', () => {
		cy.location('href').should('include', Cypress.env('baseUrl'))

		cy.get('[data-cy="content-bubble"]').then(($original) => {
			const originalBubbleText = $original.text()

			cy.get('button[data-cy="btn-lang-menu"]').trigger("click")	// click language menu button
			cy.wait(250)
			cy.get('[data-cy="btn-lang-choice"]').first().trigger("click") // click the first choice of language
			cy.wait(1000)

			//ensure the url is still baseUrl (regression test)
			cy.location('href').should('include', Cypress.env('baseUrl'))

			cy.get('[data-cy="content-bubble"]').scrollIntoView().then(($newLanguage) => {
				expect($newLanguage.text()).not.to.eq(originalBubbleText)
			})
		})
	})
})
