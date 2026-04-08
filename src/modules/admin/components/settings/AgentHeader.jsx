import React from "react";
import { plusIcon } from "../../../../data/data";
import { SearchComponent } from "../SearchComponent";

export const AgentHeader = ({ setActiveTab, onFilterChange, searchQuery }) => {
  return (
    <div className='card'>
      <div className='row h-100 align-items-center'>
        <div className='col-sm-12 col-md-3 col-lg-3 col-xl-3'>
          <SearchComponent
            onFilterChange={onFilterChange}
            searchQuery={searchQuery}
          />
        </div>
        <div className='col-sm-12 col-md-9 col-lg-9 col-xl-9 text-end'>
          <button
            className='custom-btn'
            onClick={() => setActiveTab("addNewAgent")}>
            {plusIcon} New Agent
          </button>
        </div>
      </div>
    </div>
  );
};
