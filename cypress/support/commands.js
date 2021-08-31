import * as testData from '../testData.json';
import * as utils from '../utils';

Cypress.Commands.add('enterFilterValue', (filterValue) => {
    cy.get('#filter-input').clear().type(filterValue);
})

Cypress.Commands.add('sortByColumnName', (columnName) => {
    cy.get('select').select(testData.backEndToFrontEndNamesMapper[columnName]).should('have.value', columnName);
    cy.wait(50);
})

/**
 * This custom command help to validate column names . The approach used for the validation is 
 * 
 * 1. Get the expected column name (which is shown in UI) by using the keys from table data fetched and by referring to the backEndToFrontEndNamesMapper
 * 2. Find column index by referring to the tableIndexes
 * 3. Assert does the table header selector formed in combination of column index has the expected column name
 * 4. Step 1-3 happens iteratively till all the column names gets validated
 */

Cypress.Commands.add('validateTableHeader', (workflowData) => {
    cy.get('.table-header>div').should('have.length', Object.keys(testData.entries[0]).length)
    for (var i = 0; i < Object.keys(testData.entries[i]).length; i++) {
        var expectedColumnName = testData.backEndToFrontEndNamesMapper[Object.keys(testData.entries[0])[i]];
        var columnIndex = workflowData.tableIndexes[i];
        cy.get('.table-header .header__item>a').eq(columnIndex).should('have.text', expectedColumnName);
    }
})

/**
 * This custom command help to validate cell values in the table . The approach used for the validation is 
 * 
 * 1. Find column index by referring to the tableIndexes
 * 2. Get the expected cell value by using the values from table data with the appripriate row and column values
 * 3. Check if the row's "number of cases" column values are expanded (ex 1M -> 1000000)
 * 4. Assert does the cell selector formed in combination of row and column values has the expected cell value
 * 5. Step 1-4 happens iteratively till all the cells values gets validated
 */

Cypress.Commands.add('validateTableData', (workflowData) => {
    for (var i = 0; i < workflowData.filteredData.length; i++) {
        for (var j = 0; j < Object.keys(workflowData.filteredData[i]).length - 1; j++) {
            var columnIndex = workflowData.tableIndexes[j];
            var expectedText = Object.values(workflowData.filteredData[i])[j];
            var isNumbersExpanded = Object.keys(workflowData.filteredData[i])[j] == 'cases' ? workflowData.filteredData[i].casesValuesExpanded : false;
            cy.textEquals("//div[@class='table-content']/div[" + (i + 1) + "]/div[" + (columnIndex + 1) + "]", expectedText, isNumbersExpanded)
        }
    }
})

Cypress.Commands.add('findColumnNumberByName', (columnName) => {
    return cy.xpath("//div/a[text()='" + columnName + "']/..").invoke('index').then((indexValue) => {
        return indexValue;
    })
})

Cypress.Commands.add('textEquals', (selector, expectedText, isNumbersExpanded) => {
    if (isNumbersExpanded && typeof expectedText == 'number')
        expectedText = utils.collapseNumber(expectedText);
    cy.xpath(selector).then((element) => {
        expect(typeof expectedText == 'string' ? expectedText.toLowerCase() : expectedText.toString()).to.eq(element.text().toLowerCase());
    })
})
