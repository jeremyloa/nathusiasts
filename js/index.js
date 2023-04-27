import { auth_middleware } from "./user.js"

const acc_redir = document.getElementById('acc_redir')
if (acc_redir) {
    acc_redir.addEventListener("click", async (e)=>{
        if (!(await auth_middleware())) window.location.assign('login-register.html')
        else window.location.assign('account.html')
    })
}

if (window.location.pathname === '/login-register.html') {
    if (await auth_middleware()) window.location.assign('account.html')
}

if (window.location.pathname === '/new-product.html') {
    if (!(await auth_middleware())) window.location.assign('login-register.html')
}