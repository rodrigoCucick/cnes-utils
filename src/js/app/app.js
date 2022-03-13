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

const mili = 500; // Constant value for JQuery transition effects.

function prepareDOM() {
    $("#divOp").hide();
    $("#opt1").prop("selected", true);
    $("#divStart").hide();
    $("#divResults").hide();
    $("#divResultAna").text("");
    $("#divResultSin").text("");
}

function resetApp() {
    XMLParser.resetFile();
    hideSuccessImgs();
    hideFileNameDOM()
    $("#btnFileSelect").text("Selecionar Arquivo");
    $("#divOp").hide(mili);
    $("#opt1").prop("selected", true);
    $("#divStart").hide(mili);
    resetResults();
}

function hideSuccessImgs() {
    $("#imgFile").hide(mili);
    $("#imgOp").hide(mili);
    $("#imgStart").hide(mili);
}

function showFileNameDOM(fileName, fileLines, fileSize) {
    $("#labelFileName").html("Arquivo selecionado: " + fileName + " (<i>" + fileLines + " linhas, " + fileSize + " bytes</i>)");
    $("#divFileName").fadeIn(mili);
}

function hideFileNameDOM() {
    $("#divFileName").fadeOut(mili);
}

function resetOpAndStartMenus() {
    $("#imgOp").hide(mili);
    $("#imgStart").hide(mili);
    $("#opt1").prop("selected", true);
    $("#divStart").hide(mili);
    resetResults();
}

function resetResults() {
    $("#divResults").fadeOut(mili);
}

function hideModalDialog() {
    $("#divModal").removeClass("show");
}

function showModalDialog(headingMsg, paragraphMsg, buttonMsg) {
    $("#headingModal").text(headingMsg);
    $("#paragraphModal").text(paragraphMsg);
    $("#btnModal").text(buttonMsg);
    $("#divModal").addClass("show");
}

function isXMLExtension(fileToCheck) {
    return fileToCheck.name.toUpperCase().endsWith(".XML");
}

function showFileInfo(fileName, fileNumLines, fileSize) {
    $("#imgFile").show(mili);
    showFileNameDOM(fileName, fileNumLines, fileSize);
    $("#btnFileSelect").text("Selecionar outro arquivo");
    resetOpAndStartMenus();
    $("#divOp").show(mili);
}

function loadFile() {
    const fileLoaded = document.getElementById("inputFile").files[0];

    // Prevents unnecessary processing if the file is the same.
    if ((XMLParser.file != null && fileLoaded != null) && (fileLoaded.name == XMLParser.file.name)) {
        return;
    }

    if (!isXMLExtension(fileLoaded)) {
        showModalDialog("Aviso", "O arquivo selecionado não possui extensão .xml!", "Fechar");
        return;
    }

    fileLoaded.text().then((fileContent) => {
        if (fileLoaded != null) {
            XMLParser.file = fileLoaded;
            XMLParser.XMLStr = fileContent;
            XMLParser.lineArr = XMLParser.XMLStr.split("\n");
            showFileInfo(XMLParser.file.name, XMLParser.lineArr.length, XMLParser.file.size);
        }
    }).catch((err) => {
        showModalDialog("Erro", "O arquivo selecionado não é válido!", "Fechar");
        resetApp();
    });
}

function prepareEvents() {
    // 0. Alias for file select.
    $("#btnFileSelect").on({
        click: () => {
            $("#inputFile").click();
        }
    });

    // 1. File select.
    $("#inputFile").on({
        change: () => {
            loadFile();
        }
    });

    // 2. Operation select.
    $("#cmbOp").on({
        change: () => {
            if ($("#cmbOp").val() != "NO_OP") {
                $("#imgOp").show(mili);
                $("#divStart").show(mili);
            } else {
                $("#imgOp").hide(mili);
                $("#divStart").hide(mili);
            }
            resetResults();
        }
    });

    // 3. Operation start.
    $("#btnStart").on({
        click: () => {
            $("#divResultAna").text("");
            $("#divResultSin").text("");
            XMLParser.executeParseOperation($("#cmbOp").val());
            $("#divResults").fadeIn(mili);
        }
    });

    // Clean selected file.
    $("#btnClean").on({
        click: () => {
            resetApp();
        }
    });

    // Close modal dialog.
    $("#btnModal").on({
        click: () => {
            hideModalDialog();
        }
    });

    /* Alignment buttons. */
    // Left.
    $("#btnAlignLeft").on({
        click: () => {
            $(".divResult").removeClass("centerAlign");
            $(".divResult").removeClass("rightAlign");
        }
    });

    // Center.
    $("#btnAlignCenter").on({
        click: () => {
            $(".divResult").addClass("centerAlign");
            $(".divResult").removeClass("rightAlign");
        }
    });

    // Right.
    $("#btnAlignRight").on({
        click: () => {
            $(".divResult").removeClass("centerAlign");
            $(".divResult").addClass("rightAlign");
        }
    });
}

$(document).ready(() => {
    prepareDOM();
    prepareEvents();
});