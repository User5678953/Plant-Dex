window.onload = () => {
  const apiURL = 'https://perenual.com/api/species-list'
  const apiKey = 'sk-tscM64c545f72b5721675'
  const searchInput = document.getElementById('userSearchInput')
  const searchButton = document.getElementById('searchButton')
  
// List of Query Parameters for the Plant/Botanic API

  // key (Required): A secret/unique number to gain access to the API.
  // page (Optional): An integer representing the page number you want to see. Default is 1.
  // q (Optional): A string/query consisting of keywords that are used to search for names of species.
  // edible (Optional): A boolean indicating if the plant species is edible or not for consumption. Default is NULL.
  // poisonous (Optional): A boolean indicating if the plant species is poisonous or not. Default is NULL.
  // cycle (Optional): A string representing the plant cycle of the species. Options are 'perennial', 'annual', 'biennial', 'biannual'.
  // watering (Optional): A string representing the watering amount of the species. Options are 'frequent', 'average', 'minimum', 'none'.
  // sunlight (Optional): A string representing the sunlight amount of the species. Options are 'full_shade', 'part_shade', 'sun-part_shade', 'full_sun'.
  // indoor (Optional): A boolean indicating if the plant species is indoors. Default is NULL.
  // hardiness (Optional): An integer representing the hardiness zone of the plant species. Valid zone options are 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13.

//Event listner for user 'click' on button, executes fetch request to API here
  searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim()
    console.log('Search Term:', searchTerm)

    const queryParams = new URLSearchParams({
      key: apiKey,
      q: searchTerm
    })
//concatenate user string input with API query parameters to display all relevant info
    fetch(apiURL + '?' + queryParams)
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data)
        displaySearchResults(data) //call display fucntion to show results to user
      })
//Error handling in the event of failed fetch, display to user      
      .catch(error => {
        console.error('Error Fetching Data', error)
        const errorMessageElement = document.getElementById('errorMessage')
        errorMessageElement.textContent = 'Oops! It seems like we failed to fetch the request in full. Some results may not be available';
        errorMessageElement.style.display = 'block' // inline css for message display
      });
  });
};

function displaySearchResults(data) {
  console.log('Displaying search results:', data)

// Clear any previous search results on new search
  const searchResultsDisplayLocation = document.querySelector('.search-results');
  searchResultsDisplayLocation.innerHTML = ''

//Psudeo logic for parsing the API objects and calling specific values
// Check if there are any results with user input string within API object
    //if (data exists AND data.data exists AND data.data is an array AND data.data.length > 0) {
    // Execute this block if there are search results available for the current user input

    // Display the search results on HTML, reviewed JSON sample doc from API for object structure. This os common to all searches!
    //For each plant in data.data {}
       // Display plant.common_name
       // Display plant scientific_name
       // Display plant.sunlight[0]
       // Display plant.watering
       // Display plant.cycle
       // Display plant.default_image.medium_url

  if (data && Array.isArray(data.data) && data.data.length > 0) { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Array
    // Iterate through each plant in the API response
    data.data.forEach(plant => {
      // Display the results for the current plant, console.log each value for debugging 
      const plantName = plant.common_name
      console.log('Plant Name:', plantName)

      const scientificName = plant.scientific_name.join(', ');
      console.log('Plant Name:', scientificName)

      const sunlight = plant.sunlight[0] || 'Sunlight information not available'
      console.log('Sunlight:', sunlight)

      const watering = plant.watering || 'Watering information not available'
      console.log('Watering:', watering);

      const cycle = plant.cycle || 'Cycle information not available'
      console.log('Cycle:', cycle)

      const imageURL = plant.default_image.medium_url
      console.log('Image URL:', imageURL)

      // Create a new result element for the current plant
      const resultElement = document.createElement('div')
      resultElement.innerHTML = `
        <h2>${plantName}</h2>
        <p>Scientific Name: ${scientificName}</p>
        <p>Sunlight Requirement: ${sunlight}</p>
        <p>Watering Needs: ${watering}</p>
        <p>Cycle: ${cycle}</p>
        <img src="${imageURL}" alt="${plantName} Image">
      `;

      // Append the result element to the search results display location
      searchResultsDisplayLocation.appendChild(resultElement)
    });
  } else {
    // Display message if no results found for the given plant
    console.log('No results found:', data)
    const resultElement = document.createElement('div')
    resultElement.innerHTML = 'No results found for the given plant.'
    //Using append child method to parent, https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
    searchResultsDisplayLocation.appendChild(resultElement)
  }
}
