alert('You are connected!')
// API KEY = sk-kzbV64c08c9a33a321675
const apiURL = 'https://perenual.com/api/species-list?page=1&key=sk-kzbV64c08c9a33a321675'

fetch('https://perenual.com/api/species-list?page=1&key=sk-kzbV64c08c9a33a321675')
  .then (response => {
    return response.json() 
  })
  .then (data => {
    console.log(data) // Log the parsed data to the console
  })
  .catch (error => {
    console.error('Error fetching data:', error);
  })

  
