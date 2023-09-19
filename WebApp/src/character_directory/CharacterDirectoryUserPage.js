import "./App.css";
import { Link, useParams } from "react-router-dom";

import _jsonData from "./character_list.json";
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
					{getAllMonthsPerYear().map((monthsObj) => (
						<li>
							<Link to={`${monthsObj.year}/${monthsObj.month}`}>
								{" "}
								{new Date(
									`${currentDate.year}-${currentDate.month}-${currentDate.day}`
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

function getAllMonthsPerYear() {
	let allYearsSinceInception = Array.from(
		{ length: currentDate.year + 1 - inceptionDate.year },
		(_, n) => inceptionDate.year + n
	);

	let monthsForEachYear = allYearsSinceInception.map((year) => {
		let startMonth = year == inceptionDate.year ? inceptionDate.month : 1;
		let endMonth = year == inceptionDate.year ? 12 : currentDate.month;

		for (let month = startMonth; month < endMonth; month++) {
			return { year: year, month: month };
		}
	});

	return monthsForEachYear;
}
