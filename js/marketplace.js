import { getMasterProductArray, masterCategoryArray } from "./products.js"
import { masterUserArray } from "./user.js"

const params = new URLSearchParams(window.location.search)
const category_id = params.get('category')
const search_query = params.get('query')

const rent_btn = document.getElementById("rent_btn")
rent_btn.addEventListener("click", (e)=>{
    e.preventDefault()
    window.location.assign("new-product.html")
})
const search_box = document.getElementById("search_box")
const search_btn = document.getElementById("search_btn")
if (search_btn) {
    search_btn.addEventListener("click", (e)=>{
        e.preventDefault()
        if (search_box.value === "") window.location.assign("marketplace.html")
        else window.location.assign("marketplace.html?query="+search_box.value)
    })
}

const category_box = document.getElementById("category_box")
const category_btn = document.getElementById("category_btn")
if (category_btn) {
    category_btn.addEventListener("click", (e)=>{
        e.preventDefault()
        if (category_box.value === "" || category_box.value === "select") window.location.assign("marketplace.html")
        else window.location.assign("marketplace.html?category="+category_box.value)
    })
}

const productsList = document.getElementById("products_main")
getMasterProductArray().then((data)=>{
    data.forEach( (doc) => {
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
            product_cat.setAttribute("href", '/marketplace.html?category=' + doc.category) 
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
    });
}) 