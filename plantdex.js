// Global variables to track the current plant index, the last API response, API URL, and API Key
let currentPlantIndex = 0;
let lastAPIResponse;
const apiURL = 'https://perenual.com/api/species-list';
const apiKey = 'sk-tscM64c545f72b5721675';

// Execute when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get elements from the DOM
  const searchInput = document.getElementById('userSearchInput');
  const searchButton = document.getElementById('searchButton');
  const nextButton = document.getElementById('nextButton');
  const prevButton = document.getElementById('prevButton');

  // Event listener for the search button click, performs the search operation
  searchButton.addEventListener('click', () => {
    console.log('Search button clicked');
    performSearch(searchInput.value);
  });

  // Event listener for the "next" button to show the next plant in the results
  nextButton.addEventListener('click', () => {
    console.log('Next button clicked');
    navigatePlants('next');
  });

  // Event listener for the "previous" button to show the previous plant in the results
  prevButton.addEventListener('click', () => {
    console.log('Previous button clicked');
    navigatePlants('prev');
  });
});


// Function to perform fetch with a timeout
function fetchWithTimeout(resource, options = {}, timeout = 8000) {  // 8 seconds timeout
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(resource, {
    ...options,
    signal: controller.signal
  })
  .then(response => {
    clearTimeout(id);
    if (response.status === 429) {
      throw new Error('429 Too Many Requests');
    }
    return response;
  })
  .catch(error => {
    clearTimeout(id);
    throw error;
  });
}


// Function to perform search using the API
function performSearch(searchTerm) {
  console.log('Search Term:', searchTerm);
  const queryParams = new URLSearchParams({
    key: apiKey,
    q: searchTerm.trim()
  });

  fetchWithTimeout(`${apiURL}?${queryParams}`, {}, 8000)
    .then(response => response.json())
    .then(data => {
      console.log('API Response:', data);
      lastAPIResponse = data; // Store the API data globally
      currentPlantIndex = 0; // Reset index to 0 for new search results
      displaySearchResults(data, currentPlantIndex); // Display results starting from the first entry
    })
    .catch(error => {
      console.error('Error Fetching Data', error);
      displayError('Error Fetching Data', error);
    });
}

// Function to handle navigation between plants (next and previous)
function navigatePlants(direction) {
  if (!lastAPIResponse || !lastAPIResponse.data) return; // Guard clause if no data
  currentPlantIndex += direction === 'next' ? 1 : -1; // Adjust index based on direction
  currentPlantIndex = Math.max(0, Math.min(currentPlantIndex, lastAPIResponse.data.length - 1)); // Clamp index within valid range
  displaySearchResults(lastAPIResponse, currentPlantIndex); // Display the plant at new index
}

// Function to display the search results using the API data
function displaySearchResults(data, index) {
  const searchResultsDisplayLocation = document.querySelector('.search-results');
  searchResultsDisplayLocation.innerHTML = ''; // Clear previous results

  if (data && Array.isArray(data.data) && data.data.length > index) {
    const plant = data.data[index]; // Extract plant data at current index
    const resultElement = createPlantElement(plant); // Create HTML element for displaying the plant
    searchResultsDisplayLocation.appendChild(resultElement); // Add new result to the page
  } else {
    searchResultsDisplayLocation.innerHTML = '<div>No results found for the given plant.</div>'; // Show message if no results
  }
}

// Function to create HTML element for plant data
function createPlantElement(plant) {
  const { common_name, scientific_name, sunlight, watering, default_image } = plant;
  const imageURL = default_image?.medium_url || 'No Image Available';

  const resultElement = document.createElement('div');
  resultElement.classList.add('plant-result');
  resultElement.innerHTML = `
    <h2>${common_name || 'Common Name not available'}</h2>
    <img src="${imageURL}" alt="Image of ${common_name}">
    <button class="get-details-button">Get Details</button>
    <div class="plant-summary">
      <p>Scientific Name: ${scientific_name.join(', ') || 'Scientific Name not available'}</p>
      <p>Sunlight Requirement: ${sunlight[0] || 'Sunlight information not available'}</p>
      <p>Watering Needs: ${watering || 'Watering information not available'}</p>
    </div>
    <div class="plant-details"></div> <!-- Container for additional details -->
  `;

  const detailsButton = resultElement.querySelector('.get-details-button');
  const detailsContainer = resultElement.querySelector('.plant-details');
  detailsButton.addEventListener('click', () => {
    if (detailsContainer.innerHTML === '') {
      fetchPlantDetails(plant.id, detailsContainer);
    } else {
      detailsContainer.innerHTML = ''; // Toggle visibility of details
    }
  });
  return resultElement;
}

// Function to display an error message when the API call fails
function displayError(message, error) {
  console.error(message, error);
  let errorMessageElement = document.getElementById('errorMessage');
  if (!errorMessageElement) {
    errorMessageElement = document.createElement('div');
    errorMessageElement.id = 'errorMessage';
    document.body.appendChild(errorMessageElement);
  }
  
  // Handling rate limit specific error message
  if (error.message.includes('429')) {
    errorMessageElement.textContent = 'This API is rate limited, please wait a few moments before trying again.';
  } else {
    errorMessageElement.textContent = 'Oops! Something went wrong. Please try again later.';
  }

  errorMessageElement.style.display = 'block'; // Make error message visible
}


// Function to fetch the details of a specific plant using its ID
function fetchPlantDetails(plantId, displayElement) {
  const detailsURL = `https://perenual.com/api/species/details/${plantId}`;
  const url = new URL(detailsURL);
  url.searchParams.append('key', apiKey);

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(plantDetails => {
      displayPlantDetails(plantDetails, displayElement); // Pass the display element to the display function
    })
    .catch(error => {
      console.error('Error Fetching Plant Details', error);
      displayError('Error Fetching Plant Details', error);
    });
}

// Function to display the plant details in a specific DOM element
function displayPlantDetails(plantDetails, plantDetailsElement) {
  const detailsHTML = `
    <h3>Details:</h3>
    <p>Family: ${plantDetails.family || 'Not available'}</p>
    <p>Care Level: ${plantDetails.care_level || 'Not available'}</p>
    <p>Cycle: ${plantDetails.cycle || 'Not available'}</p>
    <p>Description: ${plantDetails.description || 'Not available'}</p>
  `;

  plantDetailsElement.innerHTML = detailsHTML;
  plantDetailsElement.style.display = 'block'; // Make sure details are shown
}
