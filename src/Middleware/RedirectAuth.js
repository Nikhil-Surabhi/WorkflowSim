const isLoggedIn = (next) => {
    let token = localStorage.getItem('token');

    console.log('auth token: ', token);

    if (!token || token == '' || typeof token === 'undefined' || token === 'undefined') {
        next('/login');
    }

    next();
}

export default isLoggedIn;
