window.onload = () => {
  const apiURL = 'https://perenual.com/api/species-list'
  const apiKey = 'sk-tscM64c545f72b5721675'
  const searchInput = document.getElementById('userSearchInput')
  const searchButton = document.getElementById('searchButton')

  //Event listener for user 'click' on button, executes fetch request to API here
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
        displaySearchResults(data); //call display function to show results to user
      })
      //Error handling in the event of failed fetch, display to user
      .catch(error => {
        console.error('Error Fetching Data', error);
        const errorMessageElement = document.getElementById('errorMessage');
        errorMessageElement.textContent =
          'Oops! It seems like we failed to fetch the request in full. Some results may not be available';
        errorMessageElement.style.display = 'block'; // inline css for message display
      })
  })
}

function displaySearchResults(data) {
  console.log('Displaying search results:', data)

  // Clear any previous search results on new search
  const searchResultsDisplayLocation = document.querySelector('.search-results');
  searchResultsDisplayLocation.innerHTML = ''

  if (data && Array.isArray(data.data) && data.data.length > 0) {
    // Iterate through each plant in the API response
    data.data.forEach(plant => {
      // Display the results for the current plant
      const plantName = plant.common_name || 'Common Name not available'
      const scientificName = plant.scientific_name.join(', ') || 'Scientific Name not available'
      const sunlight = plant.sunlight[0] || 'Sunlight information not available'
      const watering = plant.watering || 'Watering information not available'
      const cycle = plant.cycle || 'Cycle information not available'
      const imageURL = plant.default_image.medium_url

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
    })
  } else {
    // Display message if no results found for the given plant
    console.log('No results found:', data);
    const resultElement = document.createElement('div');
    resultElement.innerHTML = 'No results found for the given plant.'
    //Using append child method to parent, https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
    searchResultsDisplayLocation.appendChild(resultElement)
  }
}