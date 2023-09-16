import "./App.css";
import { useState, useEffect } from "react";
import { DateInfo } from "../DateInfo";
import _jsonData from "./character_list.json";

const inceptionDateNzString = new Date(
	_jsonData.inception_date
).toLocaleDateString("en-NZ", {
	timeZone: "Pacific/Auckland",
});
const currentDateNzString = new Date().toLocaleDateString("en-NZ", {
	timeZone: "Pacific/Auckland",
});

const inceptionDate = new DateInfo(inceptionDateNzString);
const currentDate = new DateInfo(currentDateNzString);

export default function App() {
	const [currentStep, setStep] = useState(1);

	const [selectedUsername, setUsername] = useState("");
	const [selectedYear, setYear] = useState(0);
	const [selectedMonth, setMonth] = useState(0);

	const [imagesLoaded, setImagesLoaded] = useState(false);
	const [loadedImageUrls, setLoadedImageUrls] = useState([]);

	return (
		<div className="App">
			<header className="App-header">
				{currentStep == 1 && (
					<ul style={{ listStyleType: "none" }}>
						{_jsonData.character_list.map((user) => (
							<li
								onClick={() => {
									setStep(2);
									setUsername(user.username);
								}}
							>
								{user.username}
							</li>
						))}
					</ul>
				)}

				{currentStep == 2 && (
					<ul style={{ listStyleType: "none" }}>
						{getYearsSinceInception().map((year) => (
							<li
								onClick={() => {
									setStep(3);
									setYear(year);
								}}
							>
								{year}
							</li>
						))}
					</ul>
				)}

				{currentStep == 3 && (
					<ul style={{ listStyleType: "none" }}>
						{getAvailableMonthsForYear(selectedYear).map((month) => (
							<li
								onClick={() => {
									setStep(4);
									setMonth(month);
									Promise.all(
										getAllImagesForMonth(selectedUsername, selectedYear, month)
									)
										.then((imageUrls) => {
											console.log("image urls from promise: " + imageUrls);
											setImagesLoaded(true);
											setLoadedImageUrls(
												imageUrls.filter((imgUrl) => imgUrl != null)
											);
										})
										.catch((err) => console.log("failed to load images", err));
								}}
							>
								{month}
							</li>
						))}
					</ul>
				)}

				{currentStep == 4 &&
					imagesLoaded &&
					loadedImageUrls.map((imgUrl) => <img src={imgUrl} />)}

				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
			</header>
		</div>
	);
}

// Get number of years since this project was started
function getYearsSinceInception() {
	return Array.from(
		{ length: currentDate.year + 1 - inceptionDate.year },
		(_, n) => inceptionDate.year + n
	);
}

function getAvailableMonthsForYear(selectedYear) {
	// // Get all the months since the beginning of the year OR inception of this project FOR 2023
	let startMonth = selectedYear == inceptionDate.year ? inceptionDate.month : 1;

	let monthsSinceBeginningOfYear = Array.from(
		{ length: currentDate.month + 1 - startMonth },
		(_, n) => startMonth + n
	);

	// Return all the months (in number format) that should have images
	return monthsSinceBeginningOfYear;
}

function getAllImagesForMonth(username, year, month) {
	let startDayRange = 1;
	// Get number of days in the month via Javascript date functionality
	let endDayRange = new Date(year, month, 0).getDate();

	// Start on the 13th day for September 2023 as that is when images started being populated
	if (year == inceptionDate.year && month == inceptionDate.month) {
		startDayRange = inceptionDate.day;
	}

	// If searching in the current month, limit it to only up to the current day
	if (year == currentDate.year && month == currentDate.month) {
		endDayRange = currentDate.day;
	}

	var result = Array.from(
		{ length: endDayRange - startDayRange + 1 },
		(_, n) => startDayRange + n
	).map((day) => {
		let paddedMonth = month.toString().padStart(2, "0");
		let paddedDay = day.toString().padStart(2, "0");
		return loadImage(
			`/images/u/${username}/${year}-${paddedMonth}-${paddedDay}.png`
		);
	});

	console.log(result);

	return result;
}

let loadImage = function (url) {
	return new Promise((resolve, reject) => {
		var image = new Image();

		image.onload = () => resolve(url);
		image.onerror = (err) => resolve(null);

		image.src = url;
	});
};
