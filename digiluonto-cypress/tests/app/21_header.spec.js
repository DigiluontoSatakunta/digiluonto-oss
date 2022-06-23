// enables intelligent code completion for Cypress commands
/// <reference types="Cypress" />

context('Digiluonto Client -- Header/Toolbar Tasks', () => {
	beforeEach(() => {
		// go to root page of the static pages (i.e. baseUrl)
		cy.visit("/")
		let defaultLocation = Cypress.env('defaultLocation')
		let geolocation = cy.mockGeolocation(defaultLocation.lat,defaultLocation.lon)
	})

	it('Jaa linkki painikkeesta.', () => {
		cy.get('button[data-cy="btn-share"]').click()	// click share button

		// https://www.tutorialspoint.com/handling-alerts-with-cypress
		// --> There exists a window: alert event triggered by browsers while pop ups are opened. This event can be used to verify the alert text.
		// --> Cypress accepts this alert by default and we cannot modify this behavior without firing the browser event.
		cy.on('window:alert', (message) => {
			expect(message).to.exist
		})

		cy.location('href').should('include', Cypress.env('baseUrl')) // expect that the page does not break
	})

	it('Avaa valikko ja tarkista tiedot', () => {
		cy.get('#main-menu-button').trigger("click")	// click main menu button
		cy.wait(250)

		cy.get('body').find('div:contains("Omat ryhmät")').should("be.visible")
		cy.get('body').find('a:contains("Info")').should("be.visible")
		cy.get('body').find('a:contains("Tietosuojaseloste")').should("be.visible")
	})
})
