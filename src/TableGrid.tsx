import { createContext, useContext, useMemo, useState } from "react";
import DataGrid from "react-data-grid";
import type { Column, HeaderRendererProps } from "react-data-grid";
import { useFocusRef } from "./useFocusRef";
import { Person } from "./App";

interface Props {
  direction: "ltr" | "rtl";
  data: Person[];
}

const rootClassname = "rootClassname";

const toolbarClassname = "toolbarClassname";

const filterColumnClassName = "filter-cell";

const filterContainerClassname = "filterContainerClassname";

const filterClassname = "filterClassname";

interface Row extends Person {}

interface Filter extends Omit<Person, "name"> {
  name: string;
  enabled: boolean;
}

// Context is needed to read filter values otherwise columns are
// re-created when filters are changed and filter loses focus
const FilterContext = createContext<Filter | undefined>(undefined);

function inputStopPropagation(event: React.KeyboardEvent<HTMLInputElement>) {
  if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.stopPropagation();
  }
}

function FilterRenderer<R, SR, T extends HTMLOrSVGElement>({
  isCellSelected,
  column,
  children,
}: HeaderRendererProps<R, SR> & {
  children: (args: {
    ref: React.RefObject<T>;
    tabIndex: number;
    filters: Filter;
  }) => React.ReactElement;
}) {
  const filters = useContext(FilterContext)!;
  const { ref, tabIndex } = useFocusRef<T>(isCellSelected);

  return (
    <>
      <div>{column.name}</div>
      {filters.enabled && <div>{children({ ref, tabIndex, filters })}</div>}
    </>
  );
}

export default function HeaderFilters({ direction, data }: Props) {
  const [filters, setFilters] = useState<Filter>({
    email: "",
    gender: "",
    name: "",
    phone: "",
    enabled: true,
  });

  const columns = useMemo((): readonly Column<Row>[] => {
    return [
      {
        key: "name",
        name: "Name",
        headerCellClass: filterColumnClassName,
        formatter: (p) => {
          const { title, first, last } = p.row.name;
          return <span>{`${title} ${first} ${last}`}</span>;
        },
        headerRenderer: (p) => (
          <FilterRenderer<Row, unknown, HTMLInputElement> {...p}>
            {({ filters, ...rest }) => (
              <input
                {...rest}
                className={filterClassname}
                value={filters.name}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    name: e.target.value,
                  })
                }
                onKeyDown={inputStopPropagation}
              />
            )}
          </FilterRenderer>
        ),
      },
      {
        key: "gender",
        name: "Gender",
        headerCellClass: filterColumnClassName,
        headerRenderer: (p) => (
          <FilterRenderer<Row, unknown, HTMLInputElement> {...p}>
            {({ filters, ...rest }) => (
              <input
                {...rest}
                className={filterClassname}
                value={filters.gender}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    name: e.target.value,
                  })
                }
                onKeyDown={inputStopPropagation}
              />
            )}
          </FilterRenderer>
        ),
      },
      {
        key: "email",
        name: "Email",
        headerCellClass: filterColumnClassName,
        headerRenderer: (p) => (
          <FilterRenderer<Row, unknown, HTMLInputElement> {...p}>
            {({ filters, ...rest }) => (
              <input
                {...rest}
                className={filterClassname}
                value={filters.email}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    name: e.target.value,
                  })
                }
                onKeyDown={inputStopPropagation}
              />
            )}
          </FilterRenderer>
        ),
      },
      {
        key: "phone",
        name: "Phone",
        headerCellClass: filterColumnClassName,
        headerRenderer: (p) => (
          <FilterRenderer<Row, unknown, HTMLInputElement> {...p}>
            {({ filters, ...rest }) => (
              <input
                {...rest}
                className={filterClassname}
                value={filters.phone}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    name: e.target.value,
                  })
                }
                onKeyDown={inputStopPropagation}
              />
            )}
          </FilterRenderer>
        ),
      },
    ];
  }, []);

  const filteredRows = useMemo(() => {
    return data.filter((r) => {
      const { first, last } = r.name;
      const preparedForSearch = first + last;
      return (
        (filters.email
          ? r.email.toLowerCase().includes(filters.email.toLowerCase())
          : true) &&
        (filters.gender
          ? r.gender.toLowerCase().includes(filters.gender.toLowerCase())
          : true) &&
        (filters.phone
          ? r.phone.toLowerCase().includes(filters.phone.toLowerCase())
          : true) &&
        (filters.name
          ? preparedForSearch.toLowerCase().includes(filters.name.toLowerCase())
          : true)
      );
    });
  }, [data, filters]);

  function clearFilters() {
    setFilters((prev) => ({
      ...prev,
      email: "",
      gender: "",
      name: "",
      phone: "",
    }));
  }

  function toggleFilters() {
    setFilters((filters) => ({
      ...filters,
      enabled: !filters.enabled,
    }));
  }

  return (
    <div className={rootClassname}>
      <div className={toolbarClassname}>
        <button type="button" onClick={toggleFilters}>
          Toggle Filters
        </button>{" "}
        <button type="button" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
      <FilterContext.Provider value={filters}>
        <DataGrid
          className={filters.enabled ? filterContainerClassname : undefined}
          columns={columns}
          rows={filteredRows}
          headerRowHeight={filters.enabled ? 70 : undefined}
          direction={direction}
        />
      </FilterContext.Provider>
    </div>
  );
}
