//Problema 2
function contadorCaracteres(cadena) {
    let caracteres = [... new Set(cadena.toLowerCase())];

    for(var i=0; i<caracteres.length; i++){
        let arreglo=[]
        cadena.split('').map(n => {
            if(n.toLowerCase() === caracteres[i]){
                arreglo.push(n)
            }           
        })
        console.log(`Hay ${arreglo.length} ${caracteres[i]}`);
    }

}
console.log(contadorCaracteres("Andres Ramos"));

//Problema 3
var año = 2000;

if(año%4==0 && año%100 !=0){
    console.log("Bisiesto");   
}
else if(año%400==0){
    console.log("Bisiesto");
}
else{
    console.log("No Bisiesto");
}

//Problema 4

function contadorMopris(num) {
    var cont = 0;
    for(var i=2;i<=num;i++){
      if(esMopri(i)) cont+=i;
    }
    return cont;
  }

  function esMopri(num) {
    for (var i = 2; i < num; i++) {
      if (num % i === 0) {
        return false;
      }
    }
    return num !== 1;
  }
console.log(contadorMopris(13));
