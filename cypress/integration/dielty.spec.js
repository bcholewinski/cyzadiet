/// <reference types="cypress" />
const dayjs = require('dayjs')

Cypress.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes('ResizeObserver loop limit exceeded')) {
        return false
    }
    if (err.message.includes('3000ms timeout exceeded')) {
        return false
    }
})
describe('Actions', () => {
    beforeEach(() => {
        cy.visit('https://dietly.pl/koszyk/mojcatering')
        cy.get('.steps-page-basket__empty-basket-button').click()
    })

    it('adds diet to the cart', () => {
        const diet = {
            "location": "Warszawa",
            "name": "Dieta Optymalna Classic",
            "mealsCount": "3 posiłki",
            "kcal": "1200",
            "startDay": "26",
            "daysCount": "10"
        }
        const startDate = dayjs().add(1, 'month').set('date', diet.startDay).format('DD/MM/YYYY')
        const endDate = dayjs().add(1, 'month').set('date', diet.startDay).add(diet.daysCount - 1, 'days').format('DD/MM/YYYY')
        dietWizard(diet)
        cy.addToTheCart()
        cy.get('#__next').compareSnapshot('cart', 0.1);
        cy.checkCart(diet, startDate, endDate)

    })

    it('edits diet in the cart', () => {
        const dietBeforeEdit = {
            "location": "Warszawa",
            "name": "Dieta Optymalna Classic",
            "mealsCount": "3 posiłki",
            "kcal": "1200",
            "startDay": "26",
            "daysCount": "10"
        }

        const editedDiet = {
            "location": "Gdańsk",
            "name": "Dieta Sportowa",
            "mealsCount": "5 posiłków",
            "kcal": "3000",
            "startDay": "1",
            "daysCount": "5"

        }
        const startDate = dayjs().add(1, 'month').set('date', editedDiet.startDay).format('DD/MM/YYYY')
        const endDate = dayjs().add(1, 'month').set('date', editedDiet.startDay).add(editedDiet.daysCount - 1, 'days').format('DD/MM/YYYY')

        dietWizard(dietBeforeEdit)
        cy.addToTheCart()
        cy.editDiet()
        dietWizard(editedDiet)
        cy.addToTheCart()
        cy.checkCart(editedDiet, startDate, endDate)
    })
})

const dietWizard = (dietData) => {
    cy.chooseDiet(dietData);
    cy.get('.steps-page__button').click()
    cy.fillOrderDetails(dietData)
}