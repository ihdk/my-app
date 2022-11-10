const appNameText = Cypress.env('appNameText');

describe('empty spec', () => {
  it('passes', () => {
    cy.visit('/')
  })

  it('dashboard header', () => {
    cy.get('header').should('contain.text', appNameText);
  })

  it('dashboard toolbar', () => {
    cy.get('.dashboard-toolbar').within(() => {
      cy.get('.add-new-btn')
        .should('exist')
        .and('contain.text', 'Add new list')

      cy.get('.search-bar')
        .should('exist')
    })
  })

  it('dashboard todos list', () => {
    cy.get('.todos-list').should('exist')
  })

  it('dashboard demo data button', () => {
    cy.get('.demo-data-btn').should('exist')
  })

  it('search titles', () => {
    const searchText = "Looking for something";
    cy.get('.search-bar .search-input').type(searchText).should('have.value', searchText)

    cy.get('.search-title')
      .should('exist')
      .and('contain.text', searchText)

    cy.get('.search-bar .search-input').clear().should('have.value', "")

  })
  
})