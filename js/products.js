import { getFirestore, onSnapshot, collection } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js'
const db = getFirestore()

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