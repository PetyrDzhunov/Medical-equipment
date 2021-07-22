const userModel = firebase.auth();
const db = firebase.firestore();
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

    this.post('/register', function(context) {
        const { email, password, rePassword } = context.params;
        if (password !== rePassword) {
            return;
        }
        userModel.createUserWithEmailAndPassword(email, password)
            .then((userData) => {
                console.log(userData);
                this.redirect('/login')
            })
            .catch(errorHandler)
    });

    this.get('/login', function(context) {
        extendContext(context)
            .then(function() {
                this.partial('templates/login.hbs')
            })
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

function errorHandler(error) {
    console.log(error);
}