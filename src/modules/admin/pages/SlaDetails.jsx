import React from "react";
import { useParams } from "react-router-dom";

export const SlaDetails = () => {
  const { id } = useParams();
  return (
    <div className='row'>
      <div className='col'>
        <h5>SLA Name+ {id}</h5>
      </div>
    </div>
  );
};
