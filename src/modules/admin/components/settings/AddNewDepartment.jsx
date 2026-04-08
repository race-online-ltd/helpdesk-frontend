import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { departmentValidationSchema } from '../../../../schema/ValidationSchemas';
import {
  fetchDepartmentById,
  store,
  update,
} from '../../../../api/api-client/settings/departmentApi';

export const AddNewDepartment = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      departmentName: '',
    },
    validationSchema: departmentValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      const apiCall = id ? update(id, values) : store(values);
      apiCall
        .then((response) => {
          resetForm();
          toast.success(response.message, {
            position: 'top-right',
          });
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || 'Error saving company data', {
            position: 'top-right',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchDepartmentById(id)
        .then((response) => {
          formik.setValues({
            departmentName: response.result.department_name || '',
          });
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.response?.data?.message || 'Error fetching company data', {
            position: 'top-right',
          });
        });
    }
  }, [id]);
  return (
    <div className="row">
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div className="alert alert-secondary p-2" role="alert">
          <h6>{id ? 'Update' : 'Create'} Department</h6>
          <span>
            <i>Please input the required information.</i>
          </span>
        </div>
      </div>
      <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="input-group mb-3">
                <span className="input-group-text w-25" id="basic-addon1">
                  Department
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="departmentName"
                  placeholder="Department name"
                  value={formik.values.departmentName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.departmentName && formik.errors.departmentName ? (
                <div className="text-danger">{formik.errors.departmentName}</div>
              ) : null}
            </div>

            <div className="text-end">
              <button type="submit" className="custom-btn">
                {isLoading ? (id ? 'Updating...' : 'Saving...') : id ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
