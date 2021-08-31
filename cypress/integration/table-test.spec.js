/// <reference types="Cypress" />
import * as testData from '../testData';
import * as utils from '../utils';

let workflowData = {};

context('Test for the data table', () => {

    /**
     * Before runing the tests the following activities are done
     * 
     * 1. getting the expected data from file/api
     * 2. normalise the fetched data
     * 3. Finding the column index in the table by matching the table names
     * 
     */

    before(function () {
        cy.visit('/');
        workflowData.expectedData = testData.entries;
        workflowData.normalisedData = utils.normaliseData(workflowData.expectedData);
        utils.getColumnIndexByNames(workflowData.expectedData).then((tableIndexes) => {
            workflowData.tableIndexes = tableIndexes;
        })
    })

    it('sort the number of cases column and filter with value "low"', () => {
        workflowData.sortedData = utils.sortTableByColumnName(workflowData.normalisedData, 'cases');
        workflowData.filteredData = utils.fiterTableDataByText(workflowData.sortedData, "low");
        cy.enterFilterValue("low");
        cy.sortByColumnName("cases");
        cy.validateTableHeader(workflowData);
        cy.validateTableData(workflowData);
    })

    it('sort the name column and filter with value "high"', () => {
        workflowData.sortedData = utils.sortTableByColumnName(workflowData.normalisedData, 'name');
        workflowData.filteredData = utils.fiterTableDataByText(workflowData.sortedData, "high");
        cy.enterFilterValue("high");
        cy.sortByColumnName("name");
        cy.validateTableHeader(workflowData);
        cy.validateTableData(workflowData);
    })
})