import React, { useEffect, useState } from "react";
import "./App.css";
import TableTenStack from "./TableTenStack";
import TableReactM from "./TableReactM";
import TableGrid from "./TableGrid";
export type Person = {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  phone: string;
  /* [x: string]: unknown; */
};
const App = () => {
  const [tableOne, setTableOne] = useState<"ten" | "material" | "grid">("ten");
  const [data, setData] = useState<Person[]>([]);
  useEffect(() => {
    fetch("https://randomuser.me/api/?results=10")
      .then((data) => {
        return data.json();
      })
      .then((data) => setData(data.results as Person[]));
  }, []);

  return (
    <div className="App">
      <h1>Table</h1>
      <h3>
        {
          {
            ten: "Tabella tenStack",
            material: "Tabella Material Table",
            grid: "Tabella Data Grid",
          }[tableOne]
        }
      </h3>
      <div style={{ margin: "auto" }}>
        <button
          type="button"
          style={{ marginRight: "5px" }}
          onClick={() => setTableOne("ten")}
        >
          Table TenStack
        </button>
        <button type="button" onClick={() => setTableOne("material")}>
          Table Material
        </button>
        <button type="button" onClick={() => setTableOne("grid")}>
          Table Data Grid
        </button>
        <div>
          {tableOne === "ten" && <TableTenStack data={data} />}{" "}
          {tableOne === "material" && <TableReactM data={data} />}
          {tableOne === "grid" && <TableGrid direction="ltr" data={data} />}
        </div>
      </div>
    </div>
  );
};

export default App;
