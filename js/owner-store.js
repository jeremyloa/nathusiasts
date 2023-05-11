import { getMasterProductArray, masterCategoryArray } from "./products.js"
import { check_curr_user, getMatserUserArray, masterUserArray } from "./user.js"

const params = new URLSearchParams(window.location.search)
const user_id = params.get('id')
const category_id = params.get('category')
const search_query = params.get('query')
const own_name = document.getElementById("own_name")
getMatserUserArray().then((data)=>{
    own_name.innerHTML = data.find(obj => obj.id === user_id).name
})

const rent_btn = document.getElementById("rent_btn")
if (await check_curr_user(user_id)) {
    rent_btn.addEventListener("click", (e)=>{
        e.preventDefault()
        window.location.assign("new-product.html")
    })
} else {
    rent_btn.style.display = "none"
}

const search_box = document.getElementById("search_box")
const search_btn = document.getElementById("search_btn")
if (search_btn) {
    search_btn.addEventListener("click", (e)=>{
        e.preventDefault()
        if (search_box.value === "") window.location.assign("owner-store.html?id="+user_id)
        else window.location.assign("owner-store.html?id="+user_id+"&query="+search_box.value)
    })
}

const category_box = document.getElementById("category_box")
const category_btn = document.getElementById("category_btn")
if (category_btn) {
    category_btn.addEventListener("click", (e)=>{
        e.preventDefault()
        if (category_box.value === "" || category_box.value === "select") window.location.assign("owner-store.html?id="+user_id)
        else window.location.assign("owner-store.html?id="+user_id+"&category="+category_box.value)
    })
}

const productsList = document.getElementById("products_main")
getMasterProductArray().then((data)=>{
    data.forEach( (doc) => {
        if (doc.owner === user_id) {
            if ((!category_id && !search_query) || (category_id && doc.category === category_id) || (search_query && doc.name.toLowerCase().includes(search_query.toLowerCase()))) {
                const productContainer = document.createElement("li")
                productContainer.setAttribute("data-key", doc.id)
                productContainer.classList.add("product_container")
            
                const product_img = document.createElement("img")
                product_img.src = doc.pic 
                product_img.classList.add("product_img")
                productContainer.appendChild(product_img)
            
                const product_name = document.createElement("a")
                product_name.classList.add("product_name")
                product_name.innerHTML = doc.name 
                product_name.setAttribute("href", "/item.html?id="+doc.id)
                productContainer.appendChild(product_name)
            
                const product_cat = document.createElement("a")
                product_cat.setAttribute("href", "owner-store.html?id="+user_id+"&category="+doc.category) 
                product_cat.innerHTML = masterCategoryArray.find(obj => obj.id === doc.category).name; 
                productContainer.appendChild(product_cat)
            
                const product_own = document.createElement("a")
                product_own.setAttribute("href", '/owner-store.html?id=' + doc.owner) 
                product_own.innerHTML = masterUserArray.find(obj => obj.id === doc.owner).name;
                productContainer.appendChild(product_own)
            
                const product_price = document.createElement("h1")
                product_price.classList.add("product_price")
                product_price.innerHTML = 'Rp'+doc.price 
                productContainer.appendChild(product_price)
            
                productsList.appendChild(productContainer)
            }
        }
    });
}) 