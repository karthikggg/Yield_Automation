import React from 'react'
import FilePicker from '../utils/chooseFile'
import { excelToJson } from '../utils/excelToJSON'
import { useState } from 'react'

export const IC = () => {
    const [assignedFileData, setAssignedFileData] = React.useState(null);
     const [selected, setSelected] = useState("");

    const names = [
  "Karthik Govindasamy",
  "Karthikeyan Panchavaranam",
  "Bala Thirupathi Raaja",
  "Mohammed Umar Mansoor",
  "Janani Venkatesalu",
  "Dilip Suresh",
  "Kishore Sivalingam",
  "Dharsini Nethaji",
  "Tamilarasi Balamurugan",
  "Naveen Kumar Sankar",
  "Sonia Selva Kumar",
  "Vijayalakshmi Janakiraman",
  "P. Akshay Kumar",
  "pragadeeshwaran Ganesan",
  "Hemavathy Rajendran",
  "Aishwarya Rajamohan",
  "Nitish Kumar",
  "Vedhasree Manivannan"
];

const filterNames = (data) =>{
    const filteredData = data.filter(item => item.Name === selected);
    return filteredData;
}
  return (
    <>
      <FilePicker 
       onChange={(file) =>
              excelToJson(file, {
                headerRow: 0,
              }).then((json) => {
                setAssignedFileData(json) })
            }
          
      />
       <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        {names && names.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
    </select>
      {assignedFileData && (
        <div>
          <h2>Assigned File Data:</h2>
          <pre>{JSON.stringify(filterNames(assignedFileData), null, 2)}</pre>
        </div>
      )}
    </>
  )
}