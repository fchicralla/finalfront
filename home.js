var templateFoto = `<img src="{{LINKFOTO}}" width="200">`;
var templateInfo = `<b>Nome:</b> {{NOME}} <br>
                    <b>Email:</b> {{EMAIL}} <br>
                    <b>Racf:</b> {{RACF}} <br>
                    <b>Funcional:</b> {{FUNCIONAL}} <br>
                    <b>Departamento:</b> {{DEPTO}} <br>`

function carregarInfodoUsuario(){
    var usrSRT = localStorage.getItem("ScheduleUSER");
    if (!usrSRT){
        window.location="index.html";
    }
    else{
        var user = JSON.parse(usrSRT);
        console.log(user.linkFoto)
        document.getElementById("fotoUSER").innerHTML = templateFoto.replace("{{LINKFOTO}}",user.linkFoto)
        document.getElementById("infoUSER").innerHTML = templateInfo.replace("{{NOME}}",user.nome).replace("{{EMAIL}}",user.email).replace("{{RACF}}",user.racf).replace("{{FUNCIONAL}}",user.funcional).replace("{{DEPTO}}",user.depto.nome + " \\ " + user.depto.unidade)
    }

    carregaAgencias()
}

function carregaAgencias(){
    fetch("http://agendamento-pessoal.herokuapp.com/agencias")
        .then(res => res.json())
        .then(listaAgencias => preencheCombobox(listaAgencias));

}

function preencheCombobox(listaAgencias){
    var templateSelect = `<select class="form-group" id="txtAgencia"> {{OPCOES}} </select>`;
    var templateOption = `<option value="{{VALOR}}"> {{NOME}} </option>`;

    var opcoes="";
    for (i=0;i<listaAgencias.length;i++){
        var ag = listaAgencias[i];
        opcoes+=templateOption.replace("{{VALOR}}",ag.id).replace("{{NOME}}",ag.nome);
    }
    document.getElementById("selectDasAgencias").innerHTML = templateSelect.replace("{{OPCOES}}",opcoes);
    //console.log(opcoes)
}

function gerarRelatorio(){
    var combinacao = 0;
    if (document.getElementById("selectAgencia").checked){
        combinacao+=1;//document.getElementById("selectAgencia").nodeValue;
    }

    if (document.getElementById("selectData").checked){
        combinacao+=2;//document.getElementById("selectData").nodeValue;
    }

    if (document.getElementById("selectCliente").checked){
        combinacao+=4;//document.getElementById("selectCliente").nodeValue;
    }

    //console.log("Combinacao  = "+combinacao);
    var txtagencia=document.getElementById("txtAgencia").value;
    console.log(txtagencia);
    var txtcliente=document.getElementById("nomeCliente").value;
    var txtdata=document.getElementById("dateAgendamento").value;
    
    switch (combinacao) {
        case 0:
            fetch("http://agendamento-pessoal.herokuapp.com/agendamentos/todos")
                .then(res => res.json())
                .then(listaAgendamentos => preencheRelatorio(listaAgendamentos));
            break;
        case 1:
            fetch("http://agendamento-pessoal.herokuapp.com/agendamentos/filtrarporagencia?agencia=" + txtagencia)
                .then(res => res.json())
                .then(listaAgendamentos => preencheRelatorio(listaAgendamentos));
            break;
        case 2:
            fetch("http://agendamento-pessoal.herokuapp.com/agendamentos/filtrarpordataagendamento?dataAgendamento=" + txtdata)
                .then(res => res.json())
                .then(listaAgendamentos => preencheRelatorio(listaAgendamentos));
            break;
        case 3:
            fetch("http://agendamento-pessoal.herokuapp.com/agendamentos/filtrarporagenciaedata?agencia=" + txtagencia + "&dataAgendamento=" + txtdata)
                .then(res => res.json())
                .then(listaAgendamentos => preencheRelatorio(listaAgendamentos));
            break;
        case 4:
            fetch("http://agendamento-pessoal.herokuapp.com/agendamentos/filtrarporcliente?nomecli=" + txtcliente)
                .then(res => res.json())
                .then(listaAgendamentos => preencheRelatorio(listaAgendamentos));
            break;
        case 5:
            fetch("http://agendamento-pessoal.herokuapp.com/agendamentos/filtrarporclienteeagencia?nomecli=" + txtcliente + "&agencia=" + txtagencia)
                .then(res => res.json())
                .then(listaAgendamentos => preencheRelatorio(listaAgendamentos));
            break;
        case 6:
            fetch("http://agendamento-pessoal.herokuapp.com/agendamentos/filtrarporclienteedata?nomecli=" + txtcliente + "&dataAgendamento=" + txtdata)
                .then(res => res.json())
                .then(listaAgendamentos => preencheRelatorio(listaAgendamentos));
            break;
        case 7:
            fetch("http://agendamento-pessoal.herokuapp.com/agendamentos/filtrarporagenciaedataecliente?agencia=" + txtagencia + "&dataAgendamento=" + txtdata + "&nomecli=" + txtcliente)
                .then(res => res.json())
                .then(listaAgendamentos => preencheRelatorio(listaAgendamentos));
            break;
        default:
            document.getElementById("relatorio").innerHTML = "<h3>Erro ao resgatar o relatorio</h3>"
      }

}

