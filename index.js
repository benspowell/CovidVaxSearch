const fs = require("fs/promises");
const cvsApi = require("./cvs-api");
const prettyoutput = require("prettyoutput");

cvsApi.getCitiesWithVaccineAvailability().then(async (res) => {
  let zipCodes = JSON.parse(await fs.readFile("zip_codes.json"));
  let cityNames = res.body.responsePayloadData.data.OH.filter(
    (el) => el.status == "Available"
  ).map((availableCity) => availableCity.city);
  let citiesWithAvailability = zipCodes.filter((el) =>
    cityNames.includes(el.city.toUpperCase())
  );
  if (citiesWithAvailability.length > 0) {
    console.log("Cities with appointment availability:");
    console.log(prettyoutput(citiesWithAvailability));

    cvsApi
      .getAppointmentsFromZips(citiesWithAvailability.map((ob) => ob.zip))
      .then((res) => {
        console.log(res.length + " appointments found:");
        console.log(prettyoutput(res));
      });
  }
});
