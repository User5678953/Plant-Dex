let currentPlantIndex = 0
let lastAPIresponse;

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
        lastAPIresponse = data //store api data
        currentPlantIndex = 0
        displaySearchResults(data, currentPlantIndex); //call display function to show results to user
      })
      //Error handling in the event of failed fetch, display to user
      .catch(error => {
        console.error('Error Fetching Data', error)
        const errorMessageElement = document.getElementById('errorMessage')
        errorMessageElement.textContent =
          'Oops! It seems like we failed to fetch the request in full. Some results may not be available'
        errorMessageElement.style.display = 'block'; // inline css for message display
      })
  })
}
 // Event listener for "next" button to show the next plant
 document.getElementById('nextButton').addEventListener('click', () => {
  currentPlantIndex++; // Increment the index
  displaySearchResults(lastAPIresponse, currentPlantIndex);
});

// Event listener for "previous" button to show the previous plant
document.getElementById('prevButton').addEventListener('click', () => {
  currentPlantIndex--; // Decrement the index
  displaySearchResults(lastAPIresponse, currentPlantIndex)
})

// Function to display the search results for the current plant at the specified index
function displaySearchResults(data, index) {
console.log('Displaying search results:', data)

 // Clear any previous search results on new search
 const searchResultsDisplayLocation = document.querySelector('.search-results');
 searchResultsDisplayLocation.innerHTML = ''

 if (data && Array.isArray(data.data) && data.data.length > 0) {
   // Ensure the index is within the valid range
   index = Math.max(0, Math.min(index, data.data.length - 1))

   // Get the plant at the specified index
   const plant = data.data[index]

      // Display the results for the current plant
      const plantName = plant.common_name || 'Common Name not available'
      const scientificName = plant.scientific_name.join(', ') || 'Scientific Name not available'
      const sunlight = plant.sunlight[0] || 'Sunlight information not available'
      const watering = plant.watering || 'Watering information not available'
      

  // Check if medium_url exists, otherwise set a default image URL
    const imageURL = plant.default_image?.medium_url || 'No Image Available'


      // new result element for the current plant
      const resultElement = document.createElement('div')
      resultElement.innerHTML = `
        <h2>${plantName}</h2>
        <img src="${imageURL}" alt="${plantName} Image">
        <button class="get-details-button">Get Details</button>
        <p>Scientific Name: ${scientificName}</p>
        <p>Sunlight Requirement: ${sunlight}</p>
        <p>Watering Needs: ${watering}</p>
      `;
    // Append the result element to the search results div
    searchResultsDisplayLocation.appendChild(resultElement)

    // Display the plant details beneath the plant photo
    const plantDetailsElement = document.createElement('div')
    plantDetailsElement.setAttribute('id', 'currentPlantDetails')
    searchResultsDisplayLocation.appendChild(plantDetailsElement)

    // Add a click event listener to fetch plant details when the user clicks on a specific plant
    resultElement.addEventListener('click', () => {
      fetchPlantDetails(plant.id)
        .then(plantDetails => {
          displayPlantDetails(plantDetails, plantDetailsElement)
        })
        .catch(error => {
          const errorMessageElement = document.createElement('p')
          errorMessageElement.textContent = 'Error fetching plant details.'
          plantDetailsElement.innerHTML = ''; // Clear previous content
          plantDetailsElement.appendChild(errorMessageElement)
          console.error('Error Fetching Plant Details', error)
        })
    })
  } else {
    // Display message if no results found for the given plant
    console.log('No results found:', data);
    const resultElement = document.createElement('div')
    resultElement.innerHTML = 'No results found for the given plant.'
    searchResultsDisplayLocation.appendChild(resultElement)
  }
}

// Function to fetch the details of a specific plant using its ID
function fetchPlantDetails(plantId) {
  const apiURL = `https://perenual.com/api/species/details/${plantId}`
  const apiKey = 'sk-tscM64c545f72b5721675'

  // Create the URL with the query parameter
  const url = new URL(apiURL);
  url.searchParams.append('key', apiKey)

  // Fetch the plant details and return the JSON response
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    });
}

// Function to display the plant details in the provided element
function displayPlantDetails(plantDetails, plantDetailsElement) {
  plantDetailsElement.innerHTML = ''; // Clear previous content

  if (!plantDetails || Object.keys(plantDetails).length === 0) {
    const errorMessageElement = document.createElement('p');
    errorMessageElement.textContent = 'No details available for this plant.';
    plantDetailsElement.appendChild(errorMessageElement);
    return;
  }

  // Create an HTML string to display the plant details
  const detailsHTML = `
    <h3>Plant Details:</h3>
    <p>Common Name: ${plantDetails.common_name || 'Not available'}</p>
    <p>Scientific Name: ${plantDetails.scientific_name?.join(', ') || 'Not available'}</p>
    <p>Family: ${plantDetails.family || 'Not available'}</p>
    <p>Care Level: ${plantDetails.care_level || 'Not available'}</p>
    <p>Cycle: ${plantDetails.cycle || 'Not available'}</p>
    <p>Description: ${plantDetails.description || 'Not available'}</p>
  `;

  // Append the plant details to the element
  plantDetailsElement.innerHTML = detailsHTML;
}     
