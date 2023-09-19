import _jsonData from "./character_list.json";

export class DateInfo {
	constructor(dateTimeString) {
		var dateTimeStringSpliced = dateTimeString.split("/");

		this.day = Number(dateTimeStringSpliced[0]);
		this.month = Number(dateTimeStringSpliced[1]);
		this.year = Number(dateTimeStringSpliced[2]);
	}
}

const currentDateNzString = new Date().toLocaleDateString("en-NZ", {
	timeZone: "Pacific/Auckland",
});

export const currentDate = new DateInfo(currentDateNzString);

export function getDateInfo(username) {
	let characterObject = _jsonData.character_list.find(
		(character) => character.username === username
	);

	return new DateInfo(
		new Date(characterObject.startDate).toLocaleDateString("en-NZ", {
			timeZone: "Pacific/Auckland",
		})
	);
}
