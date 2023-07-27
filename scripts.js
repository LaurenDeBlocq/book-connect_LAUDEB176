import { state, BOOKS_PER_PAGE, authors, genres, books } from "./data.js";
import { html, createPreviewHtml } from "./view.js";

const matches = books
state.pageNumber = 1;
state.theme = 'light'

if (!books && !Array.isArray(books)) throw new Error('Source required') 
//if (!range && range.length < 2) throw new Error('Range must be an array with two numbers')

// day = {
//     dark: '10, 10, 20',
//     light: '255, 255, 255',
// }

// night = {
//     dark: '255, 255, 255',
//     light: '10, 10, 20',
// }

/* -------------------- Functions which affect the page -------------------- */

/**
 * Creates the load out of new books dependant on what page the user is on. 
 */
const createPage = () => {
    const startPosition = (state.pageNumber - 1) * BOOKS_PER_PAGE
    const endPosition = startPosition + BOOKS_PER_PAGE - 1
    
    const fragment = document.createDocumentFragment()
    const extracted = books.slice(startPosition, endPosition + 1)

    for (let i = 0; i < extracted.length; i++) {
        const { author, image, title, id } = extracted[i]
        state.loaded[id] = {id, image, author, title}
        const preview = createPreviewHtml(state.loaded[id])
  
        fragment.appendChild(preview)
    }

    state.pageNumber += 1
    html.list.items.appendChild(fragment)
}


/**
 * Fills in the text on the list button.
 */
const listButtonText = () => {
    html.list.button.innerHTML = `
    Show More <span class="list__remaining">(${books.length - Object.keys(state.loaded).length})</span>
    `
}

/**
 * Creates list options for the author drop down in Search.
 */
const createAuthorOptions = () => {
    const fragment = document.createDocumentFragment()
    
    const option1 = document.createElement('option')
    option1.value = 'any'
    option1.innerText = 'All Authors'
    fragment.appendChild(option1)

    let authorID = Object.keys(authors)
    authorID.forEach((id) =>{
        const option = document.createElement('option')
        option.value = `${id}`
        option.innerText = authors[`${id}`]
        fragment.appendChild(option)
    }
    )

    html.search.authors.appendChild(fragment)
}

/**
 * Creates list options for the genres drop down in Search
 */
const createGenreOptions = () => {
    const fragment = document.createDocumentFragment()
    
    const option1 = document.createElement('option')
    option1.value = 'any'
    option1.innerText = 'All Genres'
    fragment.appendChild(option1)

    let genreID = Object.keys(genres)
    genreID.forEach((id) =>{
        const option = document.createElement('option')
        option.value = `${id}`
        option.innerText = genres[`${id}`]
        fragment.appendChild(option)
    }
    )

    html.search.genres.appendChild(fragment)
}

/* -------------------- ON INIT --------------------*/
createPage()
listButtonText()
createAuthorOptions()
createGenreOptions()

/* -------------------- SEARCH FEATURE -------------------- */
/**
 * Takes in a value and searches through the books Array to find partial
 * and full matches. Returns an array with those matches.
 */
const titleSearch = (titleValue) =>{
    const titleArray = []

    for (let i = 0; i < books.length; i++){
        if (books[i]['title'].toLowerCase().includes(titleValue.toLowerCase())){
            titleArray.push(books[i])
        }
    }

    return titleArray
}

/**
 *  Takes in a string id relating to a genre. Loops through the Books array and
 *  stores any books with a matching genre id in a new array. Returns the 
 *  matching books
 */
const genreSearch = (genreValue) =>{
    const genreArray = []

    for (let i = 0; i < books.length; i++ ) {
        const bookGenres = books[i]['genres']
        for (let j = 0; j < bookGenres.length; j++){
            if (bookGenres[j] === genreValue){
                genreArray.push(books[i])
            }
        }
    }

    return genreArray
}

/**
 * Takes in an id relating to a author. Loops through the Books array and
 * stores any books with a matching author id in a new array. Returns the 
 * matching books 
 */
const authorSearch = (authorValue) =>{
    const authorArray = []

    for (let i = 0; i < books.length; i++ ) {
        if (books[i]['author'] === authorValue){
            authorArray.push(books[i])
        }
    }
    
    return authorArray
}



/* ------------------- EVENT HANDLERS ------------------- */
const handleListButton = (event) =>{
    createPage()
    listButtonText()
}

const handleSearchToggle = (event) =>{
    html.search.overlay.toggleAttribute('open')
}

/**
 * This handler is going to be a bit more tricky. Fundamentally, it breaks down into 4 components:
 * 1. If there is a value in the title input, then we need to loop through the books array to find
 *    a match. However, we also need to find partial matches, not just exact matches.
 * 
 * 2. If there is a value in the genre input, we gotta loop through the 'genres' property in the 
 *    individual books objects in the books array and return all books with that genre.
 * 
 * 3. If there is a value in the author input, we must loop through the 'author; property in each 
 *    individual books object in the books array and return all books with that author.
 * 
 * Lastly, we must compare the different book objects returned, and create a 
 * page using those objects. If only one search type was made (eg just an author), then the whole 
 * relevant author array must be returned. If a combined search was made, then just the duplicates in
 * both or all relevant arrays must be returned.
 */
const handleSearchSubmit = (event) => {
    event.preventDefault()
    const titleValue = event.target[0].value.trim()
    const genreID = event.target[1].value
    const authorID = event.target[2].value

    const titleArr = []
    const genreArr = []
    const authorArr = []
    const searchResults = []

    if (titleValue) {titleArr.push(titleSearch(titleValue))}
    if (genreID) {genreArr.push(genreSearch(genreID))}
    if (authorID) {authorArr.push(authorSearch(authorID))}
 
        for (let i = 0; i < titleArr[0].length; i++){
            console.log("title for-loop works");
            console.log(genreArr[0]);
            for (let book in genreArr[0]){
                
                if (JSON.stringify(titleArr[0][i]) === JSON.stringify(genreArr[0][book])){
                    searchResults.push(titleArr[i])
                    // titleArr.splice(i, 1)
                    // genreArr.splice(j, 1)
                    console.log('if statement works');
                }
            }
        }
        console.log(searchResults);
    if (titleValue && !genreID && !authorID){
    
    } else if (titleValue && !genreID && authorID){
    
    } else if (!titleValue && genreID && authorID){
    
    } else if (!titleValue && genreID && !authorID){

    } else if (!titleValue && !genreID && authorID){

    }

    
    html.search.title.value = ''
    html.search.authors.value = 'any'
    html.search.genres.value = 'any'
    
    handleSearchToggle()
}

const handleSettingsToggle = (event) =>{
    html.settings.overlay.toggleAttribute('open')
}

const handleSettingsSubmit = (event) => {
    event.preventDefault()
    const theme = event.srcElement[0].value

    theme === window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
    //v = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches? 'night' : 'day'


    if (theme == 'night'){
        // use the media query css code

    } else {
        // use the basic css code
    }
    
    // if (event.srcElement[0].value == 'night') {
    //     console.log("the code runs");
    //    document.body.style.colorScheme = "dark"
    // }
    handleSettingsToggle()
}

html.list.button.addEventListener('click', handleListButton)

html.search.button.addEventListener('click', handleSearchToggle)
html.search.cancel.addEventListener('click', handleSearchToggle)
html.search.form.addEventListener('submit', handleSearchSubmit)

html.settings.button.addEventListener('click', handleSettingsToggle)
html.settings.cancel.addEventListener('click', handleSettingsToggle)
html.settings.form.addEventListener('submit', handleSettingsSubmit)


// /** */
// data-settings-theme.value === window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
// v = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches? 'night' : 'day'

// documentElement.style.setProperty('--color-dark', css[v].dark);
// documentElement.style.setProperty('--color-light', css[v].light);
// html.list.button.innerText = "Show more (books.length - BOOKS_PER_PAGE)"

// data-list-button.disabled = !(matches.length - [page * BOOKS_PER_PAGE] > 0)

// data-list-button.innerHTML = /* html */ [
//     '<span>Show more</span>',
//     '<span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>',
// ]

// /**
//  * create some event listeners to toggle dialogues.
//  */


// data-header-search.click() {
//     data-search-overlay.open === true ;
//     data-search-title.focus();
// }

// data-search-form.click(filters) {
//     preventDefault()
//     const formData = new FormData(event.target)
//     const filters = Object.fromEntries(formData)
//     result = []

//     for (book; booksList; i++) {
//         titleMatch = filters.title.trim() = '' && book.title.toLowerCase().includes[filters.title.toLowerCase()]
//         authorMatch = filters.author = 'any' || book.author === filters.author

//         {
//             genreMatch = filters.genre = 'any'
//             for (genre; book.genres; i++) { if singleGenre = filters.genre { genreMatch === true }}}
//         }

//         if titleMatch && authorMatch && genreMatch => result.push(book)
//     }

//     if display.length < 1 
//     data-list-message.class.add('list__message_show')
//     else data-list-message.class.remove('list__message_show')
    

//     data-list-items.innerHTML = ''
//     const fragment = document.createDocumentFragment()
//     const extracted = source.slice(range[0], range[1])

//     for ({ author, image, title, id }; extracted; i++) {
//         const { author: authorId, id, image, title } = props

//         element = document.createElement('button')
//         element.classList = 'preview'
//         element.setAttribute('data-preview', id)

//         element.innerHTML = /* html */ `
//             <img
//                 class="preview__image"
//                 src="${image}"
//             />
            
//             <div class="preview__info">
//                 <h3 class="preview__title">${title}</h3>
//                 <div class="preview__author">${authors[authorId]}</div>
//             </div>
//         `

//         fragment.appendChild(element)
//     }
    
//     data-list-items.appendChild(fragments)
//     initial === matches.length - [page * BOOKS_PER_PAGE]
//     remaining === hasRemaining ? initial : 0
//     data-list-button.disabled = initial > 0

//     data-list-button.innerHTML = /* html */ `
//         <span>Show more</span>
//         <span class="list__remaining"> (${remaining})</span>
//     `

//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     data-search-overlay.open = false
// }

// data-settings-overlay.submit; {
//     preventDefault()
//     const formData = new FormData(event.target)
//     const result = Object.fromEntries(formData)
//     document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
//     document.documentElement.style.setProperty('--color-light', css[result.theme].light);
//     data-settings-overlay).open === false
// }

// data-list-items.click() {
//     pathArray = Array.from(event.path || event.composedPath())
//     active;

//     for (node; pathArray; i++) {
//         if active break;
//         const previewId = node?.dataset?.preview
    
//         for (const singleBook of books) {
//             if (singleBook.id === id) active = singleBook
//         } 
//     }
    
//     if !active return
//     data-list-active.open === true
//     data-list-blur + data-list-image === active.image
//     data-list-title === active.title
    
//     data-list-subtitle === '${authors[active.author]} (${Date(active.published).year})'
//     data-list-description === active.description
// }
