import React from "react";
import { useNavigate } from "react-router-dom";
import { plusIcon } from "../../../../data/data";

import { SearchComponent } from "../SearchComponent";

export const SLAHeader = ({ setActiveTab, onFilterChange, searchQuery }) => {
  const navigate = useNavigate();

  const handleNewSLA = () => {
    setActiveTab("addNewSLA");
  };

  const handleRemainingSLA = () => {
    navigate("/admin/addremainingsla");
  };

  return (
    <div className="card p-3">
      <div className="row align-items-center">
        {/* Left - Search */}
        <div className="col-md-3">
          <SearchComponent onFilterChange={onFilterChange} searchQuery={searchQuery} />
        </div>

        {/* Right - Buttons (aligned in a single row) */}
        <div className="col-md-9 d-flex justify-content-end gap-3">
          <button className="custom-btn" onClick={handleNewSLA}>
            {plusIcon} New SLA
          </button>
          {/* <button className="custom-btn" onClick={handleRemainingSLA}>
            {plusIcon} Remaining SLA
          </button> */}
        </div>
      </div>
    </div>
  );
};
