import React, { useMemo } from "react";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { Person } from "./App";

const TableReactM = ({ data }: { data: Person[] }) => {
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        muiTableHeadCellProps: { sx: { color: "green" } },
        accessorFn: ({ name: { title, first, last } }) =>
          `${title} ${first} ${last}`,
        filterFn: (row, id, filterValues) => {
          return (row.getValue(id) as string)
            .toLowerCase()
            .includes((filterValues as string).toLowerCase());
        },
        sortingFn: (a, b, id) => {
          const valueA = a.getValue(id) as string;
          const valueB = b.getValue(id) as string;
          return valueA
            .trim()
            .toLowerCase()
            .localeCompare(valueB.trim().toLowerCase());
        },
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "gender",
        header: "Gender",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
    ],
    []
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableRowSelection
      enableColumnOrdering={false}
      enableGlobalFilter={false}
    />
  );
};

export default TableReactM;
