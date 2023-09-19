import "./App.css";
import { Link, useParams } from "react-router-dom";

import { inceptionDate, currentDate } from "./DateInfo";

export default function CharacterDirectoryUserPage() {
	let { username } = useParams();

	return (
		<div className="App">
			<header className="App-header">
				<p>
					<b style={{ cursor: "default" }}>{username}</b>
				</p>
				<ul>
					{getAllMonthsPerYear().map((monthsObj, index) => (
						<li style={{ listStyle: "outside" }} key={index}>
							<Link to={`${monthsObj.year}/${monthsObj.month}`}>
								{" "}
								{new Date(
									currentDate.year,
									currentDate.month - 1,
									currentDate.day,
									0,
									0,
									0
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
function getAllMonthsPerYear() {
	// Get all years from the current date to when the project was started
	let allYearsSinceInception = Array.from(
		{ length: currentDate.year + 1 - inceptionDate.year },
		(_, n) => inceptionDate.year + n
	);

	// Get all the months in-between the project start date, up to the current date
	let monthsForEachYear = allYearsSinceInception.map((year) => {
		let startMonth = year === inceptionDate.year ? inceptionDate.month : 1;
		let endMonth = year === inceptionDate.year ? 12 : currentDate.month;

		for (let month = startMonth; month < endMonth; month++) {
			return { year: year, month: month };
		}
	});

	return monthsForEachYear;
}
