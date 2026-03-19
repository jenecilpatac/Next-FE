const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: any) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  }

  const handleFirstPage = () => {
    onPageChange(1);
  }

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-gray-100 dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-50 hover:dark:bg-gray-800 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-gray-100 dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-50 hover:dark:bg-gray-800 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Showing <span className="font-medium">{startIndex}</span> to{" "}
            <span className="font-medium">{endIndex}</span> of{" "}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>

        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          >
            <button
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 dark:text-gray-200 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:dark:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <i className="fa-solid fa-chevrons-left" aria-hidden="true" />
            </button>
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 dark:text-gray-200 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:dark:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <i className="fa-solid fa-chevron-left" aria-hidden="true" />
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 hover:bg-blue-500 focus:z-20 focus:outline-offset-0 ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 hover:dark:bg-gray-800"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 dark:text-gray-200 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:dark:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <i className="fa-solid fa-chevron-right" aria-hidden="true" />
            </button>
            <button
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 dark:text-gray-200 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:dark:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <i className="fa-solid fa-chevrons-right" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
