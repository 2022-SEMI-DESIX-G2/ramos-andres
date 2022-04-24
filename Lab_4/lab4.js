const contenedor = document.getElementById("contenedor");
var flag = false;
document.onsubmit = (e) => {
    if(!flag){
        e.preventDefault();
        flag = true;
        calcular(e);
        document.getElementById('button').value = 'Limpiar';
    }  
}

function Fibonacci(limit){
    const serie = [0,1];
    
    for (let i =2; i < limit; i++){
        serie[i] = serie[i-1] + serie[i-2];
    } 
    return serie; 
}

function calcular(e){
    var fib = [];
    const numero = document.getElementById("integer").value;
    var contador = 0;
    fib = Fibonacci(numero);
    
    fib.forEach(Number =>{
        let identificador = "id" + contador;
        const div = document.createElement("div");
        div.classList.add("carta")
        div.textContent = Number;
        div.id = identificador;
        contador = contador + 1;
        contenedor.appendChild(div);
        var eliminartag = document.getElementById(identificador);
        eliminartag.onclick = (a) =>{
            if(confirm('¿Desea eliminar esta carta?')){
            const carta = document.getElementById(identificador);
            carta.remove();
            }
        }
        });
    
}

