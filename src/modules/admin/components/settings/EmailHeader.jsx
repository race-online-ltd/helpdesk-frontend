import React from "react";
import { plusIcon } from "../../../../data/data";
import { SearchComponent } from "../SearchComponent";

export const EmailHeader = ({ setActiveTab, onFilterChange, searchQuery }) => {
  return (
    <div className='card'>
      <div className='row h-100 align-items-center'>
        <div className='col-sm-12 col-md-3 col-lg-3 col-xl-3'>
          <SearchComponent
            onFilterChange={onFilterChange}
            searchQuery={searchQuery}
          />
        </div>
        <div className='col-sm-12 col-md-9 col-lg-9 col-xl-9'>
          <div className='row d-flex align-items-center text-sm-end'>
            <div className='col-6 col-sm-8'>
              <button
                className='custom-btn'
                onClick={() => setActiveTab("addNewEmail")}>
                {plusIcon} New Email Template
              </button>
            </div>
            <div className='col-6 col-sm-4'>
              <button
                className='custom-btn'
                onClick={() => setActiveTab("addNewNotification")}>
                {plusIcon} Notification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
