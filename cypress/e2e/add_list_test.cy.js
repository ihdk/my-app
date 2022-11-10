const appNameText = Cypress.env('appNameText');

context('Add new list Test', () => {
  beforeEach(() => {
    cy.visit('/')
  })


  it('add new list', () => {
    cy.get('.dashboard-toolbar .add-new-btn').click()
    cy.get('.add-new-dialog').within(() => {
      cy.get('.title').should('contain.text', 'Name your new list')
      cy.get('.list-name-input')
        .should('exist')
        .type("My new list")
      cy.get('button.submit').click()
      
      // terrible way to wait until post request processed
      cy.wait(3000)
    })
  })

  it('was added new list', () => {
    cy.get('.todos-list').find('.todo-item').first().as('firstItem')
    cy.get('@firstItem').within(() => {
      cy.get('.content-part').should('contain.text', 'Empty list')
      cy.get('.title-part').should('contain.text', 'My new list')
    })
  })

  it('rename list', () => {
    cy.get('.todos-list').find('.todo-item').first().as('firstItem')

    cy.get('@firstItem').within(() => {
      cy.get('.toolbar-part .rename-btn')
        .should('contain.text', 'Rename').click()

    })
    cy.get('@firstItem').should('have.class', 'editing')
    cy.get('@firstItem').within(() => {
      cy.get('input').clear().type('Edited list title')
      cy.get('button.submit').should('contain.text', 'Save').click()
    })

    cy.get('@firstItem').should('not.have.class', 'editing')
    cy.get('@firstItem').within(() => {
      cy.get('.title-part').should('include.text', 'Edited list title')
    })
  })
})