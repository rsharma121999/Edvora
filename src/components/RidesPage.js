import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import '../styles/RidesPageStyles.css';
import { Button, Menu } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import RideCards from './RideCards';
import Ride from '../RideData';
import User from '../UserData';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import moment from 'moment';
import { makeStyles } from '@material-ui/core';
import SortIcon from '@material-ui/icons/Sort';

const userStationCode = User.station_code;
const nearestRideCount = Ride.length;

//STYLES FOR SELECT INPUT
const useStyles = makeStyles({
  select: {
    background: '#232323',
    margin: '0 0 15px 0',
    '&:before': {
      borderColor: 'white',
    },
    '&:after': {
      borderColor: 'white',
    },
    '&:not(.Mui-disabled):hover::before': {
      borderColor: 'white',
    },
  },
  icon: {
    fill: 'white',
  },
  root: {
    color: 'white',
  },
});

// STATES AND CITY LIST
const statesAndCityList = {
  Delhi: {
    City: ['New Delhi', 'Rohini'],
  },
  UP: {
    City: ['Noida'],
  },
  Maharashtra: {
    City: ['Panvel'],
  },
  Rajasthan: {
    City: ['Kota', 'Jaipur'],
  },
  Gujarat: {
    City: ['Ahmedabad'],
  },
};

