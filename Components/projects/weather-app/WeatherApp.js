"use client"

import { useState, useEffect } from 'react';

const weatherURL = 'https://api.openweathermap.org/data/2.5/weather';
const forecastURL = 'https://api.openweathermap.org/data/2.5/forecast';

const days = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday'
];

const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
];

const SearchComponent = () => {
	const [mounted, setMounted] = useState(false);
	const [address, setAddress] = useState('');
	const [coordinates, setCoordinates] = useState({
		lat: null,
		lng: null
	});
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);

	useEffect(() => {
		setMounted(true);
		setAddress('Toronto, ON, Canada');
	}, []);
	
	if (!mounted) {
		return <div className='weatherContainer'><h1>Loading Weather App...</h1></div>;
	}

	const handleClick = () => {
		let weatherOutput = document.getElementsByClassName('weatherOutput')[0];
		let forecastOutput = document.getElementById('forecastOutput');
		weatherOutput.innerHTML = '';
		forecastOutput.innerHTML = '';
		setAddress('');
		setCoordinates({ lat: null, lng: null });
		setShowSuggestions(false);
	};

	const handleInputChange = async (e) => {
		const value = e.target.value;
		setAddress(value);

		if (value.length > 2 && window.google?.maps?.places?.AutocompleteSuggestion) {
			try {
				const { suggestions: results } =
					await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
						input: value,
						includedPrimaryTypes: ['locality']
					});
				setSuggestions(results || []);
				setShowSuggestions(Boolean(results?.length));
			} catch (error) {
				console.error('Autocomplete request failed:', error);
				setSuggestions([]);
				setShowSuggestions(false);
			}
		} else {
			setSuggestions([]);
			setShowSuggestions(false);
		}
	};

	const handleSelect = async (suggestion) => {
		setAddress(suggestion.placePrediction.text.text);
		setShowSuggestions(false);

		try {
			const place = suggestion.placePrediction.toPlace();
			await place.fetchFields({ fields: ['location'] });
			if (place.location) {
				setCoordinates({
					lat: place.location.lat(),
					lng: place.location.lng()
				});
			}
		} catch (error) {
			console.error('Failed to fetch place details:', error);
		}
	};

	const getData = () => {
		setAddress(''); // clear the input field

		// get the chosen city's current weather
		fetch(
			coordinates.lat === null && coordinates.lng === null
				? `${weatherURL}?q=${address}&APPID=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
				: `${weatherURL}?lat=${coordinates.lat}&lon=${coordinates.lng}&APPID=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
		).then(response => {
			if (response.status !== 200) {
				console.log(
					`Looks like there was a problem... STATUS CODE: ${response.status}`
				);
				const weatherOutput = document.getElementById('weatherOutput');
				weatherOutput.innerHTML = `
          <p class="errorMsg">Looks like there was a problem... Please try again.</p>
        `;
				const forecastOutput = document.getElementById('forecastOutput');
				forecastOutput.innerHTML = '';
				return;
			}
			response
				.json()
				.then(data => {
					appendWeather(data);
				})
				.catch(err => {
					console.log(err);
				});
		});

		const appendWeather = data => {
			let icon = data.weather[0].icon;
			let date = new Date();
			const weatherOutput = document.getElementsByClassName('weatherOutput')[0];
			weatherOutput.innerHTML += `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p class="dateTime">
      ${days[date.getDay()]} 
      ${date.getDate()} 
      ${months[date.getMonth()]}. 
      ${(date.getHours() + 24) % 12 || 12}:${
				date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
			} 
      ${date.getHours() > 12 ? 'PM' : 'AM'}, 
      <span class="weatherConditions">${data.weather[0].description}</span>
    </p>
    <div class="currentWeatherWrapper">
      <div class="row1">
        <span class="currentTemp">${parseFloat(data.main.temp - 273.15).toFixed(
					1
				)}&#8451;</span>  
        <span className="weatherIcon"><img src="https://openweathermap.org/img/wn/${icon}@2x.png" /></span>
      </div>
      
      <div class="row2">
        <span class="windSpeed">Wind: ${Math.round(
					data.wind.speed * 3.6
				)} Km/h</span>
        <span class="humidity">Humidity: ${data.main.humidity}%</span>
      </div>
    </div> 
    `;
		};

		// get the chosen city's 5 day forecast
		fetch(
			coordinates.lat === null && coordinates.lng === null
				? `${forecastURL}?q=${address}&APPID=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
				: `${forecastURL}?lat=${coordinates.lat}&lon=${coordinates.lng}&APPID=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
		).then(response => {
			if (response.status !== 200) {
				console.log(
					`Looks like there was a problem... STATUS CODE: ${response.status}`
				);
				return;
			}
			response
				.json()
				.then(forecast => {
					appendForecast(forecast);
				})
				.catch(err => {
					console.log(err);
				});
		});
		const appendForecast = forecast => {
			const forecastOutput = document.getElementById('forecastOutput');
			forecastOutput.innerHTML += `
    <h4>5 day forecast</h4>
    <div class="forecast">`;
			for (let i = 1; i < forecast.list.length; i++) {
				let day = new Date(forecast.list[i].dt * 1000).getDay();
				let date = new Date(forecast.list[i].dt * 1000).getDate();
				if (forecast.list[i].dt_txt.includes('12:00:00')) {
					forecastOutput.innerHTML += `
      <div class="dayData">
        <div class='day'>
            ${shortDays[day]} 
            ${date < 10 ? '0' + date : date}
          </div>
          <div class="icon">
            <img src="https://openweathermap.org/img/wn/${
							forecast.list[i].weather[0].icon
						}@2x.png" />
          </div>
          <div class="temps">${parseFloat(
						forecast.list[i].main.temp - 273.15
					).toFixed(1)}&#8451;
          </div>
        </div>
      </div>
      `;
				}
			}
			forecastOutput.innerHTML += `
    <footer class="weatherFooter">
      <div class="widgetLeftMenu__links"><span>Powered by </span><a href="https://openweathermap.org/" target="_blank" class="widgetLeftMenu__link">OpenWeatherMap</a></div>
    </footer>`;
		};
	};

	return (
		<div className='weatherContainer'>
			<h1>
				Weather App <span className='tagline'>with 5 day forecast</span>
		</h1>
			<div className='searchSection'>
				<div className='searchInputs'>
					<input
						value={address}
						onChange={handleInputChange}
						onClick={handleClick}
						placeholder='Enter a City ...'
						className='weatherSearchInput'
						aria-label='weather-search-input'
					/>
					<input
						className='weatherGoBtn'
						type='submit'
						value='Go!'
						onClick={getData}
					/>
				</div>
				{showSuggestions && (
					<div className='autocompleteDropdownContainer'>
						{suggestions.map((suggestion) => (
							<div
								key={suggestion.placePrediction.placeId}
								className='suggestion-item'
								style={{
									backgroundColor: '#ffffff',
									cursor: 'pointer',
									padding: '10px 0px'
								}}
								onMouseEnter={(e) => {
									e.target.style.backgroundColor = 'rgba(51, 89, 153,0.75)';
									e.target.style.color = '#ffffff';
								}}
								onMouseLeave={(e) => {
									e.target.style.backgroundColor = '#ffffff';
									e.target.style.color = 'initial';
								}}
								onClick={() => handleSelect(suggestion)}
							>
								<span>{suggestion.placePrediction.text.text}</span>
							</div>
						))}
					</div>
				)}
			</div>
			<div className='weatherOutput'></div>
			<div id='forecastOutput'></div>
		</div>
	);
};

export default SearchComponent;
