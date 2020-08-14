var listaAgencias;
var pos=0;

function carregaAgencias(){
    fetch("http://agendamento-pessoal.herokuapp.com/agencias")
        .then(res => res.json())
        .then(lista => preencheCombobox(lista));

}


function preencheCombobox(lista){
    listaAgencias=lista;
    var templateSelect = "<select class='form-control' id='txtAgencia' onchange='montaHorarios()'> {{OPCOES}} </select>";
    var templateOption = `<option value="{{VALOR}}"> {{NOME}} </option>`;

    var opcoes="";
    for (i=0;i<lista.length;i++){
        var ag = lista[i];
        opcoes+=templateOption.replace("{{VALOR}}",ag.id).replace("{{NOME}}",ag.nome);
    }
    document.getElementById("Agencia").innerHTML = templateSelect.replace("{{OPCOES}}",opcoes);
    //console.log(opcoes)

    montaHorarios();
}

function cadastraAgendamento(){

    var txtnomeCliente = document.getElementById("ClienteNome").value;
    var txtemailCliente = document.getElementById("ClienteEmail").value;
    var txtcelularCliente = document.getElementById("ClienteCelular").value;
    var txtdataAgendamento = document.getElementById("DataAgendamento").value;
    var txthoraAgendamento = document.getElementById("txtHoraInicio").value;
    var txtobservacoes = document.getElementById("Observacao").value;
    var txtagencia = document.getElementById("txtAgencia").value;


    //Body
    var msgBody={
        nomeCliente: txtnomeCliente,
        emailCliente: txtemailCliente,
        celularCliente: txtcelularCliente,
        dataAgendamento: txtdataAgendamento,
        horaAgendamento: txthoraAgendamento,
        observacoes: txtobservacoes,
        agencia: {
            id:txtagencia
        }
    }

    console.log(msgBody);
    
    //Header
    var cabecalho = {
        method : "POST",
        body : JSON.stringify(msgBody), //Converte para string
        headers:{
            "Content-type":"application/json"
        }
    };

    fetch("http://agendamento-pessoal.herokuapp.com/agendamentos/novo",cabecalho)
        .then(res => trataResposta(res))
        
}

function trataResposta(res){
    if (res.status == 201){
        res.json().then(agendamento => geraProtocolo(agendamento));
    }
    else{
        //alert("Problemas ao enviar sua solicitacao - Entre em contato com SAC");
        document.getElementById("textboxinfo").innerHTML = "Problemas ao enviar sua solicitacao - Entre em contato com SAC";
    }
}

function geraProtocolo(agendamento){
    //alert("Agendamento Conclu&iacutedo. Numero do Protocolo "+agendamento.numSeq + ". <br> N&atildeo se esque&ccedila de chegar com anteced&ecircncia.");
    
    document.getElementById("textboxinfo").innerHTML = "Agendamento Conclu&iacutedo. Numero do Protocolo "+agendamento.numSeq + ". <br> N&atildeo se esque&ccedila de chegar com anteced&ecircncia.";
}

function montaHorarios(){
    pos = document.getElementById("txtAgencia").value -1;
    var horarioSelect=`<select class="form-control" id="txtHoraInicio" onchange="mudaTermino()"> {{OPCOES}} </select>`;
    var horaOption   =`<option value="{{VALORHORA}}"> {{HORA}} </option>`;

    var agAtual = listaAgencias[pos];

    var opcoesHoras="";
    for (hora=agAtual.horaInicio; hora < agAtual.horaFim ; hora++){
        var strHora = hora+":00";
        opcoesHoras = opcoesHoras+horaOption.replace("{{VALORHORA}}",strHora)
                                            .replace("{{HORA}}", strHora);
        strHora = hora+":30";
        opcoesHoras = opcoesHoras+horaOption.replace("{{VALORHORA}}",strHora)
                                            .replace("{{HORA}}", strHora);
    }
    var novoSelect = horarioSelect.replace("{{OPCOES}}", opcoesHoras);
    document.getElementById("HoraInicio").innerHTML = novoSelect;

    mudaTermino();
}

function mudaTermino(){
    var horaInicio = document.getElementById("txtHoraInicio").value;
    var hora = horaInicio.substr(0,2);
    var minuto = horaInicio.substr(3,2);

    var minutoFim;
    var horaFim = hora;
    if (minuto == '00'){
        minutoFim = ':30';
    }
    else{
        horaFim = parseInt(hora)+1;
        minutoFim = ':00';
    }
    document.getElementById("HoraFim").value = horaFim+minutoFim;
}