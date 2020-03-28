(function () {
  // new variable
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []

  const dataPanel = document.getElementById('data-panel')

  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')

  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []

  const modeSelector = document.getElementById('mode-selector')

  const genreList = document.getElementById('genres-list')
  
  
  const genres = {
    "1": "Action",
    "2": "Adventure",
    "3": "Animation",
    "4": "Comedy",
    "5": "Crime",
    "6": "Documentary",
    "7": "Drama",
    "8": "Family",
    "9": "Fantasy",
    "10": "History",
    "11": "Horror",
    "12": "Music",
    "13": "Mystery",
    "14": "Romance",
    "15": "Science Fiction",
    "16": "TV Movie",
    "17": "Thriller",
    "18": "War",
    "19": "Western"
  }

 
  genreList.innerHTML = Object.entries(genres).map(genre => `
      <li class="nav-item">
        <a class="nav-link " data-toggle="pill" href="#" data-id="${genre[0]}" >${genre[1]}</a>
    `
  ).join('')

  genreList.addEventListener('click', event =>{
    console.log("here1 = " + event.target)
    axios.get(INDEX_URL) 
      .then((response) => {
        let clickGenreId = Number(event.target.dataset.id)
        let results = []
        data.forEach(movie => {
          if (movie.genres.some((element) => element === clickGenreId)){
            results.push(movie)
          } 
        })
        getTotalPages(results)
        getPageData(1, results)
        nowData = results
        nowThisPage = 1
        
      }).catch((err) => console.log(err))
    
  })


  axios.get(INDEX_URL) 
    .then((response) => {
      data.push(...response.data.results)
      console.log(data)
      getTotalPages(data)
      getPageData(1, data)
      
      nowData = data
    }).catch((err) => console.log(err))



  let modetype = 'modeCard'

  /* 監聽點擊模式切換 */
  modeSelector.addEventListener('click', (event) => {
    if (event.target.matches('#mode-list')) {
      modetype = 'modeList'
    } else if (event.target.matches('#mode-card')) {
      modetype = 'modeCard'
    }
    getTotalPages(nowData)
    console.log(nowData)
    getPageData(nowThisPage, nowData)
    console.log('nowThisPage= ' + nowThisPage)
  })




  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      /* console.log(event.target.dataset.id) */
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })



  let nowData = []
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let results = []
    const regex = new RegExp(searchInput.value, 'i')
    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    getTotalPages(results)
    getPageData(1, results)
    nowData = results
    /* 搜尋字串後要重新設立目前頁數 */
    nowThisPage = 1
  })



  let nowThisPage = 1

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    nowThisPage = event.target.dataset.page
    if (event.target.tagName === 'A') {
      getPageData(nowThisPage)
    }
  })


  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }


  function getPageData(pageNum = 1, data) {
    console.log('getPageData=' + data)
    console.log(data)
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }


  /* 直式電影清單 */
  /* function displayListDataList(data) {
    let htmlContent = ''
    let genreLabel = ''
    data.forEach(function (item) {
      genreLabel = displayGenre(item)
      htmlContent += `
        <div class="list w-100">
          <hr>
          <div class="single-movie d-flex justify-content-between">
            <div class="info">
              <p class="text-capitalize">${item.title}</p>
            </div>
            <div id="show-genre ">
              ${genreLabel}
            </div>
          <div class="buttion">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${ item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div> 
      `
    })
    return htmlContent
  }
 */
  /* 卡片式電影清單 */
  /* function displayCardDataList(data) {
    let htmlContent = ''
    let genreLabel = ''
    data.forEach(function (item) {
      genreLabel = displayGenre(item)
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>
              <div id="show-genre">
                ${genreLabel}
              </div>
            </div>

            

            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
<button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
      
    })
    return htmlContent
  } */
  
  /* 顯示電影類型標籤 */
  function displayGenre(data){
    let genreLabel = ''
    movieGenres = data.genres
    movieGenres.forEach(movieGenre => {
      genreLabel += `
        <h6 class="badge badge-secondary">${genres[movieGenre]}</h6>
      `
    })
    return genreLabel
    
  }



  function displayDataList(data) {
    let htmlContent = ''
    let genreLabel = ''
    if (modetype === 'modeList') {
      data.forEach(function (item) {
        genreLabel = displayGenre(item)
        htmlContent += `
        <div class="list w-100">
          <hr>
          <div class="single-movie d-flex justify-content-between">
            <div class="info">
              <p class="text-capitalize">${item.title}</p>
            </div>
            <div id="show-genre ">
              ${genreLabel}
            </div>
          <div class="buttion">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${ item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div> 
      `
      })
    } else if (modetype === 'modeCard') {
      data.forEach(function (item) {
        genreLabel = displayGenre(item)
        htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>
              <div id="show-genre">
                ${genreLabel}
              </div>
            </div>

            

            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
<button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `

      })
    }

    dataPanel.innerHTML = htmlContent
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    }).catch((err) => console.log(err))
  }

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    console.log(list)
    console.log(movie)

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

})()




