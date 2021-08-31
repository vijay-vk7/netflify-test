const _ = require('lodash');
import * as testData from './testData.json'

export function normaliseData(tData) {
    var tableData = _.cloneDeepWith(tData);
    for (var i = 0; i < tableData.length; i++) {
        tableData[i].name = tableData[i].name.toLowerCase();
        tableData[i].complexity = tableData[i].complexity.toLowerCase();
        [tableData[i].cases, tableData[i].casesValuesExpanded] = expandNumber(tableData[i].cases);
    }
    return tableData;
}

function expandNumber(val) {
    var multiplier = val.substr(-1).toLowerCase();
    if (multiplier == "k")
        return [parseFloat(val) * 1000, true];
    else if (multiplier == "m")
        return [parseFloat(val) * 1000000, true];
    else if (multiplier == "b")
        return [parseFloat(val) * 1000000000, true];
    else
        return [parseFloat(val), false];
}

export function collapseNumber(num) {
    if (num >= 1000 && num < 1000000)
        return (num / 1000) + 'K';
    else if (num >= 1000000 && num < 1000000000)
        return (num / 1000000).toFixed(2) + 'M';
    else if (num >= 1000000000)
        return (num / 1000000000).toFixed(2) + 'B';
    else if (num < 1000) {
        return num;
    }
}

export function sortTableByColumnName(tableData, columnName) {
    return _.sortBy(tableData, [columnName]);
}

export function fiterTableDataByText(tableData, text) {
    var filteredData = []
    for (var i = 0; i < tableData.length; i++) {
        if (tableData[i].name.includes(text) || tableData[i].complexity.includes(text))
            filteredData.push(tableData[i]);
    }
    return filteredData;
}

/**
 * This function return the array of column indexes . The approach used in finding the column index is
 * 1. Get the column name (which is shown in UI) by using the keys from table data fetched and by referring to the backEndToFrontEndNamesMapper
 * 2. find the column index value by getting index of child class 'header__item' with text $column name in the parent class 'table-header' .// for more understanding of this step refer dom of the application
 * 3. Push the column index value to the column indexes array
 * 4. Step 1-3 happens iteratively till all the column index values are fetched  
 */

export function getColumnIndexByNames(tableData) {
    var columnIndexes = [];
    return new Cypress.Promise((resolve, reject) => {
        for (var j = 0; j < Object.keys(tableData[0]).length; j++) {
            var columnName = testData.backEndToFrontEndNamesMapper[Object.keys(tableData[0])[j]];
            cy.findColumnNumberByName(columnName).then((columnIndexValue) => {
                columnIndexes.push(columnIndexValue);
                if (columnIndexes.length == Object.keys(tableData[0]).length) {
                    resolve(columnIndexes);
                }
            })
        }
    })
}
