const userModel = firebase.auth();
const db = firebase.firestore();
//database?

const app = Sammy('#root', function() {
    this.use('Handlebars', 'hbs');

    this.get('/home', function(context) {
        extendContext(context)
            .then(function() {
                this.partial('/templates/home.hbs')
            });
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
            });
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

    this.get('/logout', function(context) {
        userModel.signOut()
            .then(() => {
                clearUserData();
                this.redirect('/home');
            })
            .catch(errorHandler)
    });

    this.get('/add-product', function(context) {
        console.log(context);
        extendContext(context)
            .then(function() {
                this.partial('/templates/addProduct.hbs')
            });
    });

    this.post('/add-product', function(context) {
        const { productName, productPrice, productImageUrl, productDescription, productAdditionalInfo } = context.params;
        console.log(productName, productPrice, productDescription, productImageUrl, productAdditionalInfo);
        db.collection('products').add({
                productName,
                productPrice,
                productDescription,
                productImageUrl,
                productAdditionalInfo
            })
            .then((response) => {
                this.redirect('/check-products')
            })
    });

    this.get('/check-products', function(context) {
        const products = getProducts()
            .then((response) => {
                context.offers = response.docs.map((offer) => { return { id: offer.id, ...offer.data() } })
            });
        console.log(products);
        this.loadPartials('./templates/product.hbs')
        extendContext(context)
            .then(function() {
                this.partial('/templates/products.hbs')
            })
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

function getProducts() {
    const products = db.collection('products').doc().get();
    console.log(products);
    return products;
}