/**
 * Created by michaeldfti on 12/05/16.
 */

function mascaraChatbot(t, mask){

    var i = t.value.length;

    var saida = mask.substring(1,0);
    var texto = mask.substring(i);

    if (texto.substring(0,1) != saida){
        t.value += texto.substring(0,1);
    }
}

function dataFormatada(date){

    var data;

    if(date && date!= undefined && date != "undefined"){
        data = new Date(date);
    }else{
        data = new Date();
    }

    var dia = data.getDate();
    if (dia.toString().length == 1)
        dia = "0"+dia;
    var mes = data.getMonth()+1;
    if (mes.toString().length == 1)
        mes = "0"+mes;
    var ano = data.getFullYear();

    var hora = data.getHours();
    var min = data.getMinutes();
    var sec = data.getSeconds();

    if(sec < 10){
        sec = "0"+sec;
    }

    return dia + "/" + mes + "/" +ano+ " " + hora + ":" +min + ":"+sec+"h" ;

}

function scrollDownConversation(time){

    var element = document.getElementById('chatbot-conversation-area');
    var angEle  = angular.element(element);
    var refDown = document.getElementById('refDown');
    var defTime = 1000;

    if(time){
        defTime = time;
    }


    if(refDown){
        angEle.scrollToElement(refDown, 0, defTime);
    }
}