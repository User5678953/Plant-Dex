alert('You are connected!') // Test CSS and HTML connection in browser

// API KEY = sk-kzbV64c08c9a33a321675
const apiURL = 'https://perenual.com/api/species-list?page=1&key=sk-kzbV64c08c9a33a321675'

// DOM References
const searchInput = document.getElementById('userSearchInput')
const searchButton = document.getElementById('searchButton')

// Event listener for search button 'click'
searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim();
  console.log('Search Term:', searchTerm);

  // Logic to fetch API info based on user input
  fetch(apiURL + `&q=${searchTerm}`)
    .then(response => {
      return response.json(); // call json file
    })
    .then(data => {
      console.log('API Response:', data);
    })
    .catch(error => {
      console.error('Error Fetching Data', error);
    });
});

//TESTED!!!! API results are able to be console.logged based on user input 