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
const compareSnapshotCommand = require('cypress-visual-regression/dist/command');

compareSnapshotCommand({
    capture: 'fullPage'
});

Cypress.Commands.add('chooseDiet', ({
    location,
    name,
    mealsCount,
    kcal
}) => {
    cy.intercept('https://dietly.pl/api/dietly/open/cities/search?**').as('searchCity')
    cy.get('.top-search-bar__input').type(location)

    cy.wait('@searchCity')
    cy.wait(500)
    cy
        .get('.top-search-bar__cities-list-item p.label-m span')
        .contains(location)
        .click();

    cy
        .get('.diet-card__name')
        .contains(name)
        .click();

    cy
        .get('.diet-card__name')
        .contains(mealsCount)
        .click()

    cy
        .get('.steps-page__list li')
        .contains(kcal)
        .click()
})

Cypress.Commands.add('fillOrderDetails', ({
    daysCount,
    startDay
}) => {
    cy
        .get('.calendar__button-clear button')
        .contains('Odznacz wszystkie dni')
        .click()
    cy.get('.amount-carousel input').type('{selectall}').type(daysCount)
    cy
        .get('.calendar .hidden-down-xl .calendar__day')
        .contains(startDay)
        .click()
})

Cypress.Commands.add('checkCart', ({
    name,
    mealsCount,
    kcal,
    daysCount
}, startDate, endDate) => {
    cy.get('.shopping-cart-item__title-wrapper').within(() => {
        cy.get('p').eq(0).should('contain', name)
        cy.get('p').eq(1).should('contain', mealsCount)
        cy.get('p').eq(2).should('contain', `${kcal} kcal`)
    })
    cy.get('.shopping-cart-item__days').should('contain', daysCount)
    cy.get('.display-flex.align-items-center.spacer-bottom-8 > div').should('contain', `${startDate} - ${endDate}`)
})

Cypress.Commands.add('addToTheCart', () => {
    cy.get('.steps-page-second__summary a[href="/koszyk/mojcatering"]').click()
})

Cypress.Commands.add('editDiet', () => {
    cy
        .get('.shopping-cart-item__actions-buttons button')
        .contains('Edytuj dietę')
        .click()
})

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