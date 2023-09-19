import _jsonData from "./character_list.json";

export class DateInfo {
	constructor(dateTimeString) {
		var dateTimeStringSpliced = dateTimeString.split("/");

		this.day = Number(dateTimeStringSpliced[0]);
		this.month = Number(dateTimeStringSpliced[1]);
		this.year = Number(dateTimeStringSpliced[2]);
	}
}

const inceptionDateNzString = new Date(
	_jsonData.inception_date
).toLocaleDateString("en-NZ", {
	timeZone: "Pacific/Auckland",
});
const currentDateNzString = new Date().toLocaleDateString("en-NZ", {
	timeZone: "Pacific/Auckland",
});

export const inceptionDate = new DateInfo(inceptionDateNzString);
export const currentDate = new DateInfo(currentDateNzString);
