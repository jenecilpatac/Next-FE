const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }: any) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Build windowed page numbers with ellipsis
  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | "...")[] = [1];

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const btnBase = "flex items-center justify-center w-9 h-9 rounded-xl text-sm font-medium transition-colors focus:outline-none";
  const btnNav = `${btnBase} border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed`;
  const btnPage = (active: boolean) =>
    `${btnBase} ${active
      ? "bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-none border border-blue-600"
      : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800"
    }`;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 dark:border-gray-800">
      {/* Results info */}
      <p className="text-xs text-gray-500 dark:text-gray-400 order-2 sm:order-1">
        Showing <span className="font-semibold text-gray-700 dark:text-gray-200">{startIndex}</span>–<span className="font-semibold text-gray-700 dark:text-gray-200">{endIndex}</span> of <span className="font-semibold text-gray-700 dark:text-gray-200">{totalItems}</span> results
      </p>

      {/* Controls */}
      <nav className="flex items-center gap-1 order-1 sm:order-2" aria-label="Pagination">
        {/* First */}
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className={btnNav} title="First page">
          <i className="fa-solid fa-angles-left text-xs"></i>
        </button>

        {/* Prev */}
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className={btnNav} title="Previous page">
          <i className="fa-solid fa-chevron-left text-xs"></i>
        </button>

        {/* Page numbers */}
        {getPages().map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm select-none">
              &hellip;
            </span>
          ) : (
            <button key={page} onClick={() => onPageChange(page)} className={btnPage(page === currentPage)} aria-current={page === currentPage ? "page" : undefined}>
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className={btnNav} title="Next page">
          <i className="fa-solid fa-chevron-right text-xs"></i>
        </button>

        {/* Last */}
        <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className={btnNav} title="Last page">
          <i className="fa-solid fa-angles-right text-xs"></i>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
