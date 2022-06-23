# Queries

## Tulikartta

```
{
  Tulikartta_fireplaces( FireplaceCounty:"Satakunta" ) {
    features
  }
}
```

## Porin luontokohteet

```
{
  PoriLuontokohteet_luontokohteet {
    features
  }
}
```

## Lipas

### Luokittelut

```
{
  Lipas_getCategories(lang:FI) {
    name
  }
}
```

### Haetaan paikat 50 km säteeltä. Palauttaa vain id:n.

```
{
  Lipas_getSportsPlaces(closeToLat:61.5, closeToLon:21.5, closeToDistanceKm: 50) {
    sportsPlaceId
  }
}
```

### Haetaan paikan tiedot id:llä

```
{
  Lipas_getSportsPlacesSportsPlaceId( sportsPlaceId: 519507 ) {
    name
    location {
      address
      geometries
    }
    properties
    type {
      name
      typeCode
    }
  }
}
```
