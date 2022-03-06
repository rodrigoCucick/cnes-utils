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

function isXMLValid(file) {
    // TODO - Rodrigo: Implement new validation for valid XML file.
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

            // Validate if the selected file is a valid XML file.
            if (!isXMLValid(fileLoaded)) {
                // TODO - Rodrigo: Treat incompatible file extension.
                console.log("Arquivo selecionado não é XML!");
                return;
            }

            $("#imgFile").show(MILI);
            showFileNameDOM(fileLoaded.name, fileLoaded.size);
            $("#btnFileSelect").text("Selecionar Outro Arquivo");
            resetOpAndStartMenus();

            const filePromisse = fileLoaded.text();
            
            filePromisse.then((fileContent) => {
                if (fileLoaded != null) {
                    file = fileLoaded;
                    XMLStr = fileContent;
                    $("#divOp").show(MILI);
                }
            }).catch((err) => {
                // TODO - Rodrigo: Treat error message.
                console.log(err);
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
}

$(document).ready(() => {
    prepareDOM();
    prepareEvents();
});

/* //xmlns="http://javafx.com/javafx/8.0.291" xmlns:fx="http://javafx.com/fxml/1"

public class Controller {
    private File xml;

    //@FXML private Button btn_analisar;
    @FXML private Button btn_gravar;
    //@FXML private Button btn_selecionar;
    @FXML private CheckBox chkb_exibir_unidades;
    @FXML private CheckBox chkb_exibir_linhas;
    @FXML private TextArea txta_resultado;
    @FXML private TextField txtf_selecionar;

    // Abre um diálogo simples para escolha de arquivo.
    @FXML public void seleciona() {
        JFileChooser fc = new JFileChooser();
        fc.setDialogTitle("Selecione o arquivo XML do CNES");
        fc.setCurrentDirectory(new File("."));
        int status = fc.showOpenDialog(null);
        if (status == JFileChooser.APPROVE_OPTION) {
            xml = fc.getSelectedFile();
            txtf_selecionar.setText(xml.toString());
        } else if (status == JFileChooser.ERROR_OPTION) {
            txtf_selecionar.setText("Ocorreu um erro durante a escolha do arquivo.");
        }
    }

    // Analisa o arquivo XML selecionado, identificando os profissionais sem CNS.
    @FXML public void analisa() throws java.io.IOException {
        btn_gravar.setDisable(true);
        if (xml != null) {
            if (validaXML()) {
                BufferedReader bf = new BufferedReader(new FileReader(xml));

                String cabLinha = (chkb_exibir_linhas.isSelected()) ? "LINHA - " : "";
                String cabUnidade = (chkb_exibir_unidades.isSelected()) ? " - UNIDADE" : "";
                txta_resultado.setText("Profissionais sem CNS:\n\n");
                txta_resultado.appendText(cabLinha + "PROFISSIONAL" + cabUnidade + "\n\n");

                String linha, nomeUnidade = "";
                int numLinha = 1, numProfSemCNS = 0;
                while ((linha = bf.readLine()) != null) {
                    // Apenas verifica o nome da unidade de saúde caso a checkbox correspondente estiver marcada.
                    if (chkb_exibir_unidades.isSelected() && linha.contains("NOME_FANTA")) {
                        nomeUnidade = " - " + extraiCampo("NOME_FANTA", linha);
                    }
                    // Verifica se o campo COD_CNS e só então imprime na tela o informativo.
                    if (linha.contains("COD_CNS=\"\"")) {
                        String numeroLinha = chkb_exibir_linhas.isSelected() ? numLinha + " - " : "";
                        txta_resultado.appendText(numeroLinha + extraiCampo("NOME_PROF", linha) + nomeUnidade + "\n");
                        numProfSemCNS++;
                    }
                    numLinha++;
                }
                txta_resultado.appendText("\nTotal de registros sem CNS: " + numProfSemCNS);
                txta_resultado.appendText("\nTotal de linhas analisadas: " + numLinha);
                btn_gravar.setDisable(false);
            } else {
                txta_resultado.setText("O arquivo selecionado não é um XML válido.");
            }
        } else {
            txta_resultado.setText("Nenhum arquivo selecionado!");
        }
    }

    // Escreve o resultado da análise (txta_resultado.getText()) em um arquivo.
    @FXML public void grava() throws java.io.IOException {
        JFileChooser fc = new JFileChooser();
        fc.setDialogTitle("Selecione um local para salvar o arquivo");
        fc.setCurrentDirectory(new File("."));
        fc.setSelectedFile(new File("analise-xml.txt"));
        int status = fc.showSaveDialog(null);
        if (status == JFileChooser.APPROVE_OPTION && fc.getSelectedFile() != null) {
            File saida = new File(fc.getSelectedFile().getAbsolutePath());
            FileWriter fw = new FileWriter(saida);
            fw.write(txta_resultado.getText());
            fw.close();
        } else if (status == JFileChooser.ERROR_OPTION) {
            // Tratar o erro posteriormente.
        }
    }

    // Retorna o valor no campo XML utilizado como argumento.
    // Análise do campo é iniciada após a primeira ocorrência do caractere "
    // após o nome do campo e termina ao encontrar o segundo caractere ".
    private String extraiCampo(String campo, String linha) {
        StringBuilder sb = new StringBuilder();
        int i = linha.indexOf(campo) + (campo.length() + 2);
        char[] ch = linha.toCharArray();
        while (ch[i] != '\"') {
            sb.append(ch[i]);
            i++;
        }
        return sb.toString();
    }

    // Valida se o XML é válido. As checagens realizadas são, até o momento, as seguintes:
    // 1 - Extensão do arquivo deve ser XML.
    // 2 - Deve possuir um prolog XML válido na primeira linha do documento (padrão CNES).
    private boolean validaXML() throws java.io.IOException {
        boolean is_valido = false;
        if(xml.toString().toLowerCase().endsWith(".xml")) {
            BufferedReader bf = new BufferedReader(new FileReader(xml));
            String prolog = bf.readLine();
            if (prolog.startsWith("<?xml version=") && prolog.endsWith("?>")) {
                is_valido = true;
            }
        }
        return is_valido;
    }
} */