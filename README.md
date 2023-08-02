

🌱 Welcome to plantdex
this app aims to be a user friendly plant index hence the aptly titled app 'plantdex'

API:https://perenual.com/docs/api

Tech: JS HTML CSS

Hosted by: Netifly

Installation instructions 

https://plant-dex-demo.netlify.app/plantdex.html



Main logic approach

1. Declare a variable to store the API response (lastAPIresponse).

2. When the page is fully loaded (window.onload):
   a. Set the API URL (apiURL) and API key (apiKey).
   b. Get the search input element (searchInput) and search button element (searchButton) from the DOM.
   c. Add a click event listener to the search button.
   d. Inside the event listener function:
      - Get the user's input search term from the search input field and trim any leading or trailing white spaces. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
      - Create a new URLSearchParams object called queryParams.
      - Add the API key and the trimmed search term to the queryParams.
      - Construct the full API URL by appending the queryParams to the base API URL.
      - Perform a fetch request to the constructed API URL.
      - Upon a successful response:
         - Convert the response to JSON format.
         - Store the JSON response data in the variable lastAPIresponse.
         - Log the API response data to the console.
      - If an error occurs during the fetch request:
         - Log an error message to the console.
         - Get the error message element from the DOM and display the error message to the user.

3. End of the window.onload function.