function RidesPage() {
  const [rideData, setRideData] = useState([]);
  const [upcomingRideCount, setUpcomingRideCount] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [pastRideCount, setPastRideCount] = useState('');
  const [activeTab, setActiveTab] = useState('Nearest');
  const [selectFilterMenu, setSelectFilterMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState();

  // FUNCTION TO OPEN THE FILTER MENU
  function openSelectFilterMenu(event) {
    setAnchorEl(event.currentTarget);
    setSelectFilterMenu(true);
  }

  // FUNCTION TO CLOSE THE FILTER MENU
  function closeSelectFilterMenu() {
    setSelectFilterMenu(false);
  }

  // FUNCTION TO GET THE RIDE COUNTS FOR ALL
  // RIDE TYPES i.e NEAREST, UPCOMING AND PAST
  function getRidesCount() {
    let todaysDate = new Date().getTime();
    let upcomingArr = Ride.filter(item => {
      return moment(item.date).isAfter(todaysDate);
    });
    setUpcomingRideCount(upcomingArr.length);
    let pastArr = Ride.filter(item => {
      return moment(item.date).isBefore(todaysDate);
    });
    setPastRideCount(pastArr.length);
  }

  useEffect(() => {
    getRidesCount();
    let arr = [];
    // CALCULATING THE DISTANCE FROM USER_STATION_CODE
    // AND FROM STATION_PATH_CODE
    Ride.forEach((rd, index) => {
      // RETURNING ABSOLUTE VALUES OF STATION_PATH MINUS THE USER_STATION_CODE
      let subtractArr = rd.station_path.map(function (item) {
        return Math.abs(item - userStationCode);
      });
      // FINDING THE MINIMUM FROM THE SUBTRACTED VALUE ARRAY
      // AND PUSHING THE VALUES IN A TEMP ARRAY WITH RIDE DETAILS AND DISTANCE KEY
      let distance = Math.min(...subtractArr);
      arr.push({ ...rd, distance: distance });
    });
    // SORTING THE RIDE LIST IN ASCENDING ORDER OF DISTANCE
    arr.sort(function (a, b) {
      var x = Number(a['distance']);
      var y = Number(b['distance']);
      return x > y ? 1 : x < y ? -1 : 0;
    });
    // TODAYS DATE FOR REFERENCE OF PAST AND UPCOMING RIDES
    let todaysDate = new Date().getTime();
    // FILTERING BASED ON STATE/CITY AND ON THE ACTIVE TAB/CURRENTLY SELECTED TAB
    if (activeTab === 'Nearest') {
      if (filterCity.length > 0) {
        let nearestArr = arr.filter(item => {
          return item.city === filterCity;
        });
        setRideData([...nearestArr]);
      } else if (filterState.length > 0) {
        let nearestArr = arr.filter(item => {
          return item.state === filterState;
        });
        setRideData([...nearestArr]);
      } else {
        setRideData([...arr]);
      }
    }
    // FILTER FOR DATES AFTER TODAYS DATE AND ON STATE/CITY
    if (activeTab === 'Upcoming') {
      if (filterCity.length > 0) {
        let upcomingArr = arr.filter(item => {
          return (
            moment(item.date).isAfter(todaysDate) && item.city === filterCity
          );
        });
        setRideData([...upcomingArr]);
      } else if (filterState.length > 0) {
        let upcomingArr = arr.filter(item => {
          return (
            moment(item.date).isAfter(todaysDate) && item.state === filterState
          );
        });
        setRideData([...upcomingArr]);
      } else {
        let upcomingArr = arr.filter(item => {
          return moment(item.date).isAfter(todaysDate);
        });
        setRideData([...upcomingArr]);
      }
    }
    // FILTER FOR DATES BEFORE TODAYS DATE AND ON STATE/CITY
    if (activeTab === 'Past') {
      if (filterCity.length > 0) {
        let pastArr = arr.filter(item => {
          return (
            moment(item.date).isBefore(todaysDate) && item.city === filterCity
          );
        });
        setRideData([...pastArr]);
      } else if (filterState.length > 0) {
        let pastArr = arr.filter(item => {
          return (
            moment(item.date).isBefore(todaysDate) && item.state === filterState
          );
        });
        setRideData([...pastArr]);
      } else {
        let pastArr = arr.filter(item => {
          return moment(item.date).isBefore(todaysDate);
        });
        setRideData([...pastArr]);
      }
    }
  }, [activeTab, filterCity, filterState]);

  const classes = useStyles();

  return (
    <div className="rides-page">
      <Navbar Name={User.name} />
      <div className="container">
        <div className="rides-types">
          <p
            onClick={() => {
              setFilterState('');
              setFilterCity('');
              setActiveTab('Nearest');
            }}
            className={activeTab === 'Nearest' ? 'active' : ''}
          >
            Nearest Rides <span>{`(${nearestRideCount})`}</span>
          </p>
          <p
            onClick={() => {
              setFilterState('');
              setFilterCity('');
              setActiveTab('Upcoming');
            }}
            className={activeTab === 'Upcoming' ? 'active' : ''}
          >
            Upcoming Rides <span>{`(${upcomingRideCount})`}</span>
          </p>
          <p
            onClick={() => {
              setFilterState('');
              setFilterCity('');
              setActiveTab('Past');
            }}
            className={activeTab === 'Past' ? 'active' : ''}
          >
            Past Rides <span>{`(${pastRideCount})`}</span>
          </p>
          <div className="filter">
            <Button
              style={{
                background: '#292929',
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                textTransform: 'none',
                color: '#d0cbcb',
              }}
              aria-owns={selectFilterMenu ? 'selectFilterMenu' : null}
              aria-haspopup="true"
              onClick={openSelectFilterMenu}
              variant="contained"
            >
              <SortIcon style={{ marginRight: '8px' }} /> Filters
            </Button>
            <Menu
              id="selectStatusMenu"
              getContentAnchorEl={null}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'center', horizontal: 'right' }}
              open={selectFilterMenu}
              transitionDuration={500}
              onClose={closeSelectFilterMenu}
            >
              <div className="filter-menu">
                <p>Filter</p>
                <FormControl variant="outlined">
                  <InputLabel
                    style={{ color: 'white' }}
                    id="demo-simple-select-outlined-label"
                  >
                    State
                  </InputLabel>
                  <Select
                    value={filterState}
                    onChange={e => {
                      setFilterCity('');
                      setFilterState(e.target.value);
                    }}
                    className={classes.select}
                    inputProps={{
                      classes: {
                        icon: classes.icon,
                        root: classes.root,
                      },
                    }}
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    label="State"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {Object.keys(statesAndCityList).map((item, i) => {
                      return (
                        <MenuItem value={item} key={i}>
                          {item}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl variant="outlined">
                  <InputLabel
                    style={{ color: 'white' }}
                    id="demo-simple-select-outlined-label"
                  >
                    City
                  </InputLabel>
                  <Select
                    className={classes.select}
                    inputProps={{
                      classes: {
                        icon: classes.icon,
                        root: classes.root,
                      },
                    }}
                    value={filterCity}
                    onChange={e => setFilterCity(e.target.value)}
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    label="City"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {statesAndCityList[filterState] &&
                      statesAndCityList[filterState]?.City?.map((item, i) => (
                        <MenuItem key={i} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            </Menu>
          </div>
        </div>
        <div className="cards">
          <Grid container spacing={2}>
            {rideData.map((ride, idx) => {
              return (
                <RideCards
                  key={idx}
                  id={ride.id}
                  origin_station={ride.origin_station_code}
                  station_path={ride.station_path}
                  Date={ride.date}
                  Distance={ride.distance}
                  City={ride.city}
                  State={ride.state}
                />
              );
            })}
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default RidesPage;
