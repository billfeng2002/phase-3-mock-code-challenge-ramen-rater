// write your code here

//load the ramen menu
let ramenMenu = document.querySelector('#ramen-menu')
fetch('http://localhost:3000/ramens').then(r => r.json()).then(j => {
    for (const ramen of j) {
        let imgTag = document.createElement('img')
        imgTag.src = ramen.image
        ramenMenu.append(imgTag)
        imgTag.addEventListener("click", () => displayRamen(ramen.id))
    }
    displayRamen(j[0].id) //display first one upon load
})

function displayRamen(ramenId) {
    fetch('http://localhost:3000/ramens/' + ramenId).then(r => r.json()).then(ramen => {
        let imageDisplay = document.querySelector("#ramen-detail .detail-image")
        imageDisplay.src = ramen.image
        imageDisplay.alt = ramen.name
        document.querySelector("#ramen-detail .name").textContent = ramen.name
        document.querySelector("#ramen-detail .restaurant").textContent = ramen.restaurant
        let ratingForm = document.querySelector("#ramen-rating")
        ratingForm.dataset.id = ramen.id
        ratingForm.rating.value = ramen.rating
        ratingForm.comment.value = ramen.comment
    })
}

//listener for comment/rating update
let ratingForm = document.querySelector("#ramen-rating")
ratingForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    let newRating=e.target.rating.value
    let newComment=e.target.comment.value
    let ramenId=e.target.dataset.id
    let data={
        rating: newRating,
        "comment": newComment
    }
    let patchOptions={
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(`http://localhost:3000/ramens/${ramenId}`, patchOptions)
})