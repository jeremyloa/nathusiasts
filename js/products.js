import { getFirestore, onSnapshot, collection, doc, addDoc } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js'
import { getDownloadURL, ref, uploadBytes, getStorage } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js'
import { user } from "./user.js"

const db = getFirestore()
const storage = getStorage()

export const getMasterProductArray = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(collection(db, "item"), (ss) => {
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
}

export var masterCategoryArray = []
onSnapshot(collection(db, "category"), (ss)=>{
    masterCategoryArray = []
    ss.forEach((doc)=>{
        masterCategoryArray.push({
        id: doc.id,
        ...doc.data()
        })
    })
})

const new_product_form = document.getElementById("new_product_form")
if (new_product_form) {
    new_product_form.addEventListener("submit", async (e)=>{
        e.preventDefault()
        const owner = user.id
        const category = new_product_form.new_product_category.value
        const name = new_product_form.new_product_name.value
        const price = new_product_form.new_product_price.value
        const stock = new_product_form.new_product_stock.value
        const description = new_product_form.new_product_desc.value
        const img_blob = new_product_form.new_product_img.files[0]
        const img_ref = ref(storage, 'product/'+owner+'/'+Date.now()+'/'+img_blob.name)
        if (category === "" || name === "" || price <=0 || stock <=0 || description === "" || img_blob.name === "") alert("All fields must be filled")
        else {
            uploadBytes(img_ref, img_blob).then((ss)=>{
                getDownloadURL(ss.ref).then((url)=> {
                    addDoc(collection(db, "item"), {
                        owner: owner,
                        category: category,
                        name: name,
                        price: Number(price),
                        stock: Number(stock),
                        description: description.replace(/\n/g, "<br>"),
                        pic: url
                    }).then((docref)=>
                        window.location.assign("item.html?id=" + docref.id
                    )).catch((e)=>console.log(e))
                }).catch((e)=>console.log(e))
            }).catch((e)=>console.log(e))
        }
    })
}