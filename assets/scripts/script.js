// Comandos de click

let linhas = document.querySelectorAll('.linha');

let painel = document.createElement('input');

function exibirInfo(event){
    for(let linha of linhas){
        if(document.querySelector('.maisInfo').style.display==="none")
        document.querySelector('.maisInfo').style.display="block";
        else
        document.querySelector('.maisInfo').style.display=""
        //  '<div class="maisInfo">aaa</div>';
    }
}

for (i = 0; i < linhas.length; i++) {
    linhas[i].onclick = exibirInfo;
}


function selectOnlyThis(id) {
    for (let i = 1;i <= 2; i++)
    {
        document.getElementById("Check" + i).checked = false;
    }
    document.getElementById(id).checked = true;
}

function sair(){
    document.querySelector('.maisInfo').style.display = "none";
}