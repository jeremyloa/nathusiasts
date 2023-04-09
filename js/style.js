function mobMenu() {
    let x = document.getElementsByClassName("mob-hid")
    for (let i = 0; i<x.length; i++) 
        if (x[i].style.display === "flex") 
            x[i].style.display = "none"
        else 
            x[i].style.display = "flex"
}

var mediaRequirement = window.matchMedia("(min-width: 900px")
function normalizeState(e){
    if (e.matches) {
        let x = document.getElementsByClassName("mob-hid")
        for (let i = 0; i<x.length; i++) 
            x[i].style.display = "flex"
    }
}

mediaRequirement.addListener(normalizeState)
normalizeState(mediaRequirement)