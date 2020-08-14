function autenticar(){
    var txtEmail = document.getElementById("txtEmail").value;
    var txtSenha = document.getElementById("txtSenha").value;

    console.log("Digitou = "+txtEmail+"/"+txtSenha);

    //Body
    var msgBody={
        email: txtEmail,
        senha: txtSenha
    };

    
    //Header
    var cabecalho = {
        method : "POST",
        body : JSON.stringify(msgBody), //Converte para string
        headers:{
            "Content-type":"application/json"
        }
    };

    fetch("http://agendamento-pessoal.herokuapp.com/login",cabecalho)
        .then(res => trataResposta(res))
        
}

function trataResposta(res){
    if (res.status == 200){
        document.getElementById("msgERRO").innerHTML = "<h3>Conectado com sucesso<\h3>"
        res.json().then(objeto => logar(objeto))
        logar(res);
    }
    else if (res.status == 401){
        document.getElementById("msgERRO").innerHTML = "<h3>Senha inválida<\h3>"
    }
    else{
        document.getElementById("msgERRO").innerHTML = "<h3>Usuário desconhecido<\h3>"
    }
}

function logar(objeto){
    var objSTR = JSON.stringify(objeto);
    localStorage.setItem("ScheduleUSER",objSTR);
    window.location="home.html";
}

function deslogar(objeto){
    var objSTR = JSON.stringify(objeto);
    localStorage.removeItem("ScheduleUSER",objSTR);
    window.location="home.html";
}