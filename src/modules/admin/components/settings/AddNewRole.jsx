import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchSidebarItems,
  fetchPageInfoByName,
  store,
} from "../../../../api/api-client/settings/roleApi";
import {
  errorMessage,
  successMessage,
} from "../../../../api/api-config/apiResponseMessage";

// Validation schema for the form
const validationSchema = Yup.object({
  roleName: Yup.string().required("Role name is required"),
  permissions: Yup.array().of(Yup.string()),
});

export const AddNewRole = () => {
  const [permissions, setPermissions] = useState([]);
  const [pageDetails, setPageDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const options = [
    {
      value: 1,
      label: "Client",
    },
    { value: 2, label: "Agent" },
    { value: 3, label: "Admin" },
    { value: 4, label: "Customer" },
  ];
  useEffect(() => {
    setIsLoading(true);

    const fetchSidebarItemOptions = () => {
      fetchSidebarItems().then((response) => {
        if (response.status && Array.isArray(response.data)) {
          setPermissions(
            response.data.map((item) => ({
              id: item.id,
              name: item.name,
              checked: true,
            }))
          );
        }
      });
    };

    Promise.all([fetchSidebarItemOptions()])
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
        setPermissions([]);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      roleName: "",
      permissions: [],
      pagePermissions: [],
      markAsDefaultRole: false,
      defaultRole: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const data = {
        roleName: values.roleName,
        permissions: values.permissions,
        pagePermissions: values.pagePermissions,
        defaultRole: values.markAsDefaultRole ? values.defaultRole : null,
      };
      store(data)
        .then((response) => {
          successMessage(response);
          resetForm();
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
          resetForm();
        });
    },
  });

  // Handle permission change and fetch page details
  const handlePermissionChange = async (e, itemId) => {
    const { checked } = e.target;
    const updatedPermissions = checked
      ? [...formik.values.permissions, itemId]
      : formik.values.permissions.filter((id) => id !== itemId);

    formik.setFieldValue("permissions", updatedPermissions);

    // Fetch page info if the permission is checked
    if (checked) {
      try {
        const pageInfo = await fetchPageInfoByName(itemId);

        setPageDetails((prev) => ({ ...prev, [itemId]: pageInfo.data }));

        // Add all pages from this permission to the pagePermissions array
        const pageIds = pageInfo.data.map((page) => page.id);
        const updatedPagePermissions = [
          ...formik.values.pagePermissions,
          ...pageIds,
        ];

        formik.setFieldValue("pagePermissions", updatedPagePermissions);
      } catch (error) {
        console.error("Error fetching page info:", error);
      }
    } else {
      // Remove page details if permission is unchecked
      setPageDetails((prev) => {
        const newDetails = { ...prev };
        delete newDetails[itemId];
        return newDetails;
      });

      // Remove the related pages from the pagePermissions array
      const pageIdsToRemove = pageDetails[itemId]?.map((page) => page.id) || [];
      const updatedPagePermissions = formik.values.pagePermissions.filter(
        (id) => !pageIdsToRemove.includes(id)
      );

      formik.setFieldValue("pagePermissions", updatedPagePermissions);
    }
  };

  const handleMarkAsDefaultRoleChange = (event) => {
    const { checked } = event.target;
    formik.setFieldValue("markAsDefaultRole", checked);
    if (!checked) {
      formik.setFieldValue("defaultRole", "");
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='row'>
        <div className='col-12'>
          <div className='alert alert-secondary p-2' role='alert'>
            <h6>Create New Role</h6>
            <span>
              <i>Please input the required information.</i>
            </span>
          </div>
        </div>
        {/* <div className='col-4'>
          <div className='input-group mb-3'>
            <span className='input-group-text'>Role Name</span>
            <input
              type='text'
              className='form-control'
              placeholder='Role name'
              name='roleName'
              value={formik.values.roleName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.roleName && formik.errors.roleName ? (
            <div className='text-danger'>{formik.errors.roleName}</div>
          ) : null}
        </div> */}

        <div className='col-12'>
          <div className='row'>
            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
              <div className='input-group mb-3'>
                <span className='input-group-text w-25' id='basic-addon1'>
                  Role Name
                </span>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Role name'
                  name='roleName'
                  value={formik.values.roleName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.roleName && formik.errors.roleName ? (
                <div className='text-danger'>{formik.errors.roleName}</div>
              ) : null}
            </div>

            <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2 mt-sm-2'>
              <div className='float-end'>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    id='mark-as-default-role'
                    name='markAsDefaultRole'
                    defaultChecked={formik.values.markAsDefaultRole}
                    onChange={handleMarkAsDefaultRoleChange}
                  />
                  <label
                    className='form-check-label'
                    htmlFor='mark-as-default-role'>
                    Default
                  </label>
                </div>
              </div>
            </div>

            <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4'>
              <div className='mb-3'>
                <select
                  className='form-select form-control'
                  id='default-role'
                  value={formik.values.defaultRole}
                  onChange={(e) =>
                    formik.setFieldValue("defaultRole", e.target.value)
                  } // Correctly setting defaultRole
                  disabled={!formik.values.markAsDefaultRole}>
                  <option value=''>Select</option>
                  {options.map((option) => (
                    <option key={option.label} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className='col-12'>
          <div className='border rounded'>
            <h6 className='p-2 bg-light border-bottom'>Permissions</h6>
            <div className='p-3'>
              {/* Common scrollable container for both Permissions and Pages */}
              <div
                className='role-wrapper'
                style={{ overflow: "auto", whiteSpace: "nowrap" }}>
                {/* Permissions List */}
                <ul
                  className='role-permissions list-unstyled d-flex p-0'
                  style={{ display: "inline-block", minWidth: "100%" }}>
                  {permissions.map((item) => (
                    <li
                      key={item.id}
                      className='col-12 col-sm-4 col-md-3 col-lg-2 m-0'
                      style={{ display: "inline-block", minWidth: "150px" }}>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          value={item.name}
                          id={`permission-${item.id}`}
                          checked={formik.values.permissions.includes(item.id)}
                          onChange={(e) => handlePermissionChange(e, item.id)}
                        />
                        <label
                          className='form-check-label'
                          htmlFor={`permission-${item.id}`}>
                          <strong>{item.name}</strong>
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Permission-related Pages */}
                <div
                  className='role-pages-wrapper'
                  style={{ display: "inline-block", minWidth: "100%" }}>
                  <div className='d-flex' style={{ minWidth: "100%" }}>
                    {permissions.map((item) => {
                      const permissionId = item.id;

                      return (
                        <div
                          className='col-12 col-sm-4 col-md-3 col-lg-2 mb-3 '
                          key={permissionId}
                          style={{
                            display: "inline-block",
                            minWidth: "150px",
                          }}>
                          {formik.values.permissions.includes(permissionId) ? (
                            <>
                              {/* <h6 className='mt-3'>{item.name} Pages</h6> */}
                              <div style={{ whiteSpace: "nowrap" }}>
                                {" "}
                                {/* Prevent wrapping of page details */}
                                {pageDetails[permissionId]?.map((page) => (
                                  <div
                                    className='d-flex ps-3'
                                    key={page.id}
                                    style={{ whiteSpace: "nowrap" }}>
                                    <div>
                                      <input
                                        type='checkbox'
                                        className='form-check-input'
                                        value={page.id}
                                        id={`page-${page.id}`}
                                        checked={formik.values.pagePermissions.includes(
                                          page.id
                                        )}
                                        onChange={(e) => {
                                          const isChecked = e.target.checked;
                                          const updatedPagePermissions =
                                            isChecked
                                              ? [
                                                  ...formik.values
                                                    .pagePermissions,
                                                  page.id,
                                                ]
                                              : formik.values.pagePermissions.filter(
                                                  (id) => id !== page.id
                                                );
                                          formik.setFieldValue(
                                            "pagePermissions",
                                            updatedPagePermissions
                                          );
                                        }}
                                      />
                                    </div>
                                    <p
                                      className='ms-2'
                                      style={{ display: "inline-block" }}>
                                      {page.name}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : (
                            <div
                              className='empty-placeholder'
                              style={{ minHeight: "50px" }}></div> // Leave space empty if permission is not selected
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='text-end mt-3'>
          <button type='submit' className='custom-btn'>
            Save
          </button>
        </div>
      </div>
    </form>
  );
};
