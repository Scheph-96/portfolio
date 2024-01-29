# ip-info-finder

<div style="display: flex;">

[![npm](https://img.shields.io/npm/v/ip-info-finder.svg?style=flat-square)](https://www.npmjs.com/package/ip-info-finder)
![building workflow](https://github.com/pariazar/ip-info-finder/actions/workflows/nodejs.yml/badge.svg)
[![Github All Releases](https://img.shields.io/npm/dt/ip-info-finder.svg)]()
<a href="https://codeclimate.com/github/pariazar/ip-info-finder/maintainability"><img src="https://api.codeclimate.com/v1/badges/a5c9b90b523374d106cd/maintainability" /></a>
[![GitHub issues](https://img.shields.io/github/issues/pariazar/ip-info-finder)](https://github.com/pariazar/ip-info-finder/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-0298c3.svg)](https://opensource.org/licenses/MIT)

</div>




![alt text](./img/logo.png?raw=true)



This package provides additional information on an IP address, such as its whois information, country, city, mobile status, user proxy or VPN status, and more. It supports both IPv4 and IPv6.</br>The package allows you to retrieve the following data:
<ul>
<li>Location (street, county, etc.)</li>
<li>Weather</li>
<li>Currency rates</li>
<li>Whois information</li>
<li>COVID-19 statistics</li>
</ul>

## Installation
Install via NPM:

```bash
npm install ip-info-finder
```

## Usage

#### javascript

```javascript
var ipInfo = require("ip-info-finder");

ipInfo.getIPInfo('IP-ADDRESS').then(data => {
    console.log(data);
})
.catch(err => console.log(err));
```

#### TypeScript

```typescript
import * as ipInfo from 'ip-info-finder';

ipInfo.getIPInfo('IP-ADDRESS').then(data => {
    console.log(data);
})
.catch(err => console.log(err));
```

#### Result 
```json
{
  "Country": "United States (US)",
  "Continent": "North America (NA)",
  "Coordinates": "37.751 (lat) / -97.822 (long)",
  "Time": "2023-03-08 11:45:18 (America/Chicago)",
  "ipAddress": "28.106.238.158",
  "hostname": "28.106.238.158",
  "provider": "DNIC-AS-00749",
  "ASN": "749",
  "lat": "37.751",
  "lon": "-97.822",
  "CountryInfo": {
    "name": "United States",
    "dial_code": "+1",
    "emoji": "🇺🇸",
    "code": "US",
    "population": 326687501
  }
}
```

If you are experiencing a CORS issue or require additional data, you will need to set the CORS value to 'false' as shown in the following code:

```javascript
ipInfo.getIPInfo('28.106.238.158', options = { cors: false }).then(data => {
    console.log(data);
}).catch(err => console.log(err));
```

## Optional setting

### Location

<p>discover detail of the area from ip like county , city , street , suburb , postcode and so on.</p>

```javascript
ipInfo.getIPInfo.location('IP-ADDRESS').then(data => {
    console.log(data);
})
.catch(err => console.log(err));
```

#### Result

```json
{
  "Country": "United States (US)",
  "Continent": "North America (NA)",
  "Coordinates": "37.751 (lat) / -97.822 (long)",
  "Time": "2022-12-15 05:59:09 (America/Chicago)",
  "ipAddress": "28.106.238.158",
  "hostname": "28.106.238.158",
  "provider": "DNIC-AS-00749",
  "ASN": "749",
  "lat": "37.751",
  "lon": "-97.822",
  "location": [
    {
      "place_id": 297371111,
      "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
      "osm_type": "relation",
      "osm_id": 1070327,
      "boundingbox": [ "37.733658", "38.1738097", "-98.473104", "-97.698692" ],
      "lat": "37.930344",
      "lon": "-98.1055753",
      "display_name": "Reno County, Kansas, United States",
      "class": "boundary",
      "type": "administrative",
      "importance": 0.001,
      "icon": "https://nominatim.openstreetmap.org/ui/mapicons/poi_boundary_administrative.p.20.png",
      "address": {
        "county": "Reno County",
        "state": "Kansas",
        "ISO3166-2-lvl4": "US-KS",
        "country": "United States",
        "country_code": "us"
      }
    }
  ]
}
```


### WHOIS

<p>find whois easily by ip or website address.</p>

```javascript
ipInfo.getIPInfo.whois('IP OR WEBSITE').then(data => {
    console.log(data);
})
.catch(err => console.log(err));

```


#### Result

```json
{
  "DomainName": "github.com",
  "RegistryDomainID": "1264983250_DOMAIN_COM-VRSN",
  "RegistrarWHOISServer": "whois.markmonitor.com",
  "RegistrarURL": "http",
  "UpdatedDate": "2022-09-07T09",
  "CreationDate": "2007-10-09T18",
  "RegistrarRegistrationExpirationDate": "2024-10-09T00",
  "RegistrarIANAID": "292",
  "RegistrarAbuseContactPhone": "+1.2086851750",
  "DomainStatus": "clientDeleteProhibited (https",
  "RegistrantOrganization": "GitHub, Inc.",
  "RegistrantStateProvince": "CA",
  "RegistrantCountry": "US",
  "RegistrantEmail": "Select Request Email Form at https",
  "AdminOrganization": "GitHub, Inc.",
  "AdminStateProvince": "CA",
  "AdminCountry": "US",
  "AdminEmail": "Select Request Email Form at https",
  "TechOrganization": "GitHub, Inc.",
  "TechStateProvince": "CA",
  "TechCountry": "US",
  "TechEmail": "Select Request Email Form at https",
  "NameServer": "dns2.p08.nsone.net",
  "URLoftheICANNWHOISDataProblemReportingSystem": "http",
  "LastupdateofWHOISdatabase": "2022-12-15T12",
  "VisitMarkMonitorathttps": "//www.markmonitor.com",
  "InformationUpdated": "2022-12-15 12"
}
```

### IP checker

```typescript
var ipInfo = require("ip-info-finder")


await ipInfo.getIPInfo.isIP('1:2:3:4:5:6:7:8');
//=> true
await ipInfo.getIPInfo.isIP('192.168.0.1');
//=> true
await ipInfo.getIPInfo.isIPv4('1:2:3:4:5:6:7:8');
//=> false
await ipInfo.getIPInfo.isIPv6('1:2:3:4:5:6:7:8');
//=> true
await ipInfo.getIPInfo.ipVersion('1:2:3:4:5:6:7:8');
//=> 6
```

### Weather

<p>what's more you can discover climate from IP address</p>

```javascript
ipInfo.getIPInfo.weather('IP-ADDRESS').then(data => {
    console.log(data);
})
.catch(err => console.log(err));
```

#### Result

```json
{
  "Country": "France (FR)",
  "Continent": "Europe (EU)",
  "Coordinates": "48.8582 (lat) / 2.3387 (long)",
  "Time": "2023-01-20 19:18:24 (Europe/Paris)",
  "ipAddress": "51.15.80.14",
  "hostname": "14-80-15-51.instances.scw.cloud",
  "provider": "Online S.a.s.",
  "ASN": "12876",
  "lat": "48.8582",
  "lon": "2.3387",
  "weather": {
    "location": "Paris",
    "locationDetail": "Île-de-France, France",
    "currentWeather": {
      "temperature": "4°C",
      "dewPoint": "1°C",
      "barometer": "102 kPa",
      "wind": "W 11 km/h",
      "humidity": "80.8 %",
      "visibility": "n/a",
      "time": "Updated Jan 20, 2023 6:30 PM"
    },
    "forecastSummary": [
      {
        "day": "Today",
        "date": "Jan 20th",
        "result": "Cloudy",
        "min": "5°C"
      },
      {
        "day": "Saturday",
        "date": "Jan 21st",
        "result": "Sunny",
        "min": "4°C",
        "max": "0°C"
      },
      {
        "day": "Sunday",
        "date": "Jan 22nd",
        "result": "Mostly Sunny",
        "min": "4°C",
        "max": "-1°C"
      },
      {
        "day": "Monday",
        "date": "Jan 23rd",
        "result": "Mix of Cloud and Sun",
        "min": "3°C",
        "max": "-0°C"
      },
      {
        "day": "Tuesday",
        "date": "Jan 24th",
        "result": "Sunny",
        "min": "4°C",
        "max": "-1°C"
      }
    ],
    "forecastDetails": [
      {
        "date": "Friday, January 20th, 2023",
        "results": [
          {
            "time": "Friday Evening",
            "forecast": "Cloudy.",
            "temperature": "3°C"
          }
        ]
      },
      {
        "date": "Saturday, January 21st, 2023",
        "results": [
          {
            "time": "Overnight",
            "forecast": "Cloudy with clear periods. Windy at times.",
          },
          {
            "time": "Saturday Morning",
            "forecast": "Sunny with cloudy periods. Windy at times.",
            "temperature": "0°C"
          },
          {
            "time": "Saturday Afternoon",
            "forecast": "Sunny. Windy at times.",
            "temperature": "4°C"
          },
          {
            "time": "Saturday Evening",
            "forecast": "Clear. Windy at times.",
            "temperature": "0°C"
          }
        ]
      }
    ]
  }
}
```

### Currency

<p>access latest currency rate from IP this method give you lists of all the available currencies in prettified json format:
</p>

```javascript
ipInfo.getIPInfo.currency('IP-ADDRESS').then(data => {
    console.log(data);
})
.catch(err => console.log(err));
```


#### Result

```json
{
  "as": "AS14061 DigitalOcean, LLC",
  "asname": "DIGITALOCEAN-ASN",
  "city": "North Bergen",
  "continent": "North America",
  "continentCode": "NA",
  "country": "United States",
  "countryCode": "US",
  "currency": "USD",
  "district": "",
  "hosting": true,
  "isp": "DigitalOcean, LLC",
  "lat": 40.793,
  "lon": -74.0247,
  "mobile": false,
  "offset": -14400,
  "org": "Digital Ocean",
  "proxy": false,
  "query": "2604:a880:400:d0::1ec5:f001",
  "region": "NJ",
  "regionName": "New Jersey",
  "status": "success",
  "timezone": "America/New_York",
  "zip": "07047",
  "currencyDetail": {
    "date": "2021-08-30",
    "usd": {
      "aed": 3.67301,
      "afn": 86.12501,
      "all": 103.6936,
      "amd": 493.71,
      "ang": 1.794866,
    }
  }
}
```
### Covid statistics

<p>access most recent Coronavirus statistics from IP.
</p>

```javascript
ipInfo.getIPInfo.covid('IP-ADDRESS').then(data => {
  console.log(data);
})
.catch(err => console.log(err));
```
#### Result

```json
"covid": {
    "country": "USA",
    "cases": 40131681,
    "todayCases": 17582,
    "deaths": 658103,
    "todayDeaths": 193,
    "recovered": 31023726,
    "active": 8449852,
    "critical": 25691,
    "casesPerOneMillion": 120421,
    "deathsPerOneMillion": 1975,
    "totalTests": 584387097,
    "testsPerOneMillion": 1753534
  }
```
### Languages
<p>get result with your language</p>

##### Example 

```javascript
//Arabic 
ipInfo.getIPInfo('IP-ADDRESS',options: {lang: 'ar'}).then(data => {
    console.log(data);
})
.catch(err => console.log(err));

//French 
ipInfo.getIPInfo('IP-ADDRESS',options: {lang: 'fr'}).then(data => {
    console.log(data);
})
.catch(err => console.log(err));
```
#### Result 

```json
{
  "City": "Europe (UE)",
  "Region": "Angleterre (ENG)",
  "Country": "Royaume-Uni (GB)",
  "Continent": "Londres",
  "Coordinates": "51.5164 (lat) / -0.093 (long)",
  "Time": "2022-08-05 21:35:14 (Europe/London)",
  "ipAddress": "212.102.63.76",
  "hostname": "unn-212-102-63-76.cdn77.com",
  "provider": "Datacamp Limited",
  "ASN": "60068",
  "lat": "51.5164",
  "lon": "-0.093",
  "postalCode": "EC2V"
}
```



## Support
  - [Bug Reports](https://github.com/pariazar/ip-info-finder/issues/)

## Contributors
<p>
Pull requests are always welcome! Please base pull requests against the main branch and follow the contributing guide.

if your pull requests makes documentation changes, please update readme file.
</p>

## License

This project is licensed under the terms of the
MIT license

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhamedpa%2Fip-info-finder.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhamedpa%2Fip-info-finder?ref=badge_large)