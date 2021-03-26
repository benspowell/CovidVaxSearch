# Covid Vaccine Search

Check CVS pharmacy for available covid vaccine appointments in Ohio.

Clone this repo:

```
$ git clone https://github.com/benspowell/CovidVaxSearch.git
$ cd CovidVaxSearch
```

Install dependencies:

```
$ npm install
```

Run:

```
$ node index.js
```

This will list out any available appointments in Ohio, or display errors returned from the CVS API.

Several extra headers are needed on requests to the API to make it seem like the request is coming from a browser. Sometimes requests are refused for misuse of the API, eventually leading to blocking your IP completely.

## Requirements
The latest version of node and npm can be downloaded [here](https://nodejs.org/en/).

## CVS API endpoints used

```http
GET /immunizations/covid-19-vaccine.vaccine-status.oh.json?vaccineinfo
```
Returns a list of cities with CVS locations, and whether that area has vaccine eligibility. Seems to only update a few times per hour.

```http
POST /Services/ICEAGPV1/immunization/1.0.0/getIMZStores
```
Returns a list of locations with appointments, and the available dates, vaccine manufacturer, and more. Payload goes in the request body.
