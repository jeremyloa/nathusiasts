import { auth_middleware, user, masterUserArray } from "./user.js"
import { getFirestore, doc, addDoc, getDoc, getDocs, query, collection, where, Timestamp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js'
import {masterCategoryArray} from "./products.js"
const db = getFirestore()
const params = new URLSearchParams(window.location.search)
const item_id = params.get('id')
if (item_id){
    const item_pic = document.getElementById('item_pic')
    const item_cat = document.getElementById('item_cat')
    const item_own = document.getElementById('item_own')
    const item_stock = document.getElementById("item_stock")
    const item_name = document.getElementById('item_name')
    const item_price = document.getElementById('item_price')
    const item_desc = document.getElementById('item_desc')
    const title_product = document.getElementById('title_product')
    const item_id_input = document.getElementById('item_id')
    const item_stock_input = document.getElementById('item_stock')
    const item_qty = document.getElementById("item_qty")
    const item_qty_label = document.getElementById("item_qty_label")
    const item_doc = await getDoc(doc(db, "item", item_id))
    if (item_doc.exists()) {
        item_id_input.value = item_id
        const item = item_doc.data()
        item_pic.src = item.pic
        item_name.innerHTML = item.name
        title_product.innerHTML = "Nathusiasts - " + item.name
        item_price.innerHTML = 'Rp'+item.price
        item_desc.innerHTML = item.description
        item_cat.innerHTML = await masterCategoryArray.find(obj => obj.id === item.category).name; 
        item_cat.setAttribute("href", '/marketplace.html?category=' + item.category) 
        item_own.innerHTML = await masterUserArray.find(obj => obj.id === item.owner).name;
        item_own.setAttribute("href", '/owner-store.html?id=' + item.owner) 
        item_stock.innerHTML = item.stock
        item_stock_input.value = item.stock
        if (item.stock < 1) {
            item_qty.style.display = "none"
            item_rent.style.display = "none"
            item_qty_label.innerHTML = "Product is out of stock."
        } 
        // else {
        //     const item_rent = document.getElementById("item_rent")
        //     item_rent.addEventListener("click", (e)=>{
        //         e.preventDefault()
        //         window.location.assign("buy.html?id="+item_id)
        //     })
        // }
    }

    const item_input_review = document.getElementById('item_input_review')
    if (item_input_review) {
        // if (false) item_input_review.style.display = 'none'
        if (!(await auth_middleware())) item_input_review.remove()
        else {
            item_input_review.style.display = 'flex'
            const item_submit_review = document.getElementById('item_submit_review')
            item_submit_review.addEventListener("click", (e)=>{
                e.preventDefault()
                const item_input_review_rating = document.getElementsByName('item_input_review_rating')
                let item_input_review_rating_value;
                for (let i = 0; i < item_input_review_rating.length; i++) {
                    if (item_input_review_rating[i].checked) {
                        item_input_review_rating_value = item_input_review_rating[i].value;
                        break;
                    }
                }
                const item_input_review_comment = document.getElementById('item_input_review_comment')
                if (item_input_review_comment.value === "") alert('Review should not be empty')
                else if (item_input_review_rating_value < 1) alert('Rating should be at least 1')
                else {
                    addDoc(collection(db, "item_reviews"), {
                        comment: item_input_review_comment.value,
                        date: Timestamp.now(),
                        item: item_id,
                        rating: parseInt(item_input_review_rating_value),
                        reply: '-',
                        user: user.id
                    })
                    .then(()=>{location.reload()})
                    .catch((e)=>console.log(e))
                }
            })
        }
    }

    const reviewsList = document.querySelector("#item_reviews_list.item_reviews_list");
    const querySnapshot = await getDocs(query(collection(db, "item_reviews"), where("reply", "==", "-"), where("item", "==", item_id)));
    await querySnapshot.forEach(async (doc) => {
        const rev = doc.data();
        const reviewItem = document.createElement("li");
        reviewItem.setAttribute("data-key", doc.id);

        const reviewContainer = document.createElement("div");
        reviewContainer.classList.add("item_review_container");

        const reviewUser = document.createElement("h4");
        reviewUser.classList.add("item_review_user");
        reviewUser.textContent = masterUserArray.find(obj => obj.id === rev.user).name;

        const reviewDate = document.createElement("div");
        reviewDate.classList.add("item_review_date");
        reviewDate.textContent = rev.date.toDate().toLocaleDateString() + ' ' + rev.date.toDate().toLocaleTimeString();

        const reviewRating = document.createElement("ul");
        reviewRating.classList.add("item_review_rating");
        for (let i = 0; i < rev.rating; i++) {
            const ratingStar = document.createElement("li");
            ratingStar.classList.add("checked");
            ratingStar.textContent = "★";
            reviewRating.appendChild(ratingStar);
        }
        for (let i = rev.rating; i < 5; i++) {
            const ratingStar = document.createElement("li");
            ratingStar.classList.add("star");
            ratingStar.textContent = "★";
            reviewRating.appendChild(ratingStar);
        }

        const reviewComment = document.createElement("p");
        reviewComment.classList.add("item_review_comment");
        reviewComment.textContent = rev.comment;
        
        const repBtn = document.createElement("button")
        repBtn.classList.add("form-submit-inv")
        repBtn.classList.add("item_review_reply_trigger")
        repBtn.textContent = 'Reply';

        reviewContainer.appendChild(reviewUser);
        reviewContainer.appendChild(reviewDate);
        reviewContainer.appendChild(reviewRating);
        reviewContainer.appendChild(reviewComment);
        if (await auth_middleware())
            reviewContainer.appendChild(repBtn);
        reviewItem.appendChild(reviewContainer);

        const reviewReps = document.createElement("ul");
        reviewReps.classList.add("item_reviews_list")
        reviewReps.classList.add("item_review_replies")

        reviewsList.appendChild(reviewItem);
        reviewsList.appendChild(reviewReps);

        const querySnapshotRep = await getDocs(query(collection(db, "item_reviews"), where("reply", "==", doc.id), where("item", "==", item_id)));
        await querySnapshotRep.forEach(async (dc) => {
            const rep = dc.data();
            const reviewItemRep = document.createElement("li");
            reviewItem.setAttribute("data-key", dc.id);

            const reviewContainerRep = document.createElement("div");
            reviewContainerRep.classList.add("item_review_container");

            const reviewUserRep = document.createElement("h4");
            reviewUserRep.classList.add("item_review_user");
            reviewUserRep.textContent = masterUserArray.find(obj => obj.id === rep.user).name;

            const reviewDateRep = document.createElement("div");
            reviewDateRep.classList.add("item_review_date");
            reviewDateRep.textContent = rep.date.toDate().toLocaleDateString() + ' ' + rep.date.toDate().toLocaleTimeString();

            const reviewCommentRep = document.createElement("p");
            reviewCommentRep.classList.add("item_review_comment");
            reviewCommentRep.textContent = rep.comment;

            reviewContainerRep.appendChild(reviewUserRep);
            reviewContainerRep.appendChild(reviewDateRep);
            reviewContainerRep.appendChild(reviewCommentRep);
            reviewItemRep.appendChild(reviewContainerRep);

            reviewReps.appendChild(reviewItemRep);
        });

        repBtn.addEventListener("click", ()=>{
            const checkForm = document.getElementById("item_input_reply_to_" + doc.id)
            if (!checkForm) {
                const repBoxForm = document.createElement("form")
                repBoxForm.classList.add("item_input_comment")
                
                const repBoxTxArea = document.createElement("textarea")
                repBoxTxArea.classList.add("item_input_review_comment")
                repBoxTxArea.setAttribute("id", "item_input_reply_to_" + doc.id)
                repBoxTxArea.setAttribute("rows", "3")
                repBoxTxArea.setAttribute("placeholder", "Your Reply")
                repBoxTxArea.setAttribute("required", "")
    
                const repBoxBtnSub = document.createElement("button")
                repBoxBtnSub.classList.add("form-submit-inv")
                repBoxBtnSub.classList.add("btn-yellow")
                repBoxBtnSub.classList.add("btn-rep")
                repBoxBtnSub.textContent = 'Submit Reply'
                repBoxBtnSub.setAttribute("type", "submit")
                repBoxForm.appendChild(repBoxTxArea)
                repBoxForm.appendChild(repBoxBtnSub)
                reviewReps.appendChild(repBoxForm)

                repBoxBtnSub.addEventListener("click", (e)=>{
                    e.preventDefault()
                    const item_input_review_comment_reply = document.getElementById('item_input_reply_to_' + doc.id)
                    if (item_input_review_comment_reply.value === "") alert('Reply should not be empty')
                    else {
                        addDoc(collection(db, "item_reviews"), {
                            comment: item_input_review_comment_reply.value,
                            date: Timestamp.now(),
                            item: item_id,
                            rating: 0,
                            reply: doc.id,
                            user: user.id
                        })
                        .then(()=>{location.reload()})
                        .catch((e)=>console.log(e))
                    }
                })
            } else {
                checkForm.remove()
            }
        })
    });

}
