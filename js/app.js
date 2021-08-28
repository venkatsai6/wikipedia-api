"use-strict";

const submitButton = document.querySelector('#submit')
const input = document.querySelector('#input')
const errorSpan = document.querySelector('#error')
const resultsContainer = document.querySelector('#results')

// Wikipedia Search API Endpoint URL
const endpoint = 'https://en.wikipedia.org/w/api.php?'
const params = {
    origin: '*',
    format: 'json',
    action: 'query',
    prop: 'extracts',
    exchars: 180,
    exintro: true,
    explaintext: true,
    generator: 'search',
    gsrlimit: 20,
}

const disableUi = () => {
    input.disabled = true
    submitButton.disabled = true
}

const enableUi = () => {
    input.disabled = false
    submitButton.disabled = false
}

// const changeUiState = (isDisabled) => {
//     input.disabled = isDisabled
//     submitButton.disabled = isDisabled
// }


// clear current search results and show new results
const clearCurrentResults = () => {
    resultsContainer.innerHTML = ''
    errorSpan.innerHTML = ''
}

const isInputEmpty = (input) => {
    if (!input || !input === '') return true;
    return false;
}

const showError = (error) => {
    errorSpan.innerHTML += 
    `
    <div class="error-bg">
    <img style="float: left;" src="./assets/error-bg.png" width="300" height="200" alt="Error - Results Not Found">
    </div>
    <div class="error-details">
    <h3 style="margin-left: 300px; margin-top: 80px;">Oops!</h3>
    <p style="margin-left: 300px;">We couldn't find the results.</p>
    </div>

    `
}

const showResults = results => {
    results.forEach(result => {
       resultsContainer.innerHTML += 
       `
       <div class="results__item">
       <a class="card animated bounceInUp" href="https://en.wikipedia.org/?curid=${result.pageId}" target="_blank">
       <h2 class="results__item__title">${result.title}</h2>
       <p class="results__item__description">${result.intro}</p>
       </a>
       </div>

       ` 
    });
}

const gatheredData = pages => {
    const results = Object.values(pages).map(page => ({
        pageId: page.pageid,
        title: page.title,
        intro: page.extract,
    }))
    showResults(results);
}

// Register Event Listeners for Input Field and Search Button
const getData = async () => {
    //console.log('Data Received!')
    const userInput = input.value
    //console.log(userInput)
    if (isInputEmpty(userInput)) return

    params.gsrsearch = userInput
    clearCurrentResults();
    disableUi();

    try {
        const { data } = await axios.get(endpoint, { params })
        //console.log(data)
        if (data.error) throw new Error(data.error.info)
        gatheredData(data.query.pages)
    } catch {
        showError(error)
    } finally {
        enableUi();
    }

}

const handleKeyEvent = (e) => {
    if (e.key === 'Enter') {
        getData();
    }
}

const registerEventHandlers = () => {
    input.addEventListener('keydown', handleKeyEvent)
    submitButton.addEventListener('click', getData)
}

registerEventHandlers();

//Scroll to TOP
var mybutton = document.getElementById("scrollTopBtn");
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}