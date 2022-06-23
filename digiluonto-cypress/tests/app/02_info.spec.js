// enables intelligent code completion for Cypress commands
/// <reference types="Cypress" />

context('Digiluonto Client -- Infosivun testitapauksia', () => {
	beforeEach(() => {
		cy.visit('/info')
	})

	it('Info sivulla pitää pystyä näkemään ryhmän esittelykortti', () => {
		cy.get('[data-cy="content-card-group"]').scrollIntoView().should('be.visible')
	})

	it('Näe esittelykortissa ryhmän logo (opt), nimi, esittelyteksti, jakolinkki ja linkki ryhmän kotisivulle (opt)', () => {
		cy.get('[data-cy="content-card-group"]').scrollIntoView()
		cy.get('[data-cy="content-group-name"]').should('be.visible')
		cy.get('[data-cy="btn-group-share"]').should('be.visible')
		cy.get('[data-cy="btn-group-homepage"]').should('be.visible')
	})

	it('Info sivulla pitää pystyä näkemään hätätilannekortti sijaintitietoineen', () => {
		cy.get('[data-cy="content-card-emergency"]').scrollIntoView()
		cy.get('[data-cy="content-card-emergency"]').should('contain', '112') //sisältää hätänumeron

		//sisältää originaalin sijainnin
		let location = Cypress.env('defaultLocation')
		cy.get('[data-cy="content-card-emergency"]').should('contain', location.lat)
		cy.get('[data-cy="content-card-emergency"]').should('contain', location.lon)
	})

	it('Varmista, että sijaintitieto on päivittynyt', () => {
		let originalLocation = Cypress.env('defaultLocation')
		let newLocation = { 'lat': 61.567, 'lon': 21.100 }

		//sisältää originaalin sijainnin
		cy.get('[data-cy="content-card-emergency"]').should('contain', originalLocation.lat)
		cy.get('[data-cy="content-card-emergency"]').should('contain', originalLocation.lon)

		cy.mockGeolocation(newLocation.lat,newLocation.lon)
		cy.agreeGeolocation()

		//sisältää uuden sijainnin
		cy.get('[data-cy="content-card-emergency"]').should('contain', newLocation.lat)
		cy.get('[data-cy="content-card-emergency"]').should('contain', newLocation.lon)

	})
})
