const jsonToTable = (data) => {
  if (!data || data.length === 0) return <p>No data available</p>;
  
  const headings = Object.keys(data[0]);

  return (
    <table>
      <thead>
        <tr>
          {headings.map(key => <th key={key}>{key}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {headings.map(key => <td key={key}>{item[key]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default jsonToTable;
