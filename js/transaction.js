import { getFirestore, onSnapshot, collection, doc, where, getDoc, setDoc, query} from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js'
import { getTransactionCartArray } from "./cart.js"
import { masterCategoryArray } from './products.js'
import { user, masterUserArray, getCurrUser } from "./user.js"

const db = getFirestore()
export const getMasterTransactionArray = () => {
    return new Promise((resolve, reject) => {
        getCurrUser()
        .then((usr)=>{
            const unsubscribe = onSnapshot(query(collection(db, "transaction"), (where("user", "==", usr.id))), (ss) => {
                const data = []
                ss.forEach((doc) => {
                    data.push({
                    id: doc.id,
                    ...doc.data()
                    })
                })
                if (data.length === 0) {
                    unsubscribe(); 
                    reject(new Error("No data found")); 
                } else {
                    unsubscribe(); 
                    resolve(data); 
                }
            }, reject)
        })
        .catch(reject)
    })
}
  
const transList = document.getElementById("tr_main")
if (transList){
    getMasterTransactionArray().then((data)=>{
        data.forEach(async (tr)=>{
            console.log(tr)
            const trOneContainer = document.createElement("li")
            trOneContainer.className = "trContainerOutline"
                const trOneContainerDiv = document.createElement("div")
                trOneContainerDiv.className = "item_review_container_two"
                    const trOneHeading = document.createElement("h3")
                    trOneHeading.className = "item_review_user"
                    let status = tr.status == 0 ? "On Process" : tr.status == 1 ? "Shipping" : "Finished" 
                    trOneHeading.innerHTML = "["+status+"]"+" - Invoice: "+tr.id
                    trOneContainerDiv.appendChild(trOneHeading)

                    const trOneTransDiv = document.createElement("div")
                    trOneTransDiv.className = "trans_div"

                        const trOneTransDivLeft = document.createElement("div")
                        trOneTransDivLeft.className = "trans_div_left" 
                            
                            const trReceiverHeader = document.createElement("h4")
                            trReceiverHeader.innerHTML = "Receiver:"
                            trOneTransDivLeft.appendChild(trReceiverHeader)
                            const receiverName = document.createElement("p")
                            receiverName.className = "trans_name"
                            receiverName.innerHTML = tr.name 
                            trOneTransDivLeft.appendChild(receiverName)
                            const receiverMail = document.createElement("p")
                            receiverMail.className = "trans_mail"
                            receiverMail.innerHTML = tr.email 
                            trOneTransDivLeft.appendChild(receiverMail)
                            const receiverTel = document.createElement("p")
                            receiverTel.className = "trans_tel"
                            receiverTel.innerHTML = tr.tel 
                            trOneTransDivLeft.appendChild(receiverTel)
                           
                        trOneTransDiv.appendChild(trOneTransDivLeft)

                        const trOneTransDivRight = document.createElement("div")
                        trOneTransDivRight.className = "trans_div_right" 
                            const trTotal = document.createElement("h3")
                            trTotal.innerHTML = "Total: Rp"+tr.total
                            trOneTransDivRight.appendChild(trTotal)
                            const trAddress = document.createElement("p")
                            trAddress.innerHTML = tr.address
                            trOneTransDivRight.appendChild(trAddress)
                        trOneTransDiv.appendChild(trOneTransDivRight)

                    trOneContainerDiv.appendChild(trOneTransDiv)
                    
                trOneContainer.appendChild(trOneContainerDiv)

                const trProducts = document.createElement("ul")
                trProducts.className = "trans_products"
                trProducts.id = "products_main"
                getTransactionCartArray(tr.id).then((data)=>{
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
                            item_qty.disabled = true
                            item_div_qty.appendChild(item_qty)
            
                            const product_price = document.createElement("h1")
                            product_price.classList.add("product_price")
                            product_price.innerHTML = 'Rp'+String(product.data().price*cart.qty) 
                            item_div_qty.appendChild(product_price)

                        cartContainer.appendChild(item_div_qty)
                        
                        trProducts.appendChild(cartContainer)
                    })
                }).catch(()=>{
                    console.log("catch")
                    alert("Your cart is empty!")
                    window.location.assign('marketplace.html')
                })

                trOneContainer.appendChild(trProducts)
            transList.appendChild(trOneContainer)
        })
    })
}