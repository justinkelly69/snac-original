import React, { useState } from 'react';
import './App.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import { convert } from "./lib/src/xml2snac"
import { setConstantValue, setSyntheticLeadingComments } from 'typescript';

const options = [
  { value: "cd", label: "CD" },
  { value: "waffle_flat", label: "Waffle Flat" },
  { value: "waffle", label: "Waffle" },
  { value: "waffles", label: "Waffles" },
]

const defaultOption = options[2];



function App() {

  const [snac, setSnac] = useState<string>("")

  const _onSelect = (option: any) => {
    const xml = option.value
    const url = `/xml/${xml}.xml`
  
    fetch(url, {
      mode: 'no-cors',
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/xml',
        'content-type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT',
        'Access-Control-Allow-Headers': 'Content-Type',
      })
    })
      .then(response => {
        response.text().then(xml => {
          setSnac(JSON.stringify(convert(xml), null, 4))
        })
      })
  }

  return (
    <div>
      <div>
        <Dropdown
          options={options}
          onChange={_onSelect}
          value={defaultOption}
          placeholder="Select an option"
        />
      </div>
      <pre id="xmlDisplay">
        {snac}
      </pre>
    </div>
  );
}

export default App;
