import "./App.css";
import { Link, useParams } from "react-router-dom";

import { getDateInfo, currentDate } from "./DateInfo";

export default function CharacterDirectoryUserPage() {
	let { username } = useParams();

	return (
		<div className="App">
			<header className="App-header">
				<p>
					<b style={{ cursor: "default" }}>{username}</b>
				</p>
				<ul>
					{getAllMonthsPerYear(username).map((monthsObj, index) => (
						<li style={{ listStyle: "outside", textAlign: "left" }} key={index}>
							<Link to={`${monthsObj.year}/${monthsObj.month}`}>
								{" "}
								{new Date(
									monthsObj.year,
									monthsObj.month,
									0, // days
									0, // hours
									0, // minutes
									0 // seconds
								).toLocaleString("default", { month: "long" })}{" "}
								{monthsObj.year}
							</Link>
						</li>
					))}
				</ul>
			</header>
		</div>
	);
}

// Returns an object array of {year, month}
function getAllMonthsPerYear(username) {
	// Inception date of the character
	let inceptionDate = getDateInfo(username);
	// Get all years from the current date to when the project was started
	let allYearsSinceInception = Array.from(
		{ length: currentDate.year + 1 - inceptionDate.year },
		(_, n) => inceptionDate.year + n
	);

	let monthsForEachYear = [];

	// Get all the months in-between the character start date, up to the current date
	allYearsSinceInception.forEach((year) => {
		let startMonth = year === inceptionDate.year ? inceptionDate.month : 1;
		let endMonth = currentDate.month;

		for (let month = startMonth; month <= endMonth; month++) {
			monthsForEachYear.push({ year: year, month: month });
		}
	});

	return monthsForEachYear;
}
