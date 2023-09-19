import "./App.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { inceptionDate, currentDate } from "./DateInfo";

export default function CharacterDirectoryImageDisplayPage() {
	const [imagesLoaded, setImagesLoaded] = useState(false);
	const [loadedImageUrls, setLoadedImageUrls] = useState([]);

	const { username, year, month } = useParams();

	// Load all images upon entry
	useEffect(() => {
		Promise.all(getAllImagesForMonth(username, year, month))
			.then((imageUrls) => {
				setImagesLoaded(true);
				setLoadedImageUrls(imageUrls.filter((imgUrl) => imgUrl != null));
			})
			.catch((err) => console.log("failed to load images", err));
	}, [username, year, month]);

	return (
		<div className="App">
			<header className="App-header">
				<table>
					<thead>
						<tr>
							<th>
								<p>Image</p>
							</th>
							<th>
								<p>Date</p>
							</th>
						</tr>
					</thead>
					{imagesLoaded ? (
						loadedImageUrls.map((imgUrlObject) => (
							<tbody>
								<tr>
									<td>
										<img
											src={imgUrlObject.url}
											alt={`Thumbnail for ${imgUrlObject.username}`}
										/>
									</td>
									<td>
										<p style={{ fontSize: "70%" }}>
											{imgUrlObject.year}-{imgUrlObject.month}-
											{imgUrlObject.day}
										</p>
									</td>
								</tr>
							</tbody>
						))
					) : (
						<tbody>
							<tr>
								<td>Loading...</td>
								<td>Loading...</td>
							</tr>
						</tbody>
					)}
				</table>
			</header>
		</div>
	);
}

function getAllImagesForMonth(username, year, month) {
	let yearAsNumber = Number(year);
	let monthAsNumber = Number(month);

	let startDayRange = 1;
	// Get number of days in the month via Javascript date functionality
	let endDayRange = new Date(yearAsNumber, monthAsNumber, 0).getDate();

	// Start on the 13th day for September 2023 as that is when images started being populated
	if (
		yearAsNumber === inceptionDate.year &&
		monthAsNumber === inceptionDate.month
	) {
		startDayRange = inceptionDate.day;
	}

	// If searching in the current month, limit it to only up to the current day, and nothing beyond
	if (
		yearAsNumber === currentDate.year &&
		monthAsNumber === currentDate.month
	) {
		endDayRange = currentDate.day;
	}

	// Get all days from the start day to end day
	var result = Array.from(
		{ length: endDayRange - startDayRange + 1 },
		(_, n) => startDayRange + n
	).map((day) => {
		// Grab image url as per s3 bucket definition. Pads numbers to include leading zeroes
		let paddedMonth = month.toString().padStart(2, "0");
		let paddedDay = day.toString().padStart(2, "0");
		// Run an image load check within a promise
		return checkLoadImage(username, year, paddedMonth, paddedDay);
	});

	return result;
}

let checkLoadImage = function (username, year, month, day) {
	let url = `/images/u/${username}/${year}-${month}-${day}.png`;
	return new Promise((resolve, reject) => {
		var image = new Image();

		image.onload = () => resolve({ url, username, year, month, day });
		image.onerror = (err) => resolve(null);

		image.src = url;
	});
};
