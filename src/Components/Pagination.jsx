import React from "react";

const Pagination = ({ pageNumbers, paginate }) => {
  return (
    <div className="pagination">
      {pageNumbers.map((number) => (
        <button key={number} onClick={() => paginate(number)}>
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
