(() => {
    const Logic = {
        methods: {
            fibonacci: (n) => {
                const arrayfib = [0,1];
                for(let i = 2; i <= n; i++){
                    arrayfib[i] = arrayfib[i-1] + arrayfib[i-2];
                }
                return arrayfib;
            },
        }
    }
    document.Logic = Logic;
})();