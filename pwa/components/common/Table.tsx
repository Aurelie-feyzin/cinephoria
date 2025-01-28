import React from "react";

export type Column<T> = {
    key: string;
    label: string;
    render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
    columns: Column<T>[];
    data: T[];
    index: keyof T;
};

const Table = <T extends { [key: string]: any }>({columns, data, index}: TableProps<T>) => (
    <table className="table-auto bg-white border border-gray-300 shadow-md">
        <thead>
        <tr className="bg-gray-100">
            {columns.map((column) => (
                <th key={column.key} className="px-4 py-2 border-b">
                    {column.label}
                </th>
            ))}
        </tr>
        </thead>
        <tbody>
        {data.map((row) => (
            <tr key={String(row['@id'])} className="hover:bg-gray-100">
                {columns.map((column) => (
                    <td key={column.key} className="px-4 py-2 border-b">
                        {column.render ? column.render(row) : row[column.key]}
                    </td>
                ))}
            </tr>
        ))}
        </tbody>
    </table>
)

export default Table;