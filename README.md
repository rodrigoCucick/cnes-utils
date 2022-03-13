# Utilidades CNES
Aplicação web que permite a realização de diferentes análises no arquivo XML do CNES (Cadastro Nacional de Estabelecimentos de Saúde) em apenas 3 etapas.

**1. Escolha do arquivo XML:**
![image](https://user-images.githubusercontent.com/16089829/158038502-40898f2b-9ac2-4a9c-a785-c6f16943a9bb.png)

**2. Escolha da operação de análise a ser realizada:**
![image](https://user-images.githubusercontent.com/16089829/158038515-7988ae9d-da7d-4238-8bfe-b09fb21ac5b8.png)

**3. Execução da análise:**
![image](https://user-images.githubusercontent.com/16089829/158038574-5787e29d-9894-4084-8e5c-e5a0639a12d6.png)

Link: https://rodrigocucick.github.io/cnes-utils/

Tanto para fins de segurança quanto para fins de necessidade (já que o GitHub Pages não suporta server-side code), todo o processamento de dados, desde a seleção do arquivo XML até o resultado final, é realizado diretamente no navegador do usuário (client-side).

**Prioridades atuais de desenvolvimento:**
1. Adicionar mais tipos de análise do arquivo XML do CNES. [CRÍTICA]
2. Utilizar as facilidades da biblioteca JQuery para o XML parsing. [CRÍTICA]
3. Adicionar botão para exportar os resultados da análise realizada. [ALTA]
4. Categorizar as análises (não utilizar apenas um único _combo box_ para todas elas).

_Aplicação em constante desenvolvimento, portanto, num primeiro momento talvez a documentação não acompanhe as rápidas iterações de versões._
