import React from 'react';
const Pagination = ({ page, totalPages, onPageChange }) => (
  <div className="pagination">
    <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>Prev</button>
    <span>{page} / {totalPages}</span>
    <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next</button>
  </div>
);
export default Pagination;
