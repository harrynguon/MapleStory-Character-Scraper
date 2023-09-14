import "./App.css";
import { useState, useEffect } from "react";
import { DateInfo } from "./DateInfo";

const users = [];

const inceptionDateString = "2023-09-13";
const inceptionDateNzString = new Date(inceptionDateString).toLocaleDateString(
	"en-NZ",
	{
		timeZone: "Pacific/Auckland",
	}
);
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

	const [imgsLoaded, setImgsLoaded] = useState(false);

	return (
		<div className="App">
			<header className="App-header">
				{currentStep == 1 && (
					<ul style={{ listStyleType: "none" }}>
						{users.map((user) => (
							<li
								onClick={() => {
									setStep(2);
									setUsername(user);
								}}
							>
								{user}
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
								}}
							>
								{month}
							</li>
						))}
					</ul>
				)}

				{currentStep == 4 &&
					getAllImagesForMonth(selectedUsername, selectedYear, selectedMonth)}

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
	var image = new Image();

	image.src = url;

	if (image?.width == 0) {
		return false;
	} else {
		return <img src={url} />;
	}
};

// let loadImage = function (url) {
// 	return new Promise((resolve, reject) => {
// 		var image = new Image();

// 		image.src = url;

// 		image.onload = () => resolve(<img src={url} />);
// 		image.onerror = (err) => reject(err);
// 	});
// };
