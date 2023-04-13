/* src/App.js */
import React, { useEffect, useState } from 'react'
import { Amplify, API, graphqlOperation } from 'aws-amplify'
import {  createClickCount, updateClickCount } from './graphql/mutations'
import {  listClickCounts } from './graphql/queries'
import axios from 'axios'
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"



import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const App = () => {
  const [allClicks, setAllClicks] = useState([])
  const [clickCount, setTotalClickCount] = useState(0)
  const [location, setLocation] = useState('')
  const [coordinates, setCoordinates] = useState([])
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    fetchAllClicks()
    fetchLocation()
    updateMap()
  }, [])

  var clickMapData = []

  function updateMap() {
    var data = clickMapData.map((item) => (
      {coordinates: [item.lat, item.lon],
      count: item.count,
      name: item.description}
    ))
    setMarkers(data)
  }

  async function fetchAllClicks() {
    try {
      const res = await API.graphql(
        graphqlOperation(listClickCounts, {
        items: {
          count:'',
          description:'',
          id:''
        }
      }))
      const allClickData = res.data.listClickCounts.items
      clickMapData = allClickData
      var totalClicks = 0
      for (var i = 0; i < allClickData.length; i++) {
        totalClicks = totalClicks + allClickData[i].count
      }
      setTotalClickCount(totalClicks)
      setAllClicks(allClickData)
      updateMap()
    } catch (err) {console.log('error fetching All clicks')}
  }

  async function addClick() {
    try {
      //refresh clickCount
      await fetchAllClicks()
      //----update database records---
      //check if we should update an existing location, or add a new
      var matchFound = false
      //check if the current location matches clicks from pre-existing location
      for (var i = 0; i < allClicks.length; i++) {
        if (allClicks[i].description === location) {
          //location has been clicked from before, increment entry and update
          var newLocationCount = allClicks[i].count + 1
          var id = allClicks[i].id
          matchFound = true
          await API.graphql(graphqlOperation(updateClickCount, {input: {id: id, count: newLocationCount}}))
          break
        }
      }
      if (!matchFound) {
        //no existing location matched, create new entry
        await API.graphql(graphqlOperation(createClickCount, {input: {count: 1, description: location, lat:coordinates[1], lon:coordinates[0]}}))
      }
      //refresh to update location counts and total
      fetchAllClicks()
      updateMap()
    } catch (err) {
      console.log('error adding click:', err)
    }
  }

  async function fetchLocation() {
    //prevent excessive use of API by only using once per page refresh.
    if (location !== '') {
      return
    }
    try {
      //api key below has a max use of 1000 get requests, and there is no CC on the account for the trial
      const res = await axios.get("https://api.ipgeolocation.io/ipgeo?apiKey=d0367a2405c141a5ba8a0905d9ee6f9f")
      setLocation(`${res.data.city}, ${res.data.state_prov}`)
      setCoordinates([Number(res.data.latitude), Number(res.data.longitude)])
    } catch (err) {console.log('error fetching location')}
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.centerText}>Click Counter</h2>
      <button style={styles.button} onClick={addClick}>Add Click</button>
      <h3 style={styles.centerText}>{`Clicks: ${clickCount}`}</h3>
      <h4 style={styles.centerText}>{`Your IP address location: ${location}`}</h4>
      <p style={styles.centerText}>Where are clicks coming from?</p>
      <ComposableMap>
      <Geographies geography="https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json">
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
      {markers.map(({name, coordinates, count}) => (
        <Marker key={name} coordinates={coordinates}>
          <circle r={`${name ? '8' : '0'}`} fill="#F00" stroke="#fff" strokeWidth={2} />
        </Marker>
      ))}
    </ComposableMap>
      <ul style={styles.marginAuto}>
        {
          allClicks.map((item, index) =>
            <li key={item.id ? item.id: index}>{`${item.count} clicks from ${item.description ? item.description : 'somewhere on Earth'}`}</li>
          )
        }
      </ul>
      <p>Made with Amplify for development using GraphQL server and React. Geolocation services provided by ipgeolocation.io. Map functionality using react-simple-maps with tiles from https://github.com/deldersveld/topojson.</p>
    </div>
  )
}

const styles = {
  centerText: {textAlign: 'center'},
  marginAuto: {margin: 'auto'},
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px', cursor: 'pointer', borderRadius: '5px' }
}

export default App
