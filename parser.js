$(document).ready(() => {
    $("#divOp").hide();
    $("#opt1").prop("selected", true);
    $("#divStart").hide();

    $("#btnFileSelect").on({
        click: () => {
            $("#divOp").show(500);
        }
    })

    $("#cmbOp").on({
        change: () => {
            $("#divStart").show(500);
        }
    })
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