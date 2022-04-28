((Logic)=>{
    const App = {
        htmlElements: {
            form: document.querySelector('#fibonacci'),
            input: document.querySelector('#amount'),
            container: document.querySelector('#container')
        },
        init: () => {
            App.htmlElements.form.addEventListener('submit', App.handlers.eventFormSubmit);
            App.htmlElements.container.addEventListener('click', App.handlers.eventCardClick);
        },
        logic: {
            ...Logic.methods,
        },
        templates: {
            card: (n) => {
                return `<div class="card">${n}</div>`;
            }
        },
        handlers: {
            eventCardClick: (e) => {
                if(e.target.className === 'card'){
                    e.target.remove();
                }
            },
            eventFormSubmit: (e) => {
                e.preventDefault();

                App.htmlElements.container.innerHTML = '';

                const n = App.htmlElements.input.value;
                App.logic.fibonacci(n).forEach(value => {
                    App.htmlElements.container.innerHTML += App.templates.card(value);
                });
            }            
        }
    };
    App.init();
})(document.Logic);