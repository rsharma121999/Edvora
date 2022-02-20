import { Grid } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import '../styles/CardStyles.css';

function RideCards({
  id,
  origin_station,
  station_path,
  Date,
  Distance,
  City,
  State,
}) {
  return (
    <Grid item xs={12}>
      <div className="wrapper">
        <img className="map-img" src="map-img.jpeg" alt="map" />
        <div className="details">
          <p>Ride Id: {id}</p>
          <p>Origin Station: {origin_station}</p>
          <p>station_path: {JSON.stringify(station_path, null, 2)} </p>
          <p>Date: {moment(Date).format('LLL')} </p>
          <p>Distance: {Distance}</p>
        </div>
        <div className="city-details">
          <button className="city-text">{City}</button>
          <button className="city-text">{State}</button>
        </div>
      </div>
    </Grid>
  );
}

export default RideCards;
