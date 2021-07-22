const userModel = firebase.auth();
const db = firebase.firestore();
//database?

const app = Sammy('#root', function() {
    this.use('Handlebars', 'hbs');

    this.get('/home', function(context) {
        extendContext(context)
            .then(function() {
                console.log(context);
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

    this.post('/login', function(context) {
        const { email, password } = context.params;
        userModel.signInWithEmailAndPassword(email, password)
            .then((userData) => {
                saveUserData(userData)
                this.redirect('/home')
            })
            .catch(errorHandler)
    });

});




app.run('/home')


//helper function
function extendContext(context) {
    const user = getUserData();
    context.loggedIn = Boolean(user);
    context.email = user ? user.email : '';
    return context.loadPartials({
        'header': '/partials/header.hbs',
        'footer': '/partials/footer.hbs'
    })
}

function errorHandler(error) {
    console.log(error);
}

function saveUserData(data) {
    const { user: { email, uid } } = data;
    localStorage.setItem('user', JSON.stringify({ email, uid }))
}

function getUserData() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null
}

function clearUserData() {
    localStorage.removeItem('user');
}