import type {ReactNode} from "react";

export type Column<T> = {
    key: keyof T;
    header:string;
    render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
    columns:Column<T>[];
    rows: T[];
    getRowKey: (row:T) => string | number;
    caption?:string;
};

function Table<T>({
    columns,
    rows, 
    getRowKey,
    caption,
}: TableProps<T>) {
    return (
    <div className="table-scroll">
      <table>
        {caption && <caption>{caption}</caption>}

        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((column) => (
                <td key={String(column.key)}>
                  {column.render
                    ? column.render(row)
                    : String(row[column.key] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;