import React from "react";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  ReactiveBase,
  ReactiveList,
  SingleDataList,
} from "@appbaseio/reactivesearch";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ReactiveBase
        app="meetup_dataset"
        url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb6@appbase-demo-ansible-abxiydt-arc.searchbase.io"
        credentials="a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61"
        enableAppbase
      >
        <SingleDataList
          componentId="SearchBoxSensor"
          showRadio
          dataField="location"
          defaultValue="New York"
          data={[
            {
              label: "New York",
              value: "New York",
            },
            {
              label: "San Francisco",
              value: "San Francisco",
            },
          ]}
          customQuery={(p) => {
            console.log(p, "p");

            const newYork = {
              lat: 40.7128,
              lon: -74.006,
            };

            const sanFran = {
              lat: 37.7749,
              lon: -122.4194,
            };

            console.log(p);

            if (!p) return {};

            console.log(p === "New York" ? newYork : sanFran);

            return {
              query: {
                bool: {
                  filter: {
                    geo_distance: {
                      distance: "50km",
                      location: {
                        ...(p === "New York" ? newYork : sanFran),
                      },
                    },
                  },
                },
              },
            };

            return {
              query: {
                match: { country_name: "us" },
              },
            };
          }}
        />
        {/* <GeoDistanceDropdown
          componentId="LocationUI"
          dataField="location"
          data={[
            { distance: 20, label: "< 20 miles" },
            { distance: 50, label: "< 50 miles" },
            { distance: 100, label: "< 100 miles" },
          ]}
          render={(...args) => {
            console.log(args);
          }}
          defaultValue={{
            label: "< 100 miles",
          }}
        /> */}

        <ReactiveList
          componentId="results"
          onQueryChange={function (prevQuery, nextQuery) {
            // use the query with other js code
            console.log("prevQuery", prevQuery);
            console.log("nextQuery", nextQuery);
          }}
          dataField="location"
          react={{
            and: ["SearchBoxSensor"],
          }}
          size={10}
          pagination
          render={({ data }) => (
            console.log(data),
            (
              <div>
                {data.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <h4>{item.event.event_name}</h4>
                    <p>
                      {item.group.group_city}, {item.member.member_name}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}
        />
      </ReactiveBase>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
