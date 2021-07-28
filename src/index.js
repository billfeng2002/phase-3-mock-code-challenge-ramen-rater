// write your code here

//load the ramen menu
let ramenMenu = document.querySelector('#ramen-menu')
fetch('http://localhost:3000/ramens').then(r => r.json()).then(j => {
    for (const ramen of j) {
        let imgTag = document.createElement('img')
        imgTag.src = ramen.image
        imgTag.dataset.id=ramen.id
        ramenMenu.append(imgTag)
        imgTag.addEventListener("click", () => displayRamen(ramen.id))
    }
    if(j.length>0)
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
        let deleteButton=document.querySelector('#delete-button')
        deleteButton.dataset.id=ramenId
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

//listener for new ramen
let newForm=document.querySelector('#new-ramen')
newForm.addEventListener("submit", e=>{
    e.preventDefault()
    let name=newForm.name.value
    let restaurant=newForm.restaurant.value
    let image=newForm.image.value
    let rating=newForm.rating.value
    let comment=newForm["new-comment"].value

    let data={
        name, restaurant, image, rating, comment
    }

    let postOptions={
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(`http://localhost:3000/ramens`, postOptions).then(r=>r.json()).then(ramen=>{
        let imgTag = document.createElement('img')
        imgTag.src = ramen.image
        ramenMenu.append(imgTag)
        imgTag.addEventListener("click", () => displayRamen(ramen.id))
        e.target.reset()
    })
})

//listen for delete
let deleteButton=document.querySelector('#delete-button')
deleteButton.addEventListener('click', e=>{
    let deleteOptions={
        method: "DELETE"
    }
    let ramenId=e.target.dataset.id
    let menuElt=[...ramenMenu.children].find(elt=>elt.dataset.id==ramenId)
    menuElt.remove()
    fetch("http://localhost:3000/ramens/"+ramenId,deleteOptions).then(r=>{
        displayRamen(ramenMenu.children[0].dataset.id)
    })
})