function validateProfile(form) {
	var retorno = true;
	var falta = [];
	if (document.getElementById("error")){
		var elimianr = document.getElementById("error");
		elimianr.remove();
	}
	
	if(form["nickname"]) {
		if(form["nickname"].value.trim() == "") {
			//alert("Nickname is required");
			falta.push("Nickname is required");
			form["nickname"].focus();
			retorno = false;
		}
	}
	if(form["email"]) {
		 if(form["email"].value.trim() == "") {
			//alert("Email is required");
			falta.push("Email is required");
			form["email"].focus();
			retorno = false;
		}
	}
	if(form["passwd"]) {
		 if(form["passwd"].value.trim() == "") {
			//alert("Password is required");
			falta.push("Password is required");
			form["passwd"].focus();
			retorno = false;
		}
	}
	if(form["passwd"] && form["confirm"]) {
		 if(form["passwd"].value != form["confirm"].value) {
			//alert("Password and Repeat Password are not equal");
			falta.push("Password and Repeat Password are not equal");
			form["passwd"].focus();
			retorno = false;
		}
	}
	if(form["post"]) {
		 if(form["post"].value.trim() == "") {
			//alert("Password is required");
			falta.push("Campo en blanco");
			form["post"].focus();
			retorno = false;
		}
	}
	
	if(!retorno) {
		var ndiv = document.createElement("div");
		ndiv.setAttribute("id", "error");
		falta.forEach(function(iten) {
			var nli = document.createElement("li");
			var ntex = document.createTextNode(iten);
			nli.appendChild(ntex);
			ndiv.appendChild(nli);
			//console.log(iten);
		});
		form.insertBefore(ndiv,form.childNodes[0]);
		
	}
	
	return(retorno);
}





//Mesages de un solo amigo 
function mensages_amigo(selecionado) {
	var amigo = selecionado.value;
	var spam = document.getElementById("selected_friend")
	spam.innerHTML=amigo;
	var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if((this.readyState == 4) && (this.status == 200)) {
            //alert("Respuesta recibida correctamente:\n" + this.responseText);
            var div_mensajes = document.getElementById("mensajes_amigo");
            var myObj = JSON.parse(this.responseText);
            div_mensajes.innerHTML ="";
            //console.log(myObj);
            myObj.forEach(function(iten) {
				var nli = document.createElement("li");
				var ntex = document.createTextNode(iten[0] + ": " + iten[2]);
				nli.appendChild(ntex);
				div_mensajes.appendChild(nli);
				//console.log(iten);
			});
            //document.getElementById("mensajes_amigo").innerHTML = this.responseText;
        }
    };
    xmlhttp.open("POST","friend_messages",true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("email=" + amigo);
}


function showFriends() {    
	var amigos = document.getElementById("list-friends");
	var mensages = document.getElementById("mensajes_amigo");
	var boton = document.getElementById("boton_amigos");
	if (boton.value=="Amigos") {
		mensages.style.display= "none";
		amigos.style.display= "inline";
		boton.value="Aceptar";
	}
	else {
		mensages.style.display= "block";
		amigos.style.display= "none";
		boton.value="Amigos";
	}
	
}





//**********************
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

//******************************