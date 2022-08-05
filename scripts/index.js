function filterPageCards(events,currentDate, title) {
    switch (title) {
        case "Past Events":
            events = events.filter(event => timeCard(currentDate,event))
            break;
        case "Upcoming Events":
            events = events.filter(event => !timeCard(currentDate,event))
            break;
        default:
            break;
    }
    return events
}
function timeCard(date, event) {
    let actualDAte = new Date(date)
    let eventDate = new Date(event.date)
    return actualDAte.getTime() > eventDate.getTime()
}
function createCard (currentDate, event) {
    let card = document.createElement("div")
    let pastOrUp = timeCard(currentDate, event)
    pastOrUp? pastOrUp = ["e-past","btn-past"]: pastOrUp = ["e-upcoming","btn-upcoming"]
    card.className = `card col-10 col-md-5 col-lg-4 col-xl-2 event-card p-0 ${pastOrUp[0]}`
    card.id = event._id
    card.innerHTML =
    `<img src="${event.image}">
    <div class="card-body p-1">
        <h5 class="card-title text-center">${event.name}</h5>
        <ul class="list-group">
            <li class="list-group-item p-1">${event.description}</li>
        </ul>
    </div>
    <div class="card-footer d-flex flex-wrap">
        <span class="card-text">Price: ${event.price}$</span>
        <a href="./details.html?id=${event._id}" class="btn btn-pers fs-7 ${pastOrUp[1]}">More info.</a>
    </div>`
    return card
}
function createSlides(slideX, index, currentDate, events) {
    let cardContainer = document.createElement("div")
    cardContainer.className = "row justify-content-evenly align-items-start gap-4 gap-xl-0"
    index *= 4
    events.forEach((event, i) => {
        if (i < index + 4 && i > index -1) {
            cardContainer.appendChild(createCard(currentDate, event))
        }
    });
    slideX.appendChild(cardContainer)
    return slideX
}
function createCards(dataPers, events) {
    events = filterPageCards(events, dataPers.currentDate, document.title)
    let cardCarousel = document.createElement("div")
    let slidesContainer = events.filter((event, index) => index === 0 || index % 4 === 0)
    slidesContainer.forEach((slideX,index) => {
        slideX = document.createElement("div")
        if (index === 0) {
            slideX.classList.add("active")
        }
        slideX.classList.add("carousel-item")
        slideX.id = `slideCard${index}`
        slidesContainer[index] = slideX
        cardCarousel.appendChild(createSlides(slideX,index,dataPers.currentDate,events))
    }) 
    return cardCarousel.innerHTML
}
const indicatorCreator = (CarouselInner)=>{
    let slides = CarouselInner.childElementCount
    let indicators = document.createElement("div")
    for (let i = 0; i < slides; i++) {
        let atributos = `type="button" data-bs-target="#cardCarousel" data-bs-slide-to="${i}" aria-label="Slide ${i + 1}"`
        if (i === 0) {
            atributos += ` class="active" aria-current="true"`
        }
        indicators.innerHTML += `<button ${atributos}></button>`
    }
    return indicators.innerHTML
}
function checksCreator(dataPers,checkboxContainer) {
    let allCategories = dataPers.events.map(event => event.category)
    allCategories = allCategories.filter((value, index, array) => array.indexOf(value) === index)
    allCategories.forEach(category => {
        let checkbox = document.createElement("div")
        checkbox.className = "form-check d-flex justify-content-center gap-lg-1"
        checkbox.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${category.toLowerCase()}" id="${category}" name="category">
        <label class="form-check-label fs-7" for="${category}">${category}</label>`
        checkboxContainer.appendChild(checkbox)
    })
    return checkboxContainer.innerHTML
}
function searchEventText(text, events) {
    let eventsFilterText = events.filter(event => {
        for (const property in event) {
            const element = event[property].toString().toLowerCase()
            if (element.includes(text.toLowerCase())) {
                return true
            } 
        }
        return false
    })
    return eventsFilterText
}
function searchEventCategory(categories, events) {
    if (categories.length > 0) {
        let eventsFilterCategory = events.filter(event => {
            return categories.some(category => category.toLowerCase() == event.category.toLowerCase())
        });
        return eventsFilterCategory
    }
    return events
}
function printFilterCards(inputsContainer,dataInit) {
    let dataFiltered = dataInit
    let filterText = document.getElementById("inputSearch").value.trim()
    let categories = inputsContainer.filter(input => input.firstElementChild.checked)
    categories = categories.map(category => category.firstElementChild.value)
    let eventsFilterText = searchEventText(filterText, dataInit.events)
    let eventsFilterCategory = searchEventCategory(categories, eventsFilterText)
    renderCards (dataFiltered,eventsFilterCategory)
    if (!cardCarouselInner.innerHTML) {
        cardCarouselInner.innerHTML = `<h3 class="title">No se encontro ningun resultado para su busqueda</h3>`
    }
}
function renderCards (data,events) {
    cardCarouselInner.innerHTML = createCards(data,events)
    cardsIndicators.innerHTML = indicatorCreator(cardCarouselInner)
}
function formSearchEvents(dataInit) {
    //CHECKBOXES
    const checkboxContainer = document.getElementById("checksContainer")
    checkboxContainer.innerHTML = checksCreator(dataInit,checkboxContainer)
    let checks = Array.from(document.getElementsByClassName("form-check-input"))
    const checkContainers = Array.from(document.getElementsByClassName("form-check"))
    //Filtro de Busqueda
    let formSearch = document.forms[0]
    let inputsContainer = Array.from(formSearch[0].children)
    let ckeckAllCategories = inputsContainer.shift()
    ckeckAllCategories = ckeckAllCategories.firstElementChild
    checkboxContainer.addEventListener("change", () => {
        printFilterCards(inputsContainer,dataInit)
    })
    formSearch.addEventListener("submit", e => { 
        e.preventDefault()
        printFilterCards(inputsContainer,dataInit)
    })
    // Checkboxes Ternario
    checkContainers.forEach((checkContainer,index) => {
        const check = checks[index]
        checkContainer.addEventListener("change", e => {
            if (check.checked) {
                e.target.parentElement.classList.add("checked")
                return
            }
            e.target.parentElement.classList.remove("checked")
        })
    })
    formSearch[0].addEventListener("click", e => {
        if (e.target.name == "category") {
            let checkboxTarget = e.target
            if (checkboxTarget == ckeckAllCategories) {
                checks.forEach(check => check.checked = false)
                ckeckAllCategories.checked = true
                return
            }
            if (checkContainers.some(checkContainer => checkContainer.firstElementChild.checked)) {
                ckeckAllCategories.checked = false
                return
            }
            ckeckAllCategories.checked = true
        }
    })
}
//DETAILS
function createCardDetails(id,dataInit) {
    let eventInfo = dataInit.events.find(event => event._id == id)
    let card = document.createElement("div")
    let pastOrUp = timeCard(dataInit.currentDate, eventInfo)
    pastOrUp? pastOrUp = ["e-past","Assistance"]: pastOrUp = ["e-upcoming","Estimate"]
    card.className = `container-xl d-flex card flex-row flex-wrap mb-4 p-0 ${pastOrUp[0]} event-card m-md-5 m-lg-0 mb-lg-4 align-items-center`
    card.innerHTML =
    `<img class="col-12 col-lg-6 img-details" src="${eventInfo.image}" alt="EventImage">
    <div class=" border-0 p-0 col-12 col-lg-6">
        <div class="card-header">
            <div class="card-title">
                <h3>${eventInfo.name}</h3>
            </div>
        </div>
        <div class="card-body">
            <div class="card-body d-flex flex-wrap gap-3">
                <div class="card-group">
                    <p class="card-subtitle me-2">Date: </p>
                    <p class="card-text">${eventInfo.date}</p>
                </div>
                <div class="card-group card-text">
                    <p class="card-subtitle me-2">Place: </p>
                    <p class="card-text">${eventInfo.place}</p>
                </div>
            </div>
            <div class="card-body d-flex flex-wrap gap-3">
                <div class="card-group">
                    <p class="card-subtitle me-2">Category: </p>
                    <p class="card-text">${eventInfo.category}</p>
                </div>
                <div class="card-group card-text">
                    <p class="card-subtitle me-2">Description: </p>
                    <p class="card-text">${eventInfo.description}</p>
                </div>
            </div>
            <div class="card-body d-flex flex-wrap gap-3">
                <div class="card-group">
                    <p class="card-subtitle me-2">Capacity: </p>
                    <p class="card-text">${eventInfo.capacity}</p>
                </div>
                <div class="card-group card-text">
                    <p class="card-subtitle me-2">${pastOrUp[1]}:</p>
                    <p class="card-text">${eventInfo[pastOrUp[1].toLowerCase()]}</p>
                </div>
            </div>
            <div class="card-footer">
                <p class="card-text">Price: $${eventInfo.price}</p>
            </div>
        </div>
    </div>`
    return card
}
function renderDetails (dataInit) {
    const navDetails = document.getElementById("navDetails")
    const mainDetails = document.getElementById("mainDetails")
    const id = new URLSearchParams(location.search).get("id")
    let idNextUrl = parseInt(id)+1
    let idPreviousUrl = parseInt(id)-1
    if (idNextUrl > dataInit.events.length) {
        idNextUrl = 1
    }
    if (idPreviousUrl == 0) {
        idPreviousUrl = dataInit.events.length
    }
    navDetails.innerHTML =
    `<div class="carousel-inner">
        <h1 class="title">Details</h1>
    </div>
    <a class="carousel-control-prev" href="./index.html">
        <span class="bi bi-box-arrow-left"></span>
    </a>`
    mainDetails.appendChild(createCardDetails(id,dataInit))
}
//STATS

function renderStats(dataInit) {
    
}
//----------
async function getDataEvents() {
    try {
        const res = await fetch("https://amazing-events.herokuapp.com/api/events")
        const dataInit = await res.json()
        return dataInit
    } catch (error) {
        console.log(error)
    }
}
async function renderPage() {
    let dataInit = await getDataEvents()
    switch (document.title) {
        case "Details":
            renderDetails(dataInit)
            break;
        case "Stats":
            console.log("Stats Page")
            break;
        default:
            renderCards(dataInit, dataInit.events);
            formSearchEvents(dataInit);
            break;
    }
}
const cardCarouselInner = document.getElementById("cardCarouselInner")
const cardsIndicators = document.getElementById("cardsIndicators")

renderPage()