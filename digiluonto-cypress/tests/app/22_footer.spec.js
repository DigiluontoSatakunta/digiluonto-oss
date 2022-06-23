// enables intelligent code completion for Cypress commands
/// <reference types="Cypress" />

context('Digiluonto Client -- Footer/Toolbar Tasks', () => {
	beforeEach(() => {
		// go to root page of the static pages (i.e. baseUrl)
		cy.visit("/")
		let defaultLocation = Cypress.env('defaultLocation')
		let geolocation = cy.mockGeolocation(defaultLocation.lat,defaultLocation.lon)
	})

	it('Valitse alavalikon tutustu-linkki', () => {
		cy.get('a[data-cy="nav-explore"]').click({force: true})
		cy.location('href').should('contain', Cypress.env('baseUrl'))
	})

	it('Valitse alavalikon suodata-linkki', () => {
		cy.get('a[data-cy="nav-filter"]').click({force: true})
		cy.location('href').should('contain', '/tags')
	})

	it('Valitse alavalikon lähimmät-linkki', () => {
		cy.get('a[data-cy="nav-nearme"]').click({force: true})
		cy.location('href').should('contain', '/nearme')
	})

	it('Valitse alavalikon kartta-linkki', () => {
		cy.get('a[data-cy="nav-map"]').click({force: true})
		cy.location('href').should('contain', '/map')
	})
})
