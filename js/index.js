import { auth_middleware } from "./user.js"

const acc_redir = document.getElementById('acc_redir')
if (acc_redir) {
    acc_redir.addEventListener("click", async (e)=>{
        auth_middleware().then(isAuth => {
            if (isAuth) window.location.assign('account.html')
            else window.location.assign('login-register.html')
        })
    })
}

if (window.location.pathname === '/login-register.html') {
    auth_middleware().then(isAuth => {
        if (isAuth) window.location.assign('account.html')
    })
}

if (window.location.pathname === '/new-product.html') {
    auth_middleware().then(isAuth => {
        if (!isAuth) window.location.assign('login-register.html')
    })
}