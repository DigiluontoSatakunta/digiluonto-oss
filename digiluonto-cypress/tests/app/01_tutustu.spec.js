// enables intelligent code completion for Cypress commands
/// <reference types="Cypress" />

context('Digiluonto Client -- Etusivun testitapauksia', () => {
	beforeEach(() => {
		cy.visit("/")
		let defaultLocation = Cypress.env('defaultLocation')
		let geolocation = cy.mockGeolocation(defaultLocation.lat,defaultLocation.lon)
		//cy.agreeGeolocation()
	})

	it('Näe tutustu sivu', () => {
		cy.get('[data-cy="content-header"]').scrollIntoView().should('contain', 'Digiluonto')
	})

	it('Liity toiseen ryhmään, uudelleen lataa, ja palaa alkuperäiseen', () => {
		let groups = {
			digiluonto: "5fdb7d0f353b6812516cb926",
			testi: "6163f8300ace7f0016334045",
		}
		cy.get('[data-cy="content-header"]').should('contain', 'Digiluonto')	//check original group

		cy.visit('?oid='+groups.testi)	//change group
		cy.get('[data-cy="content-header"]').should('contain', 'Testiryhmä')	//check new group

		cy.visit('/') //ensure group after reload
		cy.get('[data-cy="content-header"]').should('contain', 'Testiryhmä')	//check new group again

		cy.visit('?oid='+groups.digiluonto) //return to original
		cy.get('[data-cy="content-header"]').should('contain', 'Digiluonto')	//check original group

	})

	it('Lue ryhmän nimi yläpalkista', () => {
		cy.get('[data-cy="content-header"]').scrollIntoView().should('contain', 'Digiluonto')
	})

	it('Valitse ryhmän nimi yläpalkista, mikä ohjaa ryhmän tutustu-sivulle', () => {
		cy.get('[data-cy="content-header"]').click()
		cy.location('href').should('include', Cypress.env('baseUrl'))
	})

	it('Näe ryhmän asettamat polut', () => {
		cy.log("Nearby")
		cy.get('[data-cy="content-nearby"]').scrollIntoView().should('be.visible')

		cy.log("Featured")
		cy.get('[data-cy="content-featured"]').scrollIntoView().should('be.visible')

		cy.get('[data-element="journey-cards"]').should('have.length.above', 1)

		cy.get('[data-element="journey-cards"]').each(($journey, index) => {
			cy.log('Checking amount of journey cards in index:' + index)
			cy.get('[data-element="journey-cards-card"]', {withinSubject: $journey})
				.should('have.length.above', 0)
		})
	})

	it('Näe polkukorttiin asetettu logo tai teksti', () => {
		cy.get('[data-element="journey-cards-card"]').each(($journeyCard, index) => {
			cy.log('Check each journey card for logo or text: ' + index)
			cy.get('[data-cy="content-group"]', {withinSubject: $journeyCard})
				.should('exist')
		})
	})

	it('Näe polkukorttiin asetettu nimi ja kuvaus', () => {
		cy.get('[data-element="journey-cards-card"]').each(($journeyCard, index) => {
			cy.log('Check each journey card for name and description: ' + index)
			cy.get('[data-element="journey-cards-card-title"]', {withinSubject: $journeyCard})
				.should('exist')
			cy.get('[data-element="journey-cards-card-description"]', {withinSubject: $journeyCard})
				.should('exist')
		})
	})

	it('Valitse polku, josta siirrytään polku-näkymään', () => {
		cy.get('[data-element="journey-cards-card"]').first().
			find('div a').first().then(($element) => {
				let journeyUrl = $element.attr('href')
				cy.log(journeyUrl)
				cy.get($element).click({force: true})

				cy.location('href').should('include', journeyUrl)
				cy.get('[data-element="slider-title"]').scrollIntoView().should('be.visible')
		})
	})

	it('Näe ryhmän maskotti', () => {
		cy.get('img#mascot').scrollIntoView().should('be.visible')
	})

	it('Klikkaa ryhmän maskottia', () => {
		cy.get('img#mascot').click()
	})
})
