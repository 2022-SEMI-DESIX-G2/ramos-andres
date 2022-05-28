const express = require('express');
const app = express();

function Fibonacci(limit){
    const serie = [0,1];
    
    for (let i =2; i < limit; i++){
        serie[i] = serie[i-1] + serie[i-2];
    } 
    return serie; 
}

app.get('/Fibonacci/:limit', function(req, res){
    res.json({sequence:[Fibonacci(req.params.limit)]});

})

app.listen(3000);