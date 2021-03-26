const fs = require("fs/promises");
const cvsApi = require("./cvs-api");
const prettyoutput = require("prettyoutput");

cvsApi.getCitiesWithVaccineAvailability().then(async (res) => {
  let allCitiesOfCvsLocations = JSON.parse(await fs.readFile("zip_codes.json"));
  let namesOfCitiesWithApptAvailable = res.body.responsePayloadData.data.OH
    .filter((i) => i.status == "Available")
    .map((j) => j.city);

  let citiesOfLocationsWithAvailability = allCitiesOfCvsLocations.filter((el) =>
    namesOfCitiesWithApptAvailable.includes(el.city.toUpperCase())
  );

  console.log(
    "Cities with CVS locations who have appointment availability:\n",
    prettyoutput(citiesOfLocationsWithAvailability)
  );

  // Note that more requests to API = more likely to be refused,
  // Set this to `citiesOfLocationsWithAvailability` or `allCitiesOfCvsLocations`:
  let citiesToCheck = citiesOfLocationsWithAvailability;

  cvsApi
    .getAppointmentsFromZips(citiesToCheck.map((el) => el.zip))
    .then((res) => {
      console.log(res.length + " appointments found:\n", prettyoutput(res));
    });
});
