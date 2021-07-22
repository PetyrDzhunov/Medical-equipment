const userModel = firebase.auth();
const db = firebase.firestore();
console.log(db);
//database?

const app = Sammy('#root', function() {
    this.use('Handlebars', 'hbs');

    this.get('/home', function(context) {
        console.log('home now');
        extendContext(context)
            .then(function() {
                this.partial('/templates/home.hbs')
            })
    });

    this.get('/register', function(context) {
        extendContext(context)
            .then(function() {
                this.partial('/templates/register.hbs')
            });

    });
});




app.run('/home')


//helper function
function extendContext(context) {
    return context.loadPartials({
        'header': '/partials/header.hbs',
        'footer': '/partials/footer.hbs'
    })
}