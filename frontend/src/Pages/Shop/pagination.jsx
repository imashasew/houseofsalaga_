import "./pagination.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pagesToShow = [1, 2, 3];

  return (
    <div className="pagination-container">
      {/* Previous Button */}
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="pagination-pages">
        {pagesToShow.map((page) => (
          <button
            key={page}
            className={`page-button ${page === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <span className="page-ellipsis">...</span>

        {[7, 9, 10].map((page) => (
          <button
            key={page}
            className={`page-button ${page === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
