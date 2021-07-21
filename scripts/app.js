// auth?
//database?

const app = Sammy('#root', function() {
    this.use('Handlebars', 'hbs');

    this.get('/home', function(context) {
        console.log('home now');
        this.loadPartials({
                'header': '/partials/header.hbs'
            })
            .then(function() {
                this.partial('/templates/home.hbs')
            })
    })
});




app.run('/home')


//helper function