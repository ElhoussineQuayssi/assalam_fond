const Table = ({ columns, data, className = "", rowRefs = null }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-600">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left py-5 px-6 font-medium text-slate-600 dark:text-slate-400"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              ref={
                rowRefs
                  ? (el) => {
                      if (el) rowRefs.current[index] = el;
                    }
                  : null
              }
              className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-all duration-300"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="py-5 px-6 text-slate-900 dark:text-slate-300"
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { Table };
