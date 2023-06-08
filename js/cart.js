import { getFirestore, onSnapshot, collection, doc, addDoc, where, and, getDoc, setDoc, query} from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js'
import { user, masterUserArray, getCurrUser } from "./user.js"
import { masterCategoryArray } from './products.js'

const db = getFirestore()
var totalPrice = 0
export const getMasterCartArray = () => {
    return new Promise((resolve, reject) => {
        getCurrUser()
        .then((usr)=>{
            const unsubscribe = onSnapshot(query(collection(db, "cart"), and(where("user", "==", usr.id), where("status", "==", 0))), (ss) => {
                const data = []
                ss.forEach((doc) => {
                    data.push({
                    id: doc.id,
                    ...doc.data()
                    })
                })
                unsubscribe()
                resolve(data)
            }, reject)
        })
    })
}

const item_qty = document.getElementById("item_qty")
const item_id = document.getElementById("item_id")
const item_stock = document.getElementById("item_stock")
const item_rent = document.getElementById("item_rent")
if (item_rent && item_id && item_qty) {
    item_rent.addEventListener("click", async (e)=>{
        e.preventDefault()
        const item = item_id.value
        const usr = user.id
        const qty = item_qty.value 
        const status = 0
        if (qty<1) alert("Quantity should be at least 1!")
        else if (item_stock.value < qty) alert("You are ordering more than the stock available.")
        else {
            addDoc(collection(db, "cart"), {
                user: usr,
                item: item,
                qty: Number(qty),
                status: status,
                transaction: ""
            }).then(()=>{
                alert("Successfully add to cart")
            }).catch(e=>console.log(e))
        }
    })
}

const cartList = document.getElementById("cart_main")
if (cartList){
    getMasterCartArray().then((data)=>{
        if (!data && window.location.pathname === '/cart.html') {
            let purBtn = document.getElementById("purchaseBtn")
            purBtn.style.display = "none"
        } else if (!data) {
            window.location.assign('marketplace.html')
        } 
        data.forEach(async (cart)=>{
            const product = await getDoc(doc(db, "item", cart.item))
            const cartContainer = document.createElement("li")
            cartContainer.setAttribute("data-key", cart.id)
            cartContainer.classList.add("product_container")
        
            const cart_img = document.createElement("img")
            cart_img.src = product.data().pic 
            cart_img.classList.add("product_img")
            cartContainer.appendChild(cart_img)
        
            const product_name = document.createElement("a")
            product_name.classList.add("product_name")
            product_name.innerHTML = product.data().name 
            product_name.setAttribute("href", "/item.html?id="+product.id)
            cartContainer.appendChild(product_name)
        
            const product_cat = document.createElement("a")
            product_cat.setAttribute("href", '/marketplace.html?category=' + product.data().category) 
            product_cat.innerHTML = masterCategoryArray.find(obj => obj.id === product.data().category).name; 
            cartContainer.appendChild(product_cat)
        
            const product_own = document.createElement("a")
            product_own.setAttribute("href", '/owner-store.html?id=' + product.data().owner) 
            product_own.innerHTML = masterUserArray.find(obj => obj.id === product.data().owner).name;
            cartContainer.appendChild(product_own)
            
            const item_div_qty = document.createElement("form")

                const item_qty = document.createElement("input")
                item_qty.id = "item_qty" 
                item_qty.setAttribute("type", "number")
                item_qty.setAttribute("min", 0)
                item_qty.setAttribute("max", 99)
                item_qty.setAttribute("step", 1)
                item_qty.setAttribute("value", cart.qty)
                item_qty.setAttribute("required", true)
                item_div_qty.appendChild(item_qty)

                const item_rent = document.createElement("input")
                item_rent.setAttribute("type", "submit")
                item_rent.classList.add("form-submit-inv")
                item_rent.classList.add("btn-yellow")
                item_rent.setAttribute("value", "Update")
                item_rent.addEventListener("click", async (e)=>{
                    e.preventDefault()
                    const item = cart.item
                    const usr = user.id
                    const qty = item_qty.value 
                    const status = qty<1 ? 3 : 0
                    if (product.data().stock < qty) alert("You are ordering more than the stock available.")
                    else {
                        setDoc(doc(db, "cart", cart.id), {
                            user: usr,
                            item: item,
                            qty: Number(qty),
                            status: status,
                            transaction: ""
                        }).then(()=>{
                            alert("Successfully update cart")
                            location.reload()
                        }).catch(e=>console.log(e))
                    }
                } )
                item_div_qty.appendChild(item_rent)

                if (window.location.pathname === '/buy.html') {
                    item_qty.disabled = true
                    item_rent.style.display = 'none'
                }

            cartContainer.appendChild(item_div_qty)

            const product_price = document.createElement("h1")
            product_price.classList.add("product_price")
            product_price.innerHTML = 'Rp'+String(product.data().price*cart.qty) 
            totalPrice = totalPrice + (product.data().price*cart.qty)
            cartContainer.appendChild(product_price)
            
            if (window.location.pathname === '/buy.html') {
                const total_price = document.getElementById("total_price")
                total_price.innerHTML = 'Rp'+String(totalPrice)
            }
            cartList.appendChild(cartContainer)
        })
    })
}

const purchaseBtn = document.getElementById("purchaseBtn")
if (purchaseBtn) {
    purchaseBtn.addEventListener("click", e=>{
        e.preventDefault()
        if (window.location.pathname ==='/cart.html') {
            window.location.assign('buy.html')
        } else {
            /*
            TODO: 
                get all active cart
                    create a new transaction doc (form)
                    update all active cart for the user to assign transaction ID of transaction doc
            */
            const buy_name = document.getElementById("buy_name")
            const buy_email = document.getElementById("buy_email")
            const buy_tel = document.getElementById("buy_tel")
            const buy_address = document.getElementById("buy_address")
            if (!buy_name.value || !buy_email.value || !buy_address.value || !buy_tel.value) alert("All fields must be filled")
            else if (buy_name.value.length  < 8 || buy_email.value.length  < 8 || buy_tel.value.length  < 8 || buy_address.value.length < 8) alert('Length of each fields should be at least 8 characters')
            else {
                // console.log({
                //     user: user.id,
                //     email: buy_email.value,
                //     name: buy_name.value,
                //     address: buy_address.value,
                //     tel: buy_tel.value,
                //     total: totalPrice+10000,
                //     status: 0
                // })
                addDoc(collection(db, "transaction"), {
                    user: user.id,
                    email: buy_email.value,
                    name: buy_name.value,
                    address: buy_address.value,
                    tel: buy_tel.value,
                    total: Number(totalPrice+10000),
                    status: 0
                }).then((transactionDoc)=>{
                    getMasterCartArray().then((data)=>{
                        data.forEach((cart)=>{
                            setDoc(doc(db, "cart", cart.id), {
                                transaction: transactionDoc.id,
                                status: 1,
                                user: user.id,
                                item: cart.item,
                                qty: Number(cart.qty),
                            }).then(()=>{
    
                            }).catch(e=>console.log(e))
                        })
                    }).then(()=>{
                        alert("Purchase success.")
                        window.location.assign('marketplace.html')
                    })
                }).catch(e=>console.log(e))
            }
        }
    })
}