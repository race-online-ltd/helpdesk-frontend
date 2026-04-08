import React from "react";
import { plusIcon } from "../../../../data/data";
import { SearchComponent } from "../SearchComponent";

export const BranchHeader = ({ setActiveTab, onFilterChange, searchQuery }) => {
    return (
        <div className="card">
            <div className="row h-100 align-items-center">
                <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                    <SearchComponent
                        onFilterChange={onFilterChange}
                        searchQuery={searchQuery}
                    />
                </div>
                <div className="col-sm-12 col-md-9 col-lg-9 col-xl-9">
                    <div className="gap-3 d-flex align-items-center justify-content-end text-sm-end">
                        <button
                            className="custom-btn"
                            onClick={() => setActiveTab("addNewBranch")}
                        >
                            {plusIcon} New Branch
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
