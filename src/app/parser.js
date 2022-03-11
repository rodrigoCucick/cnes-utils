const mili = 500;
var file = null;
var XMLStr = null;
var lineArray = null;

function resetFile() {
    file = null;
    XMLStr = null;
    lineArray = null;
}

function prepareDOM() {
    $("#divOp").hide();
    $("#opt1").prop("selected", true);
    $("#divStart").hide();
    $("#divResults").hide();
    $("#divResultAna").text("");
    $("#divResultSin").text("");
}

function resetApp() {
    resetFile();
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

function isXMLExtension(file) {
    return file.name.toUpperCase().endsWith(".XML");
}

function findXMLElem(searchElem, elemDataArr) {
    const startElem = "<" + searchElem.toUpperCase();
    const endElem = "</" + searchElem.toUpperCase() + ">";

    let elemData = "";
    let startElemFound = false;
    for (let i = 0; i < lineArray.length; i++) {
        if (!startElemFound && lineArray[i].toUpperCase().indexOf(startElem) > 0) {
            elemData = lineArray[i];
            startElemFound = true;
            continue;
        }

        if (startElemFound) {
            elemData += lineArray[i];
            if (lineArray[i].toUpperCase().indexOf(endElem) > 0) {
                elemDataArr.push(elemData);
                startElemFound = false;
            }
        }
    }
}

function findXMLProp(searchProp, propArr) {
    searchProp += '="';
    for (let i = 0; i < lineArray.length; i++) {
        let indexOfProp = lineArray[i].toUpperCase().indexOf(searchProp.toUpperCase());

        if (indexOfProp > 0) {
            let startPoint = indexOfProp + searchProp.length;
            let endPoint =  lineArray[i].toUpperCase().indexOf('"', startPoint);
            let prop = lineArray[i].toUpperCase().substring(startPoint, endPoint);
            propArr.push(prop);
        }
    }
}

function findXMLPropCustomLineArray(searchProp, propArr, customLineArray) {
    searchProp += '="';
    for (let i = 0; i < customLineArray.length; i++) {
        let indexOfProp = customLineArray[i].toUpperCase().indexOf(searchProp.toUpperCase());

        if (indexOfProp > 0) {
            let startPoint = indexOfProp + searchProp.length;
            let endPoint =  customLineArray[i].toUpperCase().indexOf('"', startPoint);
            let prop = customLineArray[i].toUpperCase().substring(startPoint, endPoint);
            propArr.push(prop);
        }
    }
}

function parseXML(opCode) {
    let elemDataArr = [];
    let propArr = [];

    // TODO - Rodrigo: Add validation when no results found; if arr.len == 0.
    switch (opCode) {
        case "ESTAB":
            findXMLProp("NOME_FANTA", propArr);

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
            findXMLProp("NOME_PROF", propArr);

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
            const fileLoaded = document.getElementById("inputFile").files[0];

            // Prevents unnecessary processing if the file is the same.
            if ((file != null && fileLoaded != null) && (fileLoaded.name == file.name)) {
                return;
            }

            if (!isXMLExtension(fileLoaded)) {
                showModalDialog("Aviso", "O arquivo selecionado não possui extensão .xml!", "Fechar");
                return;
            }

            fileLoaded.text().then((fileContent) => {
                if (fileLoaded != null) {
                    file = fileLoaded;
                    XMLStr = fileContent;
                    lineArray = XMLStr.split("\n");

                    $("#imgFile").show(mili);
                    showFileNameDOM(fileLoaded.name, lineArray.length, fileLoaded.size);
                    $("#btnFileSelect").text("Selecionar outro arquivo");
                    resetOpAndStartMenus();
                    $("#divOp").show(mili);
                }
            }).catch((err) => {
                showModalDialog("Erro", "O arquivo selecionado não é válido!", "Fechar");
                resetApp();
            });
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
            parseXML($("#cmbOp").val());
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