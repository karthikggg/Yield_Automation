import React from "react";
import FilePicker from "../utils/chooseFile";
import { useState } from "react";
import { excelToJson } from "../utils/excelToJSON";
import jsonToTable from "../components/jsonToTable";
import { matchAndUpdateListings } from "../components/episodesUpdateFunc";

// const convertExcelToJson = require("../utils/jsonCon").default;

export const EPISODESCHANGE = () => {
  const [episodesChangeFile, setEpisodesChangeFile] = useState(null);
  const [exportedFile, setExportedFile] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [uniqueEvents, setUniqueEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const filteredEpisodes = episodesChangeFile
    ? episodesChangeFile.filter((item) => item.Col_3 === selectedEvent)
    : [];

    console.log(episodesChangeFile);
    
  
  
  const handleUpdate = () => {
     

    const result = matchAndUpdateListings(filteredEpisodes, filteredEpisodes);
    setFinalResult(result.updatedListing);

    // Show warnings
    result.messages.forEach((msg) => console.warn(msg.message));

    // Use updated data
    console.log(result.updatedData);
  };

  // Excel's epoch starts on Jan 1, 1900, but JS starts on Jan 1, 1970
  // Excel incorrectly treats 1900 as a leap year, so we subtract 1 extra day
  function excelDateToJSDate(serial) {
    // Excel uses Jan 1, 1900 as day 1
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));

    const days = Math.floor(serial);
    const millisecondsPerDay = 86400000;

    const date = new Date(excelEpoch.getTime() + days * millisecondsPerDay);

    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    return `${month}/${day}/${year}`;
  }

  // here the algo starts for episodes change file

  return (
    <div className="  p-39">
      <div className="flex justify-around items-center bg-gray-100">
        <div>
          <p>episodes Change File</p>
          <FilePicker
            accept=".xlsx,.xls"
            onChange={(file) =>
              excelToJson(file, {
                headerRow: -1,
                skipColumns: ["A", "B", "C"],
              }).then((json) => {
                setEpisodesChangeFile(json);
                let a = [...new Set(json.map((item) => item.Col_3))];
                a.shift();
                setUniqueEvents(a);
              })
            }
          />
        </div>
        <div>
          <p>Exported files</p>
          <FilePicker
            accept=".xlsx,.xls"
            onChange={(file) =>
              excelToJson(file, {
                onlyColumns: [
                  "A",
                  "B",
                  "C",
                  "D",
                  "E",
                  "F",
                  "G",
                  "H",
                  "I",
                  "J",
                  "K",
                  "L",
                ],
              }).then((json) => {
                setExportedFile(json);
                console.log(exportedFile);
              })
            }
          />
        </div>
      </div>
      <div className="result">{finalResult && jsonToTable(finalResult)}</div>
      {/* <div>{uniqueEvents.length > 0 && <CheckboxDiv uniqueEvents={uniqueEvents} />}</div> */}
      <div style={{ marginBottom: "2rem" }}>
        {uniqueEvents.map((event) => (
          <div key={event} style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="episodes"
                value={event}
                checked={selectedEvent === event}
                onChange={(e) => setSelectedEvent(e.target.value)}
                style={{ marginRight: "8px" }}
              />
              <span>{event}</span>
            </label>
          </div>
        ))}
      </div>
      <div>{filteredEpisodes && jsonToTable(filteredEpisodes)}</div>
      <div>{exportedFile && jsonToTable(exportedFile)}</div>
      <div>
        <button onClick={handleUpdate}>Update Episodes</button>
      </div>
      <div>{finalResult && jsonToTable(finalResult)}</div>
    </div>
  );
};
