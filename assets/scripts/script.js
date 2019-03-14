// Comandos de click
let contadorLupa = 0;

function removerLink(){
    var link = document.querySelector('.cadastro a')
    
    if (link.getAttribute('href') === ""){
        link.parentNode.removeChild(link);
        let imagem = document.createElement("img");
        imagem.src = "./../assets/imagens/lupa.png"
        imagem.className = "lupa";
        

        document.querySelector('.cadastro').appendChild(imagem);
    }
}

removerLink();

document.querySelector('.lupa').onclick = function(event){
    if(contadorLupa < 1){
        console.log("foi");
        document.querySelector(".cadastro").style.display = "none";
        document.querySelector(".busca").style.display = "block";
        contadorLupa++;
        console.log(contadorLupa);
        return;
    }
}

function selectOnlyThis(id) {
    for (let i = 1;i <= 2; i++)
    {
        document.getElementById("Check" + i).checked = false;
    }
    document.getElementById(id).checked = true;
}

function sair(){
    
}