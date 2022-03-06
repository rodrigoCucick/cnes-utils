const MILI = 500;
var file = null;
var XMLStr = null;

function resetFile() {
    file = null;
    XMLStr = null;
}

function prepareDOM() {
    $("#divOp").hide();
    $("#opt1").prop("selected", true);
    $("#divStart").hide();
    $("#divResults").hide();
    $("#txtaResultAna").val("");
    $("#txtaResultSin").val("");
}

function resetApp() {
    resetFile();
    hideSuccessImgs();
    hideFileNameDOM()
    $("#btnFileSelect").text("Selecionar Arquivo");
    $("#divOp").hide(MILI);
    $("#opt1").prop("selected", true);
    $("#divStart").hide(MILI);
    resetResults();
}

function hideSuccessImgs() {
    $("#imgFile").hide(MILI);
    $("#imgOp").hide(MILI);
    $("#imgStart").hide(MILI);
}

function showFileNameDOM(fileName, fileSize) {
    $("#labelFileName").html("Arquivo selecionado: " + fileName + "<i> (" + fileSize + "bytes)</i>");
    $("#divFileName").fadeIn(MILI);
}

function hideFileNameDOM() {
    $("#divFileName").fadeOut(MILI);
}

function resetOpAndStartMenus() {
    $("#imgOp").hide(MILI);
    $("#imgStart").hide(MILI);
    $("#opt1").prop("selected", true);
    $("#divStart").hide(MILI);
    resetResults();
}

function resetResults() {
    $("#divResults").fadeOut(MILI);
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
    if (!file.name.toUpperCase().endsWith(".XML")) {
        return false;
    }
    return true;
}

function parseXML(opCode) {
    const lineArray = XMLStr.split("\n");

    switch (opCode) {
        case "ESTAB":
            const searchProp = 'NOME_FANTA="';
            let propArr = [];
            for (let i = 0; i < lineArray.length; i++) {
                let indexOfProp = lineArray[i].toUpperCase().indexOf(searchProp);

                if (indexOfProp > 0) {
                    let startPoint = indexOfProp + searchProp.length;
                    let endPoint =  lineArray[i].toUpperCase().indexOf('"', startPoint);
                    let estab = lineArray[i].toUpperCase().substring(startPoint, endPoint);
                    propArr.push(estab);
                }
            }

            if (propArr.length > 0) {
                propArr.sort();
                $("#txtaResultSin").val("Total de estabelecimentos: " + propArr.length);
                $("#txtaResultAna").val("Lista de estabelecimentos (em ordem alfabética):\n");
                
                for (let i = 0; i < propArr.length; i++) {
                    $("#txtaResultAna").val($("#txtaResultAna").val() + "\n" + propArr[i]);
                }
            }
            break;
        case "PROF":
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

            $("#imgFile").show(MILI);
            showFileNameDOM(fileLoaded.name, fileLoaded.size);
            $("#btnFileSelect").text("Selecionar outro arquivo");
            resetOpAndStartMenus();

            const filePromisse = fileLoaded.text();
            
            filePromisse.then((fileContent) => {
                if (fileLoaded != null) {
                    file = fileLoaded;
                    XMLStr = fileContent;
                    $("#divOp").show(MILI);
                }
            }).catch((err) => {
                showModalDialog("Erro", "O arquivo selecionado não é válido!", "Fechar");
                resetApp();
            });
        }
    });

    $("#btnFileSelect").on({
        click: () => {
            $("#inputFile").click();
        }
    });

    // 2. Operation select.
    $("#cmbOp").on({
        change: () => {
            if ($("#cmbOp").val() != "NO_OP") {
                $("#imgOp").show(MILI);
                $("#divStart").show(MILI);
            } else {
                $("#imgOp").hide(MILI);
                $("#divStart").hide(MILI);
            }
            resetResults();
        }
    });

    // 3. Operation start.
    $("#btnStart").on({
        click: () => {
            $("#txtaResultAna").val("");
            $("#txtaResultSin").val("");
            parseXML($("#cmbOp").val());
            $("#divResults").fadeIn(MILI);
        }
    });

    // X. Clean selected file.
    $("#btnClean").on({
        click: () => {
            resetApp();
        }
    });

    // X. Close modal dialog
    $("#btnModal").on({
        click: () => {
            hideModalDialog();
        }
    });
}

$(document).ready(() => {
    prepareDOM();
    prepareEvents();
});