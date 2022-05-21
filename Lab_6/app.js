function Fibonacci(limit){
    const serie = [0,1];
    
    for (let i =2; i < limit; i++){
        serie[i] = serie[i-1] + serie[i-2];
    } 
    return serie; 
}

function calcular(e){
    console.log(Fibonacci(e));
    
}

calcular(7);