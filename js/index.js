import { auth_middleware } from "./user.js"

const acc_redir = document.querySelectorAll('.mob-hid.acc_redir')
if (acc_redir) {
    acc_redir.forEach(e => {
        e.addEventListener("click", async ()=>{
            auth_middleware().then(isAuth => {
                if (!isAuth) window.location.assign('login-register.html')
            })
        })
    })
}

if (window.location.pathname === '/login-register.html') {
    auth_middleware().then(isAuth => {
        if (isAuth) window.location.assign('account.html')
    })
}

if (window.location.pathname === '/account.html') {
    auth_middleware().then(isAuth => {
        if (!isAuth) window.location.assign('login-register.html')
    })
}

if (window.location.pathname === '/new-product.html') {
    auth_middleware().then(isAuth => {
        if (!isAuth) window.location.assign('login-register.html')
    })
}

if (window.location.pathname === '/cart.html') {
    auth_middleware().then(isAuth => {
        if (!isAuth) window.location.assign('login-register.html')
    })
}