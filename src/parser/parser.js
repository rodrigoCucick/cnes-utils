/*
 *  MIT License
 *  
 *  Copyright (c) 2022 Rodrigo M. Cucick
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

const XMLParser = {
    file:    null, // The loaded file.
    XMLStr:  null, // A str containing all the text from the loaded file.
    lineArr: null, // An array of str lines from the XMLStr.

    // TODO - Rodrigo: Write DOCs for the functions.

    resetFile: function() {
        this.file    = null;
        this.XMLStr  = null;
        this.lineArr = null;
    },

    // Returns an str array with XML elements or -1 if not found.
    findXMLElem: function(searchElem) {
        const startElem = "<" + searchElem.toUpperCase();
        const endElem   = "</" + searchElem.toUpperCase() + ">";
    
        let elemDataArr    = [];
        let elemData       = "";
        let startElemFound = false;
        for (let i = 0; i < this.lineArr.length; i++) {
            if (!startElemFound && this.lineArr[i].toUpperCase().indexOf(startElem) > 0) {
                elemData = this.lineArr[i];
                startElemFound = true;
                continue;
            }
    
            if (startElemFound) {
                elemData += this.lineArr[i];
                if (this.lineArr[i].toUpperCase().indexOf(endElem) > 0) {
                    elemDataArr.push(elemData);
                    startElemFound = false;
                }
            }
        }

        return elemDataArr.length > 0 ? elemDataArr : -1;
    },

    // Returns an str array with XML properties or -1 if not found.
    findXMLProp: function(searchProp) {
        searchProp += '="';

        let propArr = [];
        for (let i = 0; i < this.lineArr.length; i++) {
            let indexOfProp = this.lineArr[i].toUpperCase().indexOf(searchProp.toUpperCase());
    
            if (indexOfProp > 0) {
                let startPoint = indexOfProp + searchProp.length;
                let endPoint =  this.lineArr[i].toUpperCase().indexOf('"', startPoint);
                let prop = this.lineArr[i].toUpperCase().substring(startPoint, endPoint);
                propArr.push(prop);
            }
        }

        return propArr.length > 0 ? propArr : -1;
    },

    // Same as findXMLProp, but uses a custom line array to search the specified property.
    findXMLPropCustomLineArray: function(searchProp, customLineArray) {
        searchProp += '="';

        let propArr = [];
        for (let i = 0; i < customLineArray.length; i++) {
            let indexOfProp = customLineArray[i].toUpperCase().indexOf(searchProp.toUpperCase());
    
            if (indexOfProp > 0) {
                let startPoint = indexOfProp + searchProp.length;
                let endPoint =  customLineArray[i].toUpperCase().indexOf('"', startPoint);
                let prop = customLineArray[i].toUpperCase().substring(startPoint, endPoint);
                propArr.push(prop);
            }
        }

        return propArr.length > 0 ? propArr : -1;
    },

    // TODO - Rodrigo: Add more operation types [MAIN OBJECTIVE].
    executeParseOperation: function(opCode) {
        let propArr = [];

        // TODO - Rodrigo: Add validation when no results found; if arr.len == 0.
        // TODO - Rodrigo: Change to if statements instead of switch (cleaner aspect).
        switch (opCode) {
            case "ESTAB":
                propArr = this.findXMLProp("NOME_FANTA");
    
                if (propArr.length > 0) {
                    propArr.sort();
                    
                    $("#divResultSin").html("Total de estabelecimentos: <b>" + propArr.length + "</b>");
                    $("#divResultAna").html("Lista de estabelecimentos (<i>em ordem alfabética<i>):<br>");
                    
                    for (let i = 0; i < propArr.length; i++) {
                        $("#divResultAna").append("<br>" + propArr[i]);
                    }
                }
    
                break;
            case "PROF":
                propArr = this.findXMLProp("NOME_PROF", propArr);
    
                if (propArr.length > 0) {
                    propArr.sort();
                    const uniqueProps = [...new Set(propArr)];
    
                    $("#divResultSin").html("Total de profissionais distintos: <b>" + uniqueProps.length + "</b><br>");
                    $("#divResultSin").append("Total geral de profissionais (<i>um profissional pode estar lotado em mais de um estabelecimento</i>): <b>" + propArr.length + "</b>");
                    $("#divResultAna").html("Lista de profissionais distintos (<i>em ordem alfabética<i>):<br>");
                    
                    for (let i = 0; i < uniqueProps.length; i++) {
                        $("#divResultAna").append("<br>" + uniqueProps[i]);
                    }
                }
    
                break;
            case "PROF_NO_CNS":          
                break;
            case "NO_OP":
                break;
            default:
                break;
        }
    }
};