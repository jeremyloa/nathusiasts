import { auth_middleware, user, masterUserArray } from "./user.js"
import { getFirestore, doc, addDoc, getDoc, getDocs, query, collection, where, Timestamp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js'

const db = getFirestore()
const params = new URLSearchParams(window.location.search)



//INPUT POST
// console.log("masuk post");
const item_input_review = document.getElementById('item_input_review')
if (item_input_review) {
    // if (false) item_input_review.style.display = 'none'
    // if (!(await auth_middleware())) item_input_review.remove()
    // else {
        item_input_review.style.display = 'flex'
        const item_submit_review = document.getElementById('item_submit_review')
        item_submit_review.addEventListener("click", (e)=>{
            e.preventDefault()
            
            const item_input_review_comment = document.getElementById('item_input_review_comment')

            console.log(item_input_review_comment.value);

            if (item_input_review_comment.value === "") alert('Post should not be empty')
            else {
                addDoc(collection(db, "post"), {
                    description: item_input_review_comment.value,
                    date: Timestamp.now(),
                    reply: '-',
                    user: user.id
                })
                .then(()=>{location.reload()})
                .catch((e)=>console.log(e))
            }
        })
    // }



    //COMMENTS
    
    const reviewsList = document.querySelector("#item_reviews_list.item_reviews_list");

    const querySnapshot = await getDocs(query(collection(db, "post")));

    await querySnapshot.forEach(async (doc) => {

        const post = doc.data();
        const postItem = document.createElement("li");
        postItem.setAttribute("data-key", doc.id);

        const postContainer = document.createElement("div");
        postContainer.classList.add("card_post");


        const  user_post = document.createElement("h4");
        user_post.classList.add("item_review_user")
        user_post.textContent = masterUserArray.find(obj => obj.id === post.user).name;

        const postDateRep = document.createElement("div");
        postDateRep.classList.add("item_review_date");
        postDateRep.textContent = post.date.toDate().toLocaleDateString() + ' ' + post.date.toDate().toLocaleTimeString();

        const title_post = document.createElement("h3");
        title_post.classList.add("title_post");
        title_post.textContent = post.title;

        const desc_post = document.createElement("div");
        desc_post.classList.add("desc_post");
        desc_post.textContent = post.description;

        const commentBtn = document.createElement("button")
        commentBtn.classList.add("form-submit-inv")
        commentBtn.classList.add("item_review_reply_trigger")
        commentBtn.textContent = 'Comment';

        const line_post = document.createElement("hr");
        line_post.classList.add("line_post");

        postContainer.appendChild(user_post);
        postContainer.appendChild(postDateRep);
        postContainer.appendChild(title_post);
        postContainer.appendChild(desc_post);
        // postContainer.appendChild(line_post);
        postContainer.appendChild(commentBtn);

        postItem.appendChild(postContainer);
        // postContainer.appendChild(footer_post);

        const reviewReps = document.createElement("ul");
        reviewReps.classList.add("item_reviews_list")
        
        postContainer.appendChild(reviewReps)

        reviewsList.appendChild(postItem);
        // reviewsList.appendChild(reviewReps);

        //doc.id ->id post
        const querySnapshotRep = await getDocs(query(collection(db, "post_reply"),  where("post", "==", doc.id)));

        await querySnapshotRep.forEach(async (dc) => {

            console.log(dc.data());

            const rep = dc.data();
            const reviewItemRep = document.createElement("li");
            postItem.setAttribute("data-key", dc.id);

            const reviewContainerRep = document.createElement("div");
            reviewContainerRep.classList.add("post_comment_container");

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

        commentBtn.addEventListener("click", ()=>{
            const checkForm = document.getElementById("post_input_comment_to_" + doc.id)
            if(!checkForm){

                const repBoxForm = document.createElement("form")
                repBoxForm.classList.add("post_input_comment")
                
                const repBoxTxArea = document.createElement("textarea")
                repBoxTxArea.classList.add("item_input_review_comment")
                repBoxTxArea.setAttribute("id", "post_input_comment_to_" + doc.id)
                repBoxTxArea.setAttribute("rows", "3")
                repBoxTxArea.setAttribute("placeholder", "Your Comment")
                repBoxTxArea.setAttribute("required", "")
                
                const repBoxBtnSub = document.createElement("button")
                repBoxBtnSub.classList.add("form-submit-inv")
                repBoxBtnSub.classList.add("btn-yellow")
                repBoxBtnSub.classList.add("btn-rep")
                repBoxBtnSub.textContent = 'Add Comment'
                repBoxBtnSub.setAttribute("type", "submit")
                repBoxForm.appendChild(repBoxTxArea)
                repBoxForm.appendChild(repBoxBtnSub)
                reviewReps.appendChild(repBoxForm)
                
                repBoxBtnSub.addEventListener("click", (e)=>{
                    e.preventDefault()
                    const post_input_review_comment_reply = document.getElementById('post_input_comment_to_' + doc.id)
                    if (post_input_review_comment_reply.value === "") alert('Comment should not be empty')
                    else {
                        addDoc(collection(db, "post_reply"), {
                            comment: post_input_review_comment_reply.value,
                            date: Timestamp.now(),
                            post: doc.id,
                            user: user.id
                        })
                        .then(()=>{location.reload()})
                        .catch((e)=>console.log(e))
                    }
                    
                });

            }else{
                checkForm.remove();
            }


        });

    });
    

}