function salvarLista(objeto){
    var objSTR = JSON.stringify(objeto);
    localStorage.setItem("ReportJSON",objSTR);
}

function preencheRelatorio(listaAgendamentos){
    //console.log(listaAgendamentos);
    var templateTable = `<table class="table" id="tabelaAgendamentos"> 
                            <thead> 
                                {{TABLE_HEADER}} 
                            </thead> 
                            <tbody> 
                                {{TABLE_BODY}} 
                            </tbody> 
                        </table>`;
    var templateLine = `<tr>
                            <th scope="row">{{LINHA}}</th>
                            <td>{{NOME_CLIENTE}}</td> 
                            <td>{{EMAIL_CLIENTE}}</td>
                            <td>{{CELULAR_CLIENTE}}</td>
                            <td>{{DATA_AGENDAMENTO}}</td>
                            <td>{{HORA_AGENDAMENTO}}</td>
                            <td>{{OBSERVACOES}}</td>
                            <td>{{AGENCIA}}</td>
                        </tr>`;
    var tableHeader = `<tr>
                            <th scope="col">#</th>
                            <th scope="col">Cliente</th> 
                            <th scope="col">Email</th>
                            <th scope="col">Celular</th>
                            <th scope="col">Data do Agendamento</th>
                            <th scope="col">Hora do Agendamento</th>
                            <th scope="col">Observacoes</th>
                            <th scope="col">Agencia</th>
                        </tr>`;
    
    var tableBody=""
    for (i=0; i<listaAgendamentos.length;i++){
        var agend = listaAgendamentos[i];
        console.log("Item" + i);
        console.log(agend);
        tableBody+=templateLine.replace("{{LINHA}}",i)
                                .replace("{{NOME_CLIENTE}}",agend.nomeCliente)
                                .replace("{{EMAIL_CLIENTE}}",agend.emailCliente)
                                .replace("{{CELULAR_CLIENTE}}",agend.celularCliente)
                                .replace("{{DATA_AGENDAMENTO}}",agend.dataAgendamento)
                                .replace("{{HORA_AGENDAMENTO}}",agend.horaAgendamento)
                                .replace("{{OBSERVACOES}}",agend.observacoes)
                                .replace("{{AGENCIA}}",agend.agencia.nome);
    }
    var tableFinal=templateTable.replace("{{TABLE_HEADER}}",tableHeader).replace("{{TABLE_BODY}}",tableBody);
    //console.log(tableFinal);
    document.getElementById("relatorio").innerHTML = tableFinal;
    salvarLista(listaAgendamentos);

    var x = document.getElementById("csvButton");
    x.style.display = "inline";

    var y = document.getElementById("pdfButton");
    y.style.display = "inline";

}

function deslogar(){
    localStorage.removeItem("ScheduleUSER");
    localStorage.removeItem("ReportJSON");
    window.location="home.html";
}

function download_table_as_csv() {
    var json = JSON.parse(localStorage.getItem("ReportJSON"));

    for(i=0;i<json.length;i++){
        json[i].agencia=json[i].agencia.nome;
    }
    var fields = Object.keys(json[0])
    var replacer = function(key, value) { return value === null ? '' : value } 
    var csv =  json.map(function(row){
      return fields.map(function(fieldName){
        return JSON.stringify(row[fieldName], replacer)
      }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column
    csv = csv.join('\r\n');
    console.log(csv)

    
    // Download it
    var filename = 'export_' + new Date().toLocaleDateString() + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); 
}

//Create PDf from HTML...
function CreatePDFfromHTML() {
    /*var HTML_Width = $(".html-content").width();
    var HTML_Height = $(".html-content").height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + (top_left_margin * 2);
    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    var specialElementHandlers = {
        "#editor": function(element, renderer) {
          return true;
        },
        ".controls": function(element, renderer) {
          return true;
        }
      };

    var doc = new jsPDF();
    doc.fromHTML(
        document.getElementById("relatorio").innerHTML, 1, 1, 
        { 'width': 10, 'elementHandlers': specialElementHandlers }, 
        function(){ doc.save('sample-file.pdf'); }
    );*/

    var printContents = document.getElementById("relatorio").innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;

}