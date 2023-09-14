export class DateInfo {
	constructor(dateTimeString) {
		var dateTimeStringSpliced = dateTimeString.split("/");

		this.day = Number(dateTimeStringSpliced[0]);
		this.month = Number(dateTimeStringSpliced[1]);
		this.year = Number(dateTimeStringSpliced[2]);
	}
}
