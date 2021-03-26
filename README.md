# CovidVaxSearch

Check CVS pharmacy for available covid vax appointments in Ohio

```
$ node index.js
```

This will list out any available appointments in ohio, or display errors returned from the CVS API. Sometimes requests are refused for misuse of the API.

## CVS API

This is making use of two endpoints from CVS's API. Both require several headers to make it seem like the request is coming from a browser.
`GET /immunizations/covid-19-vaccine.vaccine-status.oh.json?vaccineinfo`
Returns a list of cities with CVS locations, and whether that area has vaccine eligibility. Seems to only update a few times per hour.

`POST /Services/ICEAGPV1/immunization/1.0.0/getIMZStores`
Returns a list of locations with appointments, and the available dates, vaccine manufacturer, and more. Payload goes in the request body.
