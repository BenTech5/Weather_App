const apiKey = "71ece42829957b89965de020700e7c91";
        const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

        const searchBox = document.querySelector(".search input");
        const searchBtn = document.getElementById("search-button"); 
        const weatherIcon = document.querySelector(".weather-icon");
        const addFavoriteButton = document.getElementById('add-favorite');
        const favoriteListContainer = document.getElementById('favorite-locations');

        async function fetchWeather(city) {
            const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);

            if (response.status == 404) {
                alert("City not found!");
                return;
            }

            const data = await response.json();

            console.log(data);

            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed  + " km/h";


            const weatherCondition = data.weather[0].main.toLowerCase();
            if (weatherCondition.includes("cloud")) {
                weatherIcon.src = "../images/cloud.png";
            } else if (weatherCondition.includes("rain")) {
                weatherIcon.src = "../images/rainy.png";
            } else if (weatherCondition.includes("clear")) {
                weatherIcon.src = "../images/sunny.png";
            } else if (weatherCondition.includes("snow")) {
                weatherIcon.src = "../images/snow.png";
            } else if (weatherCondition.includes("mist")) {
                weatherIcon.src = "../images/mist.png";
            } else {
                weatherIcon.src = "../images/cloud.png";
            }
        }


        searchBtn.addEventListener("click", () => {
            fetchWeather(searchBox.value);
        });

        searchBox.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                fetchWeather(searchBox.value);
            }
        });

        // Load favorites from localStorage on page load
        displayFavorites();

        addFavoriteButton.addEventListener('click', () => {
            const locationToAdd = searchBox.value.trim();
            if (locationToAdd) {
                saveFavorite(locationToAdd);
                searchBox.value = ''; 
            } else {
                alert('Please enter a city to add to favorites.');
            }
        });

        function saveFavorite(location) {
            let favorites = getFavorites();
            const lowerCaseLocation = location.toLowerCase();
            if (!favorites.includes(lowerCaseLocation)) {
                favorites.push(lowerCaseLocation);
                localStorage.setItem('favoriteLocations', JSON.stringify(favorites));
                displayFavorites(); // Update the displayed list
            } else {
                alert(`${location} is already in your favorites!`);
            }
        }

        function removeFavorite(locationToRemove) {
            let favorites = getFavorites();
            favorites = favorites.filter(loc => loc !== locationToRemove);
            localStorage.setItem('favoriteLocations', JSON.stringify(favorites));
            displayFavorites(); // Update the displayed list
            console.log(`${locationToRemove} removed from favorites.`);
        }

        function getFavorites() {
            const favoritesString = localStorage.getItem('favoriteLocations');
            return favoritesString ? JSON.parse(favoritesString) : [];
        }

        function displayFavorites() {
            favoriteListContainer.innerHTML = '';

            const favorites = getFavorites();
            if (favorites.length === 0) {
                const emptyMessage = document.createElement('li');
                emptyMessage.textContent = 'No favorite cities added yet.';
                emptyMessage.classList.add('empty-message');
                favoriteListContainer.appendChild(emptyMessage);
                return;
            }

            favorites.forEach(location => {
                const listItem = document.createElement('li');
                listItem.textContent = location;
                listItem.classList.add('favorite-item');

                const removeButton = document.createElement('button');
                removeButton.textContent = 'X';
                removeButton.classList.add('remove-favorite'); 
                removeButton.addEventListener('click', (event) => {
                    event.stopPropagation(); 
                    removeFavorite(location);
                });

                listItem.appendChild(removeButton);
                favoriteListContainer.appendChild(listItem);

                
                listItem.style.cursor = 'pointer';
                listItem.addEventListener('click', () => {
                    console.log(`Fetching weather for favorite: ${location}`);
                    fetchWeather(location); // Call fetchWeather for the clicked favorite
                });
            });
        }