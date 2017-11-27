var util = require('util');
var fs = require('fs');
var path = require('path');
var os = require('os');

/**
 * checkUrlEndsWith - Checks if the current URL ends with provided string.
 *
 * @param  {type} str String that the url should end with.
 */
exports.checkUrlEndsWith = function (str) {
    var url = browser.getUrl();
    expect(url).toMatch('.+' + str.replace(/[?]/g, "\\$&"));
};

/**
 *  Wait for page loading
 * @param: none
 * 
 */
exports.waitForPageLoad = function (maxWaitTime) {
    if (browser.element('.is-loading').isExisting()) {
        browser.waitForExist('.is-loading', maxWaitTime, true);
    }
    if (browser.element('.loading').isExisting()) {
        browser.waitForExist('.loading', maxWaitTime, true);
    }
    if (browser.element('#loader').isExisting()) {
        browser.waitForExist('#loader.hide', maxWaitTime);
    }
};

exports.pause = function (time) {
    // console.log('Pausing for ' + time + ' ms');
    browser.pause(time);
};

/**
 * Create a random string based on params length
 * @author Dung Pham
 * @param {string} length - The length of random string
 * Note: If length == null: create a random string based on the current time. If not, create a random string based on length 
 */
exports.randomString = function (length) {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var randomString = '';
    if (length == null) { // Return a random string with 8 characters
        for (var i = 0; i < 8; i++) randomString += possible.charAt(Math.floor(Math.random() * possible.length));
    } else { // Create a random string based on the length
        for (var i = 0; i < length; i++) randomString += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randomString;
};

/**
 * Check string matches with regexp
 * @param {String} str
 * @param {String} regexp
 * @return true/false
 */
exports.isStringMatchRegex = function (str, regexp) {
    if (str.match(regexp) != null) {
        return true;
    }
    return false;
};

/**
 * Get the first subString matches with regexp
 * @param {String} str
 * @param {String} regexp
 * @return subString
 */
exports.getStringMatchRegex = function (str, regexp) {
    return str.match(regexp)[0];
};

/**
 * Convert RGB to Hex
 * @param {String} includedRGBString - String includes the RGB
 * @return hexString
 */
exports.convertRGBToHex = function (includedRGBString) {
    var rgb = null;
    rgb = includedRGBString.match(/rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
};

/**
 * Wait for spinner disappears
 * @author Khoa Hoang
 * @param none
 */
exports.waitForSpinnerDisappear = function () {
    var analyzePage = require('../../pageObjects/analyzePage');
    if (analyzePage.iconSpinner.isVisible()) {
        analyzePage.iconSpinner.waitForVisible(true);
    }
};

/**
 * Get all countries selector on map
 * @param {string} country
 * @return {element} - Dictionary of select: {Country Name, selector string}
 */
exports.getCountriesElement = function () {
    var analyzePage = require('../../pageObjects/analyzePage');
    var returnData = {};
    var geojson = fs.readFileSync(__dirname + '/../../resources/testData/geo.json');
    var jsoncontent = JSON.parse(geojson);
    var count = Object.keys(jsoncontent.features).length;

    //List for supported countries. Define the support list to improve the performance
    var loopCountries = ['Brazil', 'China'];

    //Make sure that the map layer is added to the map    
    analyzePage.panelCountriesOnMap.waitForExist();

    for (var i = 0; i < count; i++) {
        var name_long = jsoncontent.features[i].properties.name_long;
        for (var j = 0; j < loopCountries.length; j++) {
            if (name_long == loopCountries[j]) {
                var dAttribute = browser.element(util.format("path:nth-child(%s)", i + 1)).getAttribute('d');
                returnData[name_long] = browser.element(util.format("path[d='%s']", dAttribute));
            }

        }
    }
    return returnData;
};

/**
 * Read CSV file and  and Return rows base on filters
 * @author Huy Vu
 * @param {String} fileName - the file name
 * @param {String} filters - the filter "column header:value"
 * @return {dictionary} - Return rows base on filters as Dictionary: [{Column name: Value on specific row1},{....}]
 * @example getDataFromCSVFilterByColumns('data.csv', 'country Name:US')[0]['PHI']
 */
exports.getDataFromCSVFilterByColumns = function (fileName, ...filters) {
    var os = require('os');
    var rowData = [];
    var filterDic = [];
    var rowDict = [];
    var arrayCols;
    var header;
    var flag = true;

    //read csv file
    var csvFile = fs.readFileSync(__dirname + '/../../resources/testData/' + fileName);
    // Handle for files with end of line is \n
    if (!csvFile.includes(os.EOL)) {
        csvFile = csvFile.toString().replace(/\n/g, os.EOL);
    }
    var lines = csvFile.toString().split(os.EOL);

    //Create Dictionary for header and get colum index => return columIndexs include the index of coulumns has data to filter
    header = lines[0].toString().replace(/\"/g, "").split(',');
    header.forEach(function (cellData, colIndex) {
        filters.forEach(function (elm) {
            if (elm.split(":")[0] == cellData) {
                filterDic.push({
                    columHeader: elm.split(":")[0],
                    index: colIndex,
                    value: elm.split(":")[1]
                });
            };
        });
    });

    //push data if adapt the filter
    for (var loopLinesInCSV = 1; loopLinesInCSV < lines.length; loopLinesInCSV++) {
        flag = true;
        arrayCols = lines[loopLinesInCSV].toString().replace(/\"/g, "").split(',');

        //Check row adapt the filter
        for (var objFilter of filterDic) {
            if (!(arrayCols[objFilter.index] == objFilter.value)) {
                flag = false;
                break;
            }
        };

        //if rows adapt filters, convert to dictinary and push to array to return
        if (flag) {
            rowDict = {};
            arrayCols.forEach(function (cellData, i) {
                rowDict[header[i]] = cellData;
            });
            rowData.push(rowDict);
        }
    };
    return rowData;
};

/**
 * get Exposure value (include Total Exposure, Locations) and return number
 * @author Vuong Ngo
 * @param {String} - elementObject
 * e.g. Input: "Total Exposure: $817,888" --> Output: 817888
 */
exports.getExposureNumber = function (elementObject) {
    elementObject.waitForVisible();       
    return parseFloat(elementObject.getText().match(/(\d+)/g).join(""));    
};

/**
 * get Exposure value (include Total Exposure, Locations) and return String
 * @author Vuong Ngo
 * @param {String} - elementObject
 * e.g. Input: "$817.8K" --> Output: "817.8K"
 */
exports.getExposureData = function (elementObject) {
    if (elementObject.getText().split(":")[1] == null) {
        return elementObject.getText().replace(/[$]|[,]/g, '').trim();
    } else {
        return elementObject.getText().split(":")[1].replace(/[$]|[,]/g, '').trim();
    }
};

/**
 * Scale number (large numbers can be represented using words)
 * e.g 1000 -> 1K
 * @author: Khoa Hoang
 * @param {float} num
 * @param {int} digits
 * @return {string}
 */
exports.formatNumber = function (num, digits = 1) {
    var si = [
        { value: 1E24, symbol: "Y" },
        { value: 1E21, symbol: "Z" },
        { value: 1E18, symbol: "E" },
        { value: 1E15, symbol: "P" },
        { value: 1E12, symbol: "T" },
        { value: 1E9, symbol: "B" },
        { value: 1E6, symbol: "M" },
        { value: 1E3, symbol: "K" }
    ], rx = /$|(\.[0-9]*[1-9])0+$/, i;
    for (i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
        }
    }
    return num.toFixed(digits).replace(rx, "$1");
};

/**
 * Round up number
 * Note: If a number is 0.0000 (n number of 0 in decimal), function will return 0
 * @author: Vuong Ngo
 * @param {float} number - The number that wants to convert
 * @param {int} decimalNum - Number of decimals that needs to round up
 */

exports.roundUpNumber = function (number, decimalNum) {
    if (number == 0)
        return 0;
    else
        return number.toFixed(decimalNum);
};

/**
 * Remove the specific characters from the string
 * @author: Dung Pham
 * @param {string} string: The string which we want to use
 * @param {string} characters: The character which we want to remove from string, separate by blank. E.g "%" or '$' , ','
 * @return {string}  
 */
exports.removeSpecificCharactersFromString = function (string, ...characters) {
    var returnString = string;
    var stringList = Array.from(string);

    characters.forEach(function (character) {
        var re = new RegExp('[' + character + ']', "g");
        returnString = returnString.replace(re, "");
    });
    return returnString;
};

/**
 * @author Khoa Hoang
 * @param {string} copyFile - copy file
 * @param {string} newFile - name of new file
 */
exports.copyFile = function (copyFile, newFile) {
    var dir = __dirname.split(path.sep);
    dir.splice(-2, 2);
    fs.createReadStream(dir.join('/') + constant.pathData + copyFile).pipe(fs.createWriteStream(dir.join('/') + constant.pathData + newFile));
};

/**
 * @author Khoa Hoang
 * @param {string} fileName - name of file will be delete
 */
exports.deleteFile = function (fileName) {
    var dir = __dirname.split(path.sep);
    dir.splice(-2, 2);
    fs.unlinkSync(dir.join('/') + constant.pathData + fileName);
};

/**
 * Get folder path from home dir of running machine, for example: C:\Users\ntkvuong\Downloads
 * @author Vuong Ngo
 * @param {string} folderName - ie. "Downloads"
 * @return {string} - path to folder
 */
exports.getFolderPathFromHome = function (folderName) {
    var homePath = os.homedir();
    var expectedPath = homePath + "\\" + folderName + "\\";
    var dir = expectedPath.split(path.sep);
    return dir.join('/');
};

/**
 * Delete a file from a folder
 * @author Vuong Ngo
 * @param {string} folderPath
 * @param {string} fileName - name of file will be deleted
 */
exports.deleteAFileFromAFolder = function (folderPath, fileName) {
    try {
        fs.unlinkSync(folderPath + fileName);
    } catch (error) {
        console.log("file is not existing");
    }
};

/**
 * Get list of files/sub-folders in a folder that matching regex
 * @author Vuong Ngo
 * @param {string} folderPath - folder path where stores list of files/sub-folders
 * @param {string} fileRegex - regular regex to match with file name
 * @return {array} listFilesMatchRegex
 * 
 */
exports.getListFilesMatchRegexInAFolder = function (folderPath, fileRegex) {
    var support = this;
    var files = fs.readdirSync(folderPath);
    var listFilesMatchRegex = [];
    files.forEach(function (singleFile) {
        if(support.isStringMatchRegex(singleFile, fileRegex) == true){
            listFilesMatchRegex.push(singleFile);
        }
    })
    return listFilesMatchRegex;
};

/**
 * @author Vuong Van
 * @param {string} dateString - String to check
 * @return {bool} true/false - return true if the string is in Date format
 */
exports.isDateString = function (dateString) {
    return !isNaN(Date.parse(dateString));
}

/**
 * @author Khoa Hoang
 * @param {element} upperElement - upper element
 * @param {element} underElement - under element
 * 
 */
exports.isElementDisplayUnderAnotherOne = function (upperElement, underElement) {
    upperElement.waitForVisible();
    var upperElementHeight = upperElement.getElementSize('height');
    var upperElementY = upperElement.getLocation('y');

    underElement.waitForVisible();

    var underElementY = underElement.getLocation('y');
    return ((upperElementY + upperElementHeight) <= underElementY);
};

/**
 * @author Khoa Hoang
 * @param {element} element1 - first element, display upper/left
 * @param {element} element2 - second element, display under/right
 * @param {boolean} verticalDisplay - display type, vertical/horizontal
 * 
 */
exports.isElementsPadding = function (element1, element2, verticalDisplay = true) {
    element1.waitForVisible();
    element2.waitForVisible();
    if (verticalDisplay) {
        var element1Height = element1.getElementSize('height');
        var element1Y = element1.getLocation('y');
        var element2Y = element2.getLocation('y');
        return ((element1Height + element1Y) == element2Y);
    }
    else {
        var element1Widtht = element1.getElementSize('width');
        var element1X = element1.getLocation('x');
        var element2X = element2.getLocation('x');
        return ((element1Widtht + element1X) == element2X);
    }
}

/**
 * @author Huy Vu
 * @param {element} leftElement - Element on the left
 * @param {element} rightElement - Element on the right
 */
exports.isElementDisplayLeftAnotherOne = function (leftElement, rightElement) {
    leftElement.waitForVisible();
    rightElement.waitForVisible();

    var leftElementWidth = leftElement.getElementSize('width');
    var leftElementX = leftElement.getLocation('x');
    var rightElementX = rightElement.getLocation('x');
    return ((leftElementWidth + leftElementX) <= rightElementX);
};

/**
 * Get center point of element 
 * @author Vuong Ngo
 * @param {element} element - Element to get center point
 * @return {positionOfElement} - [x, y]
 */
exports.getCenterPositionOfAnElement = function (element) {
    element.waitForVisible();

    var elementWidth = element.getElementSize('width');
    var elementHeight = element.getElementSize('height');
    var elementX = element.getLocation('x');
    var elementY = element.getLocation('y');

    var positionOfElement = [elementX + elementWidth / 2, elementY + elementHeight / 2];
    return positionOfElement;
};

/**
 * Check if centerPoint of a childElement is at bottom left of a parentElement
 * @author Vuong Ngo
 * @param {parentElement} parentElement - Element is parent element and bigger than childElement
 * @param {childElement} childElement - Element is small and displays inside parentElement
 * @return {boolean}
 */
exports.isChildElementDisplayAtBottomLeftOfParentElement = function (parentElement, childElement) {
    parentElement.waitForVisible();
    childElement.waitForVisible();

    var parentElementX = this.getCenterPositionOfAnElement(parentElement)[0];
    var parentElementY = this.getCenterPositionOfAnElement(parentElement)[1];

    var childElementX = this.getCenterPositionOfAnElement(childElement)[0];
    var childElementY = this.getCenterPositionOfAnElement(childElement)[1];

    return ((childElementX < parentElementX) && (childElementY > parentElementY));
};
/**
 * Wait for the page is done selecting
 * @author Vuong Van 
 * 
 */
exports.waitUntilUrlChanged = function () {
    var pageUrl = browser.getUrl();
    for (var i = 1; i <= 5; i++) {        
        browser.pause(300);
        if (browser.getUrl().includes(pageUrl) == false) {
            browser.pause(1000);
            break;
        }
    }
};

/**
 * @author Khoa Hoang
 * @param {element} insideEle - first element, displays inside second element
 * @param {element} outsideEle - second element
 */
exports.isElementDisplayInsideAnotherOne = function (insideElement, outsideElement) {
    outsideElement.waitForVisible();
    var outX = outsideElement.getLocation('x');
    var outY = outsideElement.getLocation('y');
    var outWidth = outsideElement.getElementSize('width');
    var outHeight = outsideElement.getElementSize('height');
    insideElement.waitForVisible();
    var insX = insideElement.getLocation('x');
    var inxY = insideElement.getLocation('y');
    var insWidth = insideElement.getElementSize('width');
    var insHeight = insideElement.getElementSize('height');
    return ((insX > outX) && ((outX + outWidth) > (insX + insWidth)) && (inxY > outY) && ((outY + outHeight) > (inxY + insHeight)));
}


/**
     * Check 2 elements are aligned by top of elements
     * @param {element} firstElement
     * @param {element} secondElement
     * @return {boolean}
     */
exports.isElementsAreTopAligned = function (firstElement, secondElement) {
    var yFirstElement = firstElement.getLocation('y');
    var ySecondElement = secondElement.getLocation('y');
    return yFirstElement == ySecondElement;
}

/**
     * Check 2 elements are aligned by left of elements
     * @param {element} firstElement
     * @param {element} secondElement
     * @return {boolean}
     */
exports.isElementsAreLeftAligned = function (firstElement, secondElement) {
    var xFirstElement = firstElement.getLocation('x');
    var xSecondElement = secondElement.getLocation('x');
    return xFirstElement == xSecondElement;
}

/**
 * Find matching values in two arrays 
 * @author Vuong Ngo
 * @param {array} array1 - List of values 
 * @param {array} array2 - List of values
 * @return {array} array - List of matching values
 */
exports.getMatchBetweenTwoArrays = function (array1, array2) {
    var matches = [];
    for (var i = 0; i < array1.length; i++) {
        for (var j = 0; j < array2.length; j++) {
            if (array1[i] == array2[j]) matches.push(array1[i]);
        }
    }
    return matches;
};

/**
 * Capture screenshot of an element (backup action)
 * @author Vuong Ngo
 * @param {path} imageFilePath - path to save screenshot
 * @param {element} element - element must be string
 */

exports.captureAScreenshotForAnElement = function (imageFilePath, element) {
    wdioScreenshot.init(browser);
    browser.saveElementScreenshot(imageFilePath, element);
}

/**
 * Get difference item from 2 arrays 
 * @param {array} array1 - For example: array1 = ['a', 'b', 'c']
 * @param {array} array2 - For example: array2 = ['a']
 * @return {array} array - Return fullArray = ['b', 'c']
 */

exports.getUniqueValueFromTwoArrays = function (array1, array2) {
    var fullArray = [];
    var subArray = [];
    if (array1.length >= array2.length) {
        array1 = fullArray;
        array2 = subArray;
    } else {
        array1 = subArray;
        array2 = fullArray
    };

    fullArray = fullArray.filter(function (item) {
        return !subArray.includes(item);
    });
    return fullArray;
}

/**
 * Get unique values from an array
 * @author Vuong Van
 * @param {array} input array
 * @return {array} return the array with distinct values
 */
exports.getDistinctValue = function (array) {
    var returnArray = [];
    for (var i = 0; i < array.length; i++) {
        if (returnArray.indexOf(array[i]) == -1) returnArray.push(array[i]);
    }
    return returnArray;
}

/**
 * Compare 2 arrays
 * @param {array} inputArray
 * @param {array} compareArray
 * @return {boolean}
 */
exports.compareArray = function (inputArray, compareArray) {    
    if (inputArray.length != compareArray.length) {
        return false;
    }
    for (var i = 0; i < inputArray.length; i++) {
        if (inputArray[i] != compareArray[i]) {
            return false;
        }
    }
    return true;
};

/**
 * Sort a number array, which contains the special character in array element
 * Example: Array=[1, 2, 8, '-', 5, '-']
 * @author - Vuong Van
 * @param {array} inputArray
 * @param {array} sortBy
 * @param {array} specialChar
 * @return {array} array is sorted
 */
exports.sortNumberArrayWithSpecialCharacter = function (inputArray, sortBy, specialChar) {
    var returnArray = [];
    returnArray = inputArray.sort(function sortNumber(a, b) {
        if (a == specialChar && b != specialChar)
            return -1;
        else if (a != specialChar && b == specialChar)
            return 1;
        else
            return a - b;
    });
    if (sortBy == 'ascending') {
        return returnArray;
    } else {
        return returnArray.reverse();
    }
};

/**
 * Sort array of Date
 * @author - Vuong Van
 * @param {array} inputArray
 * @param {array} sortBy
 */
exports.sortDateArray = function (inputArray, sortBy) {
    var returnArray = inputArray.sort(function (a, b) {
        return new Date(a) - new Date(b);
    });

    if (sortBy == 'ascending') {
        return returnArray;
    } else {
        return returnArray.reverse();
    }
};

/**
 * get Header row from a CSV
 * @param {String} - filename
 * @author Huy Vu
 */
exports.getHeaderRowFromCSVFile = function (fileName) {
    var os = require('os');

    var csvFile = fs.readFileSync(__dirname + '/../../resources/testData/' + fileName);
    if (!csvFile.includes(os.EOL)) {
        csvFile = csvFile.toString().replace(/\n/g, os.EOL);
    }

    var lines = csvFile.toString().split(os.EOL);
    var header = lines[0].toString().replace(/\"/g, "").split(',');

    return header;
};