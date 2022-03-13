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
    findXMLElem: function(searchElem, strArr = null) {
        if (strArr == null) {
            strArr = this.lineArr;
        }

        const startElem = "<" + searchElem.toUpperCase();
        const endElem   = "</" + searchElem.toUpperCase() + ">";
    
        let elemDataArr    = [];
        let elemData       = "";
        let startElemFound = false;

        for (let i = 0; i < strArr.length; i++) {
            if (!startElemFound && strArr[i].toUpperCase().indexOf(startElem) > 0) {
                elemData = strArr[i];
                startElemFound = true;
                continue;
            }
    
            if (startElemFound) {
                elemData += strArr[i];
                if (strArr[i].toUpperCase().indexOf(endElem) > 0) {
                    elemDataArr.push(elemData);
                    startElemFound = false;
                }
            }
        }

        return elemDataArr;
    },

    // Returns an str array with XML properties or -1 if not found.
    findXMLProp: function(searchProp, strArr = null) {
        if (strArr == null) {
            strArr = this.lineArr;
        }
        
        searchProp += '="';

        let propArr = [];

        for (let i = 0; i < strArr.length; i++) {
            let indexOfProp = strArr[i].toUpperCase().indexOf(searchProp.toUpperCase());
    
            if (indexOfProp > 0) {
                let startPoint = indexOfProp + searchProp.length;
                let endPoint =  strArr[i].toUpperCase().indexOf('"', startPoint);
                let prop = strArr[i].toUpperCase().substring(startPoint, endPoint);
                propArr.push(prop);
            }
        }

        return propArr;
    },

    estabOP: function() {
        let dataArr = [];

        $(this.XMLStr).find('DADOS_GERAIS_ESTABELECIMENTOS').each(function(index) {
            dataArr[index] = [
                $(this).attr('NOME_FANTA'),
                $(this).attr('CNES'),
                $(this).find('DADOS_PROFISSIONAIS').length
            ];
        });

        if (dataArr.length > 0) {
            $('#divResultAna').html('Lista de estabelecimentos:<br><br>');
        
            for (let i = 0; i < dataArr.length; i++) {
                $('#divResultAna').append((i + 1) + ' - Nome: ' + dataArr[i][0] + '<ul><li>CNES: ' + dataArr[i][1] + '</li><li>Total de profissionais lotados: ' + dataArr[i][2] + '</li></ul>');
            }
    
            $("#divResultSin").html("Total de estabelecimentos: <b>" + dataArr.length + "</b>");
        }
    },

    profOP: function() {
        let propArr = this.findXMLProp("NOME_PROF");
    
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
    },

    // TODO - Rodrigo: Add more operation types [MAIN OBJECTIVE].
    // TODO - Rodrigo: Use JQuery for every XML doc manipulation.
    executeParseOperation: function(opCode) {
        if (opCode == "ESTAB") {
            this.estabOP();
        } else if (opCode == "PROF") {
            this.profOP();
        } else if (opCode == "PROF_NO_CNS") {
            //
        }
    }
};