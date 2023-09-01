const API_KEY = "8b4628df";
const elForm = document.querySelector('.js-form');
const elSearchInput = document.querySelector('.js-search');
const elSelectInput = document.querySelector('.js-select');
const fragment = document.createDocumentFragment();
let elList = document.querySelector('.js-list');
let elLoadMoreBtn;
let page_counter = 1;
let loaded_items = 10;
elForm.addEventListener('submit', (evt) => {

   evt.preventDefault();
   if(elSearchInput.value.trim().length == 0) {
    elSearchInput.classList.add('error');
    return;
   }else {
    elSearchInput.classList.remove('error');
   }


   if(elSelectInput.value.trim().length > 0) {
     getData(`http://www.omdbapi.com/?s=${elSearchInput.value.trim()}&apikey=${API_KEY}&type=${elSelectInput.value.trim()}`);
     return;
   }

   getData(`http://www.omdbapi.com/?s=${elSearchInput.value.trim()}&apikey=${API_KEY}`);

});


load_more();

function load_more() {
    setTimeout(() => {
        elLoadMoreBtn = document.querySelector('.list__load-btn');
        if(elLoadMoreBtn) {
   
             elLoadMoreBtn.addEventListener('click', (evt) => {
                 elLoadMoreBtn.parentElement.remove();
                 ++page_counter;
                 getData(`http://www.omdbapi.com/?s=${elSearchInput.value.trim()}&apikey=${API_KEY}&page=${page_counter}`, false);
                 
                 loaded_items += 10;
             });
        }
    
         
        
       }, 1000);
}



function getData(url, clear = true) {
  
    fetch(url)
    .then(res => res.json())
    .then(data => {
       renderData(data, elList, clear);
    })
    .catch(err => {
        elList.innerHTML = `<p class="list__no-movie-desc">No result found !</p>`;
        console.log(err);
    })
}



function renderData(data, list, clear = true) {
    
    if(clear) {
        list.innerHTML = '';
    }

    data.Search.forEach(item => {
        // Creating elements 
        const liElement = document.createElement("li");
        const listImgWrapper = document.createElement("div");
        const listItemDetailsWrapper = document.createElement("div");
        const listItemInnerWrapper = document.createElement("div");
        const listImgElement = document.createElement("img");
        const listAnchorElement = document.createElement("a");
        const listPlayImgElement = document.createElement("img");
        const listItemTitle = document.createElement("h3");
        const listItemDesc1 = document.createElement("p");
        const listItemDesc2 = document.createElement("p");
        const listItemDesc3 = document.createElement("p");
        const listMovieYearElement = document.createElement("span");
        const listImdbidElement = document.createElement("span");
        const listTypeElement = document.createElement("span");
        // Provide values
        liElement.className = "list__item";
        listImgWrapper.className = "list__img-wrapper";
        listItemDetailsWrapper.className = "list__item-details";
        listItemInnerWrapper.className = "list__item-inner";
        listImgElement.className = "list__img";
        listImgElement.src = item.Poster != "N/A" ? item.Poster : "./images/no-image.png";
        listImgElement.alt = item.Title;
        listAnchorElement.className = "list__link";
        listAnchorElement.href = `https://www.imdb.com/title/${item.imdbID}/`;
        listAnchorElement.target = "blank";
        listPlayImgElement.className = "list__play-img";
        listPlayImgElement.src = "./images/play.png"
        listPlayImgElement.width = "30";
        listPlayImgElement.height = "30";
        listPlayImgElement.alt = "play icon";
        listItemTitle.className = "list__item-title";
        listItemTitle.title = item.Title;
        listItemTitle.textContent = item.Title;
        listItemDesc1.className = "list__item-desc";
        listItemDesc2.className = "list__item-desc";
        listItemDesc3.className = "list__item-desc";
        listItemDesc1.title = item.Year;
        listItemDesc2.title = item.imdbID;
        listItemDesc3.title = item.Type;
        listItemDesc1.textContent = "Year: ";
        listItemDesc2.textContent = "IMDB ID: ";
        listItemDesc3.textContent = "Type: ";
        listMovieYearElement.className = "list__movie-year";
        listImdbidElement.className = "list__imdb-id";
        listTypeElement.className = "list__movie-type";
        listMovieYearElement.textContent = item.Year;
        listImdbidElement.textContent = item.imdbID;
        listTypeElement.textContent = item.Type;
        // Appending elements
        listItemDesc1.appendChild(listMovieYearElement);
        listItemDesc2.appendChild(listImdbidElement);
        listItemDesc3.appendChild(listTypeElement);
        listItemInnerWrapper.append(listItemDesc1,listItemDesc2,listItemDesc3);
        listItemDetailsWrapper.append(listItemTitle,listItemInnerWrapper);
        listAnchorElement.appendChild(listPlayImgElement);
        listImgWrapper.append(listImgElement,listAnchorElement);
        liElement.append(listImgWrapper, listItemDetailsWrapper);
        // Add item to fragment
        fragment.appendChild(liElement);
         
     
    });
    // Add fragment to list 
    list.appendChild(fragment);
    

    // If more items, create load more button
    
    if(data.totalResults > loaded_items) {
        
        const liElement2 = document.createElement("li");
        const btnElement = document.createElement("button");
        liElement2.className = "list__item";
        btnElement.className = "list__load-btn";
        btnElement.type = "button"; 
        btnElement.textContent = "Load more...";
        liElement2.appendChild(btnElement);
        list.appendChild(liElement2);
        load_more();
    }




}


