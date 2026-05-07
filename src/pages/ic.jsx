import React, { useEffect } from "react";
import FilePicker from "../utils/chooseFile";
import { excelToJson } from "../utils/excelToJSON";
import { useState } from "react";
import jsonToTable from "../components/jsonToTable";

export const IC = () => {
  const [assignedFileData, setAssignedFileData] = React.useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selected, setSelected] = useState("Pending");
  const [mappedDB, setMappedDB] = useState([]);
  const [statusFilters, setStatusFilter] = useState("Pending");

  const names = [
    "name",
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
    "Vedhasree Manivannan",
  ];
  const db = [
    { Market: "Albany-Schenectady-Troy", Database: "NEW ENGLAND" },
    { Market: "ALBUQUERQUE", Database: "MOUNTAIN" },
    { Market: "Amarillo", Database: "MOUNTAIN" },
    { Market: "ATLANTA", Database: "ATLANTA" },
    { Market: "AUGUSTA", Database: "JACKSONVILLE" },
    { Market: "BALTIMORE", Database: "MID ATLANTIC" },
    { Market: "BOSTON", Database: "NEW ENGLAND" },
    { Market: "Bowling Green", Database: "NASHVILLE" },
    { Market: "BURLINGTON", Database: "NEW ENGLAND" },
    { Market: "CHAMPAIGN", Database: "CHICAGO" },
    { Market: "CHARLESTON", Database: "JACKSONVILLE" },
    { Market: "Charlottesville", Database: "MID ATLANTIC" },
    { Market: "CHATTANOOGA", Database: "CHAT KNOX" },
    { Market: "CHICAGO", Database: "CHICAGO" },
    { Market: "Cleveland-Akron", Database: "LIBERTY" },
    { Market: "COLORADO SPRINGS", Database: "MOUNTAIN" },
    { Market: "Columbus-Tupelo-West Point", Database: "JACKSON" },
    { Market: "Davenport-R.Island-Moline", Database: "CHICAGO" },
    { Market: "DENVER", Database: "MOUNTAIN" },
    { Market: "DETROIT", Database: "DETROIT" },
    { Market: "El Paso", Database: "MOUNTAIN" },
    { Market: "EUGENE", Database: "NORTH WEST" },
    { Market: "Flint-Saginaw-Bay City", Database: "DETROIT" },
    { Market: "FRESNO", Database: "CALIFORNIA" },
    { Market: "FT. MYERS - NAPLES", Database: "SARASOTA" },
    { Market: "FT. WAYNE", Database: "DETROIT" },
    { Market: "GRAND RAPIDS", Database: "DETROIT" },
    { Market: "HLLY", Database: "LIBERTY" },
    { Market: "Harrisonburg", Database: "LIBERTY" },
    { Market: "HARTFORD", Database: "NEW ENGLAND" },
    { Market: "Hattiesburg-Laurel", Database: "JACKSON" },
    { Market: "HOUSTON", Database: "HOUSTON" },
    { Market: "INDIANAPOLIS", Database: "DETROIT" },
    { Market: "JACKSON", Database: "JACKSON" },
    { Market: "JACKSONVILLE", Database: "JACKSONVILLE" },
    { Market: "JOHNSTOWN-ALTOONA", Database: "LIBERTY" },
    { Market: "JOHNSTOWN-ALTOONA", Database: "LIBERTY" },
    { Market: "KNOXVILLE", Database: "CHAT KNOX" },
    { Market: "Lafayette, IN", Database: "DETROIT" },
    { Market: "LANSING", Database: "DETROIT" },
    { Market: "LITTLE ROCK", Database: "MEMPHIS" },
    { Market: "Louisville", Database: "DETROIT" },
    { Market: "MEMPHIS", Database: "MEMPHIS" },
    { Market: "Meridian", Database: "JACKSON" },
    { Market: "MIAMI", Database: "SOUTH FLORIDA" },
    { Market: "MINNEAPOLIS - ST. PAUL", Database: "TWIN CITIES" },
    { Market: "MONROE", Database: "JACKSON" },
    { Market: "MONTEREY", Database: "CALIFORNIA" },
    { Market: "NASHVILLE", Database: "NASHVILLE" },
    { Market: "New York", Database: "NEW YORK" },
    { Market: "Paducah-C.Gird-Harbg-Mt VN", Database: "NASHVILLE" },
    { Market: "PANAMA CITY", Database: "SARASOTA" },
    { Market: "PEORIA", Database: "CHICAGO" },
    { Market: "PHILADELPHIA", Database: "LIBERTY" },
    { Market: "PITTSBURGH", Database: "LIBERTY" },
    { Market: "PORTLAND", Database: "NORTH WEST" },
    { Market: "Providence-New Bedford", Database: "NEW ENGLAND" },
    { Market: "RICHMOND", Database: "MID ATLANTIC" },
    { Market: "ROANOKE", Database: "MID ATLANTIC" },
    { Market: "Rockford", Database: "CHICAGO" },
    { Market: "SACRAMENTO", Database: "CALIFORNIA" },
    { Market: "SALISBURY", Database: "MID ATLANTIC" },
    { Market: "SALT LAKE CITY", Database: "MOUNTAIN" },
    { Market: "SAN FRANCISCO", Database: "CALIFORNIA" },
    { Market: "SAVANNAH", Database: "JACKSONVILLE" },
    { Market: "SEATTLE", Database: "NORTH WEST" },
    { Market: "SOUTH BEND", Database: "DETROIT" },
    { Market: "SPOKANE", Database: "NORTH WEST" },
    { Market: "SPRINGFIELD", Database: "NEW ENGLAND" },
    { Market: "TALLAHASSEE", Database: "SARASOTA" },
    { Market: "Tampa-St. Pete", Database: "SARASOTA" },
    { Market: "TUPELO", Database: "JACKSON" },
    { Market: "WASHINGTON", Database: "MID ATLANTIC" },
    { Market: "WEST PALM BEACH", Database: "SOUTH FLORIDA" },
    { Market: "Wheeling-Steubenville", Database: "LIBERTY" },
    { Market: "WILKES-BARRE", Database: "LIBERTY" },
    { Market: "Youngstown", Database: "LIBERTY" },
    { Market: "Not Assigned", Database: "Not Assigned" },
  ];

  useEffect(() => {
    if (assignedFileData) {
      let arr = [];
      assignedFileData.forEach((item) => {
        const market = item.Market;
        const dbEntry = db.find((entry) => entry.Market === market);
        const mergedEntry = {
          ...item,
          Database: dbEntry ? dbEntry.Database : "Not Found",
          status: "",
          id: Math.random(),
        };
        arr.push(mergedEntry);
      });
      setFilteredData(arr);
    }
  }, [assignedFileData]);

  const filterNames = (data) => {
    const filteredData = data.filter((item) => item.Name === selected);
    return filteredData;
  };

  const handleStatusChange = (item, newStatus) => {
    setFilteredData((prevItems) =>
      prevItems.map((i) =>
        i.Database === item.Database &&
        i.Name === item.Name &&
        i.Network === item.Network &&
        i.WO === item.WO
          ? { ...i, status: newStatus }
          : i,
      ),
    );
  };
  const seen = new Set();
  const deduplicated = filteredData.filter((obj) => {
    const key = `${obj.Database}|${obj.WO}|${obj.Network}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  console.log(filterNames(filteredData));

  const statusFilter = (status) => {
    return filterNames(filteredData).filter((item) => item.status === status);
  };
 function copyTable(tableName , columnsToSkip) {
  const table = document.getElementById(tableName);
  const rows = table.querySelectorAll("tbody tr");
  
  // Columns to skip (0-based index)
  // In your table: Status is the last column (index 7)
  const skipColumns = columnsToSkip; // Skip the Status column (8th column)

  let html = "<table><tr>";
  rows.forEach((row) => {
    html += "<tr>";
    row.querySelectorAll("td").forEach((cell, index) => {
      // Skip if this column index is in skipColumns
      if (!skipColumns.includes(index)) {
        html += `<td>${cell.textContent}</td>`;
      }
    });
    html += "</tr>";
  });
  html += "</table>";

  const blob = new Blob([html], { type: "text/html" });
  navigator.clipboard.write([new ClipboardItem({ "text/html": blob })]);

  alert("Copied!");
}
  const handleStartTimerClick = (item) => {
    setFilteredData((prevItems) =>
      prevItems.map((i) =>
        i.id === item.id ? { ...i, timerActive: true, start:  new Date() , end: new Date()} : i,
      ),
    );
  };
  const handleEndTimerClick = (item) => {
    setFilteredData((prevItems) =>
      prevItems.map((i) =>
        i.id === item.id ? { ...i, timerActive: false, end: new Date() } : i,
      ),
    );
  };

  return (
    <div>
      <FilePicker
        onChange={(file) =>
          excelToJson(file, {
            headerRow: 0,
          }).then((json) => {
            setAssignedFileData(json);
          })
        }
      />
      <select
        className="p-2 border border-gray-300 rounded"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        {names &&
          names.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
      </select>
       <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => copyTable("my-table-2", [7,8])}
        id="copyBtn"
      >
        📋 Copy Table
      </button>
      {filteredData && (
        <table id="my-table-2">
          <thead>
            <tr>
              <th>Name</th>
              <th>Zone/IC</th>
              <th>Market</th>
              <th>Network</th>
              <th>% Change WoW</th>
              <th>WO</th>
              <th>Database</th>
              <th>Status</th>
              <th>Timer</th>
              <th>Start</th>
              <th>End</th>
              <th>overall Time</th>
            </tr>
          </thead>
          <tbody>
            {filterNames(deduplicated).sort((a, b) => a.Database.localeCompare(b.Database)).map((item) => (
              <tr className={item.status} key={item.id}>
                <td>{item.Name}</td>
                <td>{item["Zone/IC"]}</td>
                <td>{item.Market}</td>
                <td>{item.Network}</td>
                <td>{item["% Change WoW"]}</td>
                <td>{item.WO}</td>
                <td>{item.Database}</td>
                <td>
                  <select
                    name=""
                    id=""
                    onChange={(e) => handleStatusChange(item, e.target.value)}
                    value={
                      item.status === "already done by out team"
                        ? "already-done-by-out-team"
                        : item.status
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Done">Done</option>
                    <option value="Already-done-by-our-team">
                      Already-done-by-our-team
                    </option>
                    <option value="Done-by-US-Team">Done-by-US-Team</option>
                  </select>
                </td>
                <td>
                  <button
                  className={`px-2 py-1 rounded ${item.timerActive ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                    onClick={() => {
                      handleStartTimerClick(item);
                    }}
                  >
                    {item.timerActive ? "Running..." : "Start"}
                  </button>
                  <button
                    className={`ml-2 px-2 py-1 rounded ${!item.timerActive ? "bg-red-500 text-white" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      }`}
                    onClick={() => {
                      handleEndTimerClick(item);
                    }}
                  >
                    End
                  </button>
                </td>
                <td>{item.start ? item.start.toLocaleTimeString() : ""}</td>
                <td>{item.end ? item.end.toLocaleTimeString() : ""}</td>
                <td>
                  {item.start &&
                    item.end &&
                    Math.round((item.end - item.start) / (1000 * 60 * 60)) + ":" + Math.round((item.end - item.start) / (1000 * 60) % 60).toString().padStart(2, '0') + ":" + Math.round((item.end - item.start) / 1000).toString().padStart(2, '0')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="status-select mt-14 mb-4">
        <label htmlFor="status">Filter by status: </label>
        <select
          id="status"
          onChange={(e) => setStatusFilter(e.target.value)}
          value={statusFilters}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Done">Done</option>
          <option value="already-done-by-out-team">
            Already Done by Out Team
          </option>
          <option value="Done-by-US">Done by US</option>
        </select>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => copyTable("myTable", [47])}
        id="copyBtn"
      >
        📋 Copy Table
      </button>
      <div>
        {filterNames(filteredData).length > 0 && (
          <table id="myTable">
            <thead>
              <tr>
                <th>Zone/IC</th>
                <th>Market</th>
                <th>Network</th>
                <th>% Change WoW</th>
                <th>WO</th>
                <th>Database</th>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {statusFilter(statusFilters).sort((a, b) => a.Database.localeCompare(b.Database)).map((item) => (
                <tr className={item.status} key={item.id}>
                  <td>{item["Zone/IC"]}</td>
                  <td>{item.Market}</td>
                  <td>{item.Network}</td>
                  <td>{item["% Change WoW"]}</td>
                  <td>{item.WO}</td>
                  <td>{item.Database}</td>
                  <td>{item.Name}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
