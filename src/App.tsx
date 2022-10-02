import React, { useEffect, useState } from 'react'
import './App.css'
import Dropdown, { Option } from 'react-dropdown'
import 'react-dropdown/style.css'

import { convert } from "./lib/src/xml2snac"
import { fetchXML } from './lib/src/fetch'

const options = [
  { value: "cd", label: "CD" },
  { value: "waffle_flat", label: "Waffle Flat" },
  { value: "waffle", label: "Waffle" },
  { value: "waffles", label: "Waffles" },
]

const defaultOption = options[2]

const getUrl = (value: string) => `/xml/${value}.xml`

function App() {

  const [snac, setSnac] = useState<string>()
  useEffect(() => {
    fetchXML(getUrl(defaultOption.value), xml => getXmlString(xml))
  }, []);

  const fetchIt = (option: Option) => {
    fetchXML(getUrl(option.value), xml => getXmlString(xml))
  }

  //const getXmlString = (xml:string) => setSnac(JSON.stringify(convert(xml), null, 4))
  const getXmlString = (xml:string) => setSnac(xml)

  return (
    <div>
      <div>
        <Dropdown
          options={options}
          onChange={(e) => fetchIt(e)}
          value={defaultOption}
          placeholder="Select an option"
        />
      </div>
      <pre>
        {snac}
      </pre>
    </div>
  );
}

export default App
