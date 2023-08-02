

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

Issues/Fix: 
>Issue: I initially attempted to implement a carousel using JavaScript, but it was challenging to get it to work correctly. This is where I restarted from the basic fetch logic and tried a different approach like just using the next and previous buttons. unfortunately I confused myself and deleted my work to try to revert the code back to just the working fetch API. I should have just pulled the first commit to overwrite my broken carousel attempt. 

   >Fix: To simplify, I opted for next and previous buttons to navigate through search results, which provided a more straightforward solution. this created a carasouel effect. the challenge here and it took my a long time was that I needed to iterate through the plant index from the API within the display function. some plants didn't display photos and so in the abscense of, the code produced an error. The fix was to create logic that checked if the photo was available and if not, display default image. 

>Issue: Centering elements on the page, such as the "PlantDex" banner, search bar, buttons, and plant name, was required.

   >Fix: By applying CSS styles like display: flex, justify-content: center, and align-items: center, I achieved the desired centering effect.

>Issue: I wanted plant details to be displayed when clicking a separate "Get Details" button below the picture, rather than when clicking the picture itself.

   >Fix: I added a "Get Details" button and used a hover effect to fetch and display plant details on the right side of the page.


