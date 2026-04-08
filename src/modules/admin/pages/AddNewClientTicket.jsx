import React from "react";
import Select from "react-select";
import { SelectDropdown } from "../components/SelectDropdown";

export const AddNewClientTicket = ({ id }) => {
  const options = [
    {
      value: "chocolate chocolate chocolate",
      label: "Earth Telecommunication Ltd",
    },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "30px", // control the height here
      height: "30px", // control the height here
      width: "100%", // control the width here
      // minWidth: "290px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "30px", // control the height here
      padding: "0 6px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "30px", // control the height here
    }),
  };
  return (
    <section>
      <div className='container-fluid'>
        <div className='row'>
          {/* {"organization Id =" + id} */}
          <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
            <div className='alert alert-secondary p-2' role='alert'>
              <h6>Create New Client</h6>
              <span>
                <i>Please input the required information.</i>
              </span>
            </div>
          </div>
          <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
            <div className='row'>
              <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
                <div className='input-group mb-3'>
                  <span className='input-group-text w-25' id='basic-addon1'>
                    Comapny
                  </span>

                  <Select
                    options={options}
                    placeholder={"Select"}
                    className='form-control'
                    styles={customStyles}
                  />
                </div>
              </div>
              <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
                <div className='input-group mb-3'>
                  <span className='input-group-text w-25' id='basic-addon1'>
                    Client
                  </span>

                  <Select
                    options={options}
                    placeholder={"Select"}
                    className='form-control'
                    styles={customStyles}
                  />
                </div>
              </div>
              <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
                <div className='input-group mb-3'>
                  <span className='input-group-text w-25' id='basic-addon1'>
                    Email
                  </span>
                  <input
                    type='email'
                    className='form-control'
                    placeholder='Email'
                    aria-label='Username'
                    aria-describedby='basic-addon1'
                  />
                </div>
              </div>

              <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
                <div className='input-group mb-3'>
                  <span className='input-group-text w-25' id='basic-addon1'>
                    Phone
                  </span>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='+880'
                    aria-label='Username'
                    aria-describedby='basic-addon1'
                  />
                </div>
              </div>
              <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
                <div class='input-group mb-3'>
                  <span class='input-group-text w-25' id='basic-addon1'>
                    Username
                  </span>
                  <input
                    type='text'
                    class='form-control'
                    placeholder='E00001'
                    aria-label='Username'
                    aria-describedby='basic-addon1'
                    disabled
                  />
                </div>
              </div>
              <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
                <div class='input-group mb-3'>
                  <span class='input-group-text w-25' id='basic-addon1'>
                    Password
                  </span>
                  <input
                    type='password'
                    class='form-control'
                    placeholder='Password'
                    value={"helpdesk123"}
                    aria-label='Username'
                    aria-describedby='basic-addon1'
                    disabled
                  />
                </div>
              </div>
              <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
                <div class='input-group mb-3'>
                  <span class='input-group-text w-25' id='basic-addon1'>
                    Role
                  </span>

                  <SelectDropdown
                    id='default-role'
                    placeholder='Default role'
                    options={options}
                    value={null}
                    onChange={null}
                    disabled={true}
                  />
                </div>
              </div>
              <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
                <div className='input-group mb-3'>
                  <span className='input-group-text w-25' id='addressTextArea'>
                    Notes
                  </span>
                  <textarea
                    className='form-control'
                    placeholder='Notes'
                    id='addressTextArea'
                    rows='3'></textarea>
                </div>
              </div>
              <div className='text-end'>
                <button
                  type='submit'
                  className='custom-btn me-3'
                  onClick={() => window.history.back()}>
                  Cancel
                </button>
                <button type='submit' className='custom-btn'>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
