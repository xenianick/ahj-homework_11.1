function zerofy(digit) {
  let stringfromDigit = digit.toString();
  if (stringfromDigit.length === 1) {
    stringfromDigit = `0${stringfromDigit}`;
  }
  return stringfromDigit;
}

export default function readDate(date) {
  const newDate = new Date(date);

  const year = newDate.getFullYear();

  let month = newDate.getMonth() + 1;
  month = zerofy(month);

  let day = newDate.getDate();
  day = zerofy(day);

  let hour = newDate.getHours();
  hour = zerofy(hour);

  let minutes = newDate.getMinutes();
  minutes = zerofy(minutes);

  const readedDate = `${hour}:${minutes} ${day}.${month}.${year}`;

  return readedDate;
}
