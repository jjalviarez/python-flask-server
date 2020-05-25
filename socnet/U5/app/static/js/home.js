/**
 * Valida el formulario de envío de mensajes antes de proceder a
 * su envío. En caso de error, se muestra una alerta.
 *
 * NOTA: Primera versión de la validación vía JS.
 */
function validateMessage() {
	var msj = document.forms["home"]["message"]
	var retorno = true

	document.forms["home"]["friend_copy"].value = $('select[name="friend"]').val()
	if((msj.value.trim().length == 0) || (msj.value.trim().length > 128)) {
		alert("The message cannot be empty and must have less than 128 characters")
		msj.focus()
		retorno = false
	}
	
	return(retorno)
}

/**
 * Valida el formulario de envío de mensajes antes de proceder a
 * su envío. En caso de error, el mensaje de error se muestra
 * integrado en el documento.
 *
 * NOTA: Versión de la validación vía JS tras estudiar DHTML.
 */
function validateMessageDHTML() {
	var msj = document.forms["home"]["message"]
	var errores = ""
	var retorno = true

	if((msj.value.trim().length == 0) || (msj.value.trim().length > 128)) {
		errores += "The message cannot be empty and must have less than 128 characters"
		msj.className = "inputError"
		msj.focus()
		retorno = false
	}
	else {
	    msj.className = ""
	}

	if(! retorno) {
	    document.getElementById("errores_home").innerHTML = errores
	    document.getElementById("errores_home").style.display = "block"
	}
	else {
	    // Si el mensaje es válido también se manda el amigo del que se están viendo
	    // los mensajes. Si no se hiciera esto, cada vez que se mandara un mensaje
	    // nuevo se mostrarían los mensajes de todos los amigos
	    $('input#friend_copy').val($('select[name=friend]').val())
	}

	return(retorno)
}

/**
  * Obtiene el listado de mensajes del usuario seleccionado mediante una llamada AJAX
  *
  * NOTA: El contenido del panel de mensajes se construye creando nuevos elementos HTML (comparar con la función
  * showFriends).
  */
function updateFriendMessages(select_friend) {
     xmlhttp=new XMLHttpRequest();
     xmlhttp.onreadystatechange = function() {
        if((this.readyState == 4) && (this.status == 200)) {
            var datos = JSON.parse(this.responseText);
            contenedorMsjs = document.getElementById('messages');
            // Se dejan de mostrar los mensajes anteriores ...
            contenedorMsjs.innerHTML = "";
            // ... se añaden uno a uno los mensajes recibidos en la petición AJAX ...
            datos.forEach(function(item) {
                contenedorMsjs.innerHTML += "<li>" + item[0] + ": " + item[1];
             })
             // ... y finalmente se actualiza la etiqueta con el nombre del amigo del que se están viendo los
             // mensajes
             document.getElementById("selected_friend").innerHTML = select_friend.value;
        }
     };
     xmlhttp.open("POST","/friend_messages", true);
     xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
     xmlhttp.send("friend="+select_friend.value);
}

 /**
  * Obtiene el listado de mensajes del usuario seleccionado mediante una llamada jQuery
  *
  * NOTA: Esta función es equivalente a la anterior, con la diferencia que para hacer la llamada AJAX se utiliza jQuery
  * en lugar del objeto XMLHttpRequest
  */
function updateFriendMessagesJQUERY() {
    $.post("/friend_messages",
        "friend=" + $('select[name="friend"]').val(),
        function(data) {
            $('#messages').empty();
            data.forEach(function(item) {
                $('<li>').appendTo('#messages').text(item[0] + ": " + item[1])
             })
             $('#selected_friend').text($('select[name="friend"]').val())
    }, "json");
}

 /**
  * Obtiene el listado de amigos mediante una petición AJAX.
  *
  * NOTA: El contenido del panel de amigos se construye generando un fragmento de código HTML (comparar con la
  * función updateFriendMessages).
  */
function showFriends() {
    $("#div_messages").hide()
    $.getJSON("/friends",
        function(data) {
            var i = 1;
            $('#friends').empty();
            $('#friends').append("<div class='par' id='t0'>" +
                    "<input id='check0' value='All' type='checkbox' onclick='pulsadoCheck(0)' />All</div>")
            data.forEach(function(item) {
                $('#friends').append("<div class='" + ((i%2) ? "impar" : "par") + "' id='t" + i + "'>" +
                    "<input id='check" + i + "' value='" + item + "' type='checkbox' onclick='pulsadoCheck(" + i + ")' />" +
                    item + "</div>")
                i++
            });
            $("#div_friends").show()
    });
}

// Funcionalidad adaptada del código de ejemplo para la selección única de amigos
var seleccionados = new Array();

function desmarcarSeleccionados() {
    while(seleccionados.length != 0) {
        var item = seleccionados.pop();
        item.click();
    }
}

function pulsadoCheck(id) {
    if(document.getElementById("check" + id).checked) {
        document.getElementById("t" + id).className += " seleccionado";
        document.getElementById("t" + id).style.fontWeight = "bold";
        document.getElementById("t" + id).style.fontStyle = "italic";

        desmarcarSeleccionados();

        seleccionados.push(document.getElementById("check" + id));
    }
    else {
        var clase = document.getElementById("t" + id).className;
        var i;

        document.getElementById("t" + id).className = clase.substr(0, clase.indexOf(" seleccionado"));
        document.getElementById("t" + id).style.fontWeight = "normal";
        document.getElementById("t" + id).style.fontStyle = "normal";

        i = seleccionados.findIndex(function(item) { return(item.id == "check" + id) });
        if(i > -1) {
            seleccionados.splice(i, 1);
        }
    }
}

function selectFriend() {
    if(seleccionados.length > 0) {
        $("#div_friends").hide()
        $("#div_messages").show()
        $('select[name="friend"]').val(seleccionados.pop().value)
        $('select[name="friend"]').change()
    }
    else {
        alert("Please, select a friend")
    }
}