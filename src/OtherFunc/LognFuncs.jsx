// For  date
let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let hour = date.getHours();
let minutes = date.getMinutes();

if (day.toString().length === 1) day = `0${day}`;
if (month.toString().length === 1) month = `0${month}`;
if (hour.toString().length === 1) hour = `0${hour}`;
if (minutes.toString().length === 1) minutes = `0${minutes}`;
export const FormatedDate = `${year}-${month}-${day}`;
export const FormatedTime = `${hour}:${minutes}`;