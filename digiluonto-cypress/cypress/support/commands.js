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

// from https://github.com/cypress-io/cypress/issues/2671#issuecomment-678245088
Cypress.Commands.add('mockGeolocation', (latitude = 61.5, longitude = 21.8) => {
	cy.window().then(($window) =>  {
		cy.stub($window.navigator.geolocation, 'getCurrentPosition').callsFake((callback) => {
			return callback({ coords: { latitude, longitude } });
		});
	});
});

/**
 * Helper function to agree/close the geolocation query dialog
 */
Cypress.Commands.add('agreeGeolocation', () => {
	if (Cypress.browser.name !== 'electron') {
		cy.log('Press the button while not on Electron browser')
		cy.get('[data-cy="dialog-alert"]').should('exist').should('be.visible')
		cy.get('button[data-cy="btn-loc-agree"]').click()
	}else {
		cy.log('Electron agrees the dialog automatically')
	}
});
