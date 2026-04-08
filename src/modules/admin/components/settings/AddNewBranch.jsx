import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { branchValidationSchema } from "../../../../schema/ValidationSchemas";
import { SelectDropdown } from "./../SelectDropdown";
import { userContext } from "../../../context/UserContext";
import {
    errorMessage,
    successMessage,
} from "../../../../api/api-config/apiResponseMessage";
import {
    store,
    fetchBranchById,
    update,
} from "../../../../api/api-client/settings/branchApi";
import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
import { raceClients } from "../../../../api/api-client/prismerpApi";

export const AddNewBranch = ({ id }) => {
    const { user } = useContext(userContext);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [clientOptions, setClientOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const fetchCompanyOptions = () =>
            fetchCompany({ userType: user?.type, userId: user?.id }).then(
                (response) =>
                    setCompanyOptions(
                        response.result.map((option) => ({
                            value: option.id,
                            label: option.company_name,
                        }))
                    )
            );

        const fetchRaceClientOptions = () => {
            raceClients().then((response) =>
                setClientOptions(
                    response.map((option) => ({
                        value: option.id,
                        label: option.name,
                    }))
                )
            );
        };

        Promise.all([fetchCompanyOptions(), fetchRaceClientOptions()])
            .catch(errorMessage)
            .finally(() => setIsLoading(false));
    }, []);

    const formik = useFormik({
        initialValues: {
            businessEntity: 5,
            client: "",
            branchName: "",
            mobile1: "",
            mobile2: "",
            email1: "",
            email2: "",
            serviceAddress: "",
        },
        validationSchema: branchValidationSchema,
        onSubmit: (values, { resetForm }) => {
            setIsLoading(true);
            const apiCall = id ? update(id, values) : store(values);
            apiCall
                .then((response) => {
                    successMessage(response);
                    resetForm();
                })
                .catch(errorMessage)
                .finally(() => setIsLoading(false));
        },
    });

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetchBranchById(id)
                .then((response) => {
                    if (response.status && response.data) {
                        formik.setValues({
                            businessEntity:
                                response.data.business_entity_id || "",
                            client: response.data.vendor_client_id || "",
                            branchName: response.data.branch_name || "",
                            mobile1: response.data.mobile1 || "",
                            mobile2: response.data.mobile2 || "",
                            email1: response.data.email1 || "",
                            email2: response.data.email2 || "",
                            serviceAddress: response.data.service_address || "",
                        });
                    }
                })
                .catch(errorMessage)
                .finally(() => setIsLoading(false));
        }
    }, [id]);

    return (
        <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="alert alert-secondary p-2" role="alert">
                    <h6>{id ? "Update" : "Create"} Branch</h6>
                    <span>
                        <i>Please input the required information.</i>
                    </span>
                </div>
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <form onSubmit={formik.handleSubmit}>
                    <div className="row">
                        {/* Business Entity */}
                        <div className="col-12">
                            <div className="input-group mb-3">
                                <span className="input-group-text w-25 label-cat-w">
                                    Business Entity
                                </span>
                                <SelectDropdown
                                    id="businessEntity"
                                    placeholder="Business entity"
                                    options={companyOptions}
                                    value={formik.values.businessEntity}
                                    onChange={(value) =>
                                        formik.setFieldValue(
                                            "businessEntity",
                                            value
                                        )
                                    }
                                    disabled={true}
                                />
                            </div>
                            {formik.touched.businessEntity &&
                                formik.errors.businessEntity && (
                                    <div className="text-danger">
                                        {formik.errors.businessEntity}
                                    </div>
                                )}
                        </div>

                        {/* Client */}
                        <div className="col-12">
                            <div className="input-group mb-3">
                                <span className="input-group-text w-25 label-cat-w">
                                    Client
                                </span>
                                <SelectDropdown
                                    id="client"
                                    placeholder="Select client"
                                    options={clientOptions}
                                    value={formik.values.client}
                                    onChange={(value) =>
                                        formik.setFieldValue("client", value)
                                    }
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Branch Name */}
                        <div className="col-12">
                            <div className="input-group mb-3">
                                <span className="input-group-text w-25 label-cat-w">
                                    Branch Name
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="branchName"
                                    placeholder="Enter branch name"
                                    value={formik.values.branchName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>

                        {/* Mobile 1 */}
                        <div className="col-12">
                            <div className="input-group mb-3">
                                <span className="input-group-text w-25 label-cat-w">
                                    Mobile 1
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="mobile1"
                                    placeholder="Enter mobile number 1"
                                    value={formik.values.mobile1}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>

                        {/* Mobile 2 */}
                        <div className="col-12">
                            <div className="input-group mb-3">
                                <span className="input-group-text w-25 label-cat-w">
                                    Mobile 2
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="mobile2"
                                    placeholder="Enter mobile number 2"
                                    value={formik.values.mobile2}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>

                        {/* Email 1 */}
                        <div className="col-12">
                            <div className="input-group mb-3">
                                <span className="input-group-text w-25 label-cat-w">
                                    Email 1
                                </span>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email1"
                                    placeholder="Enter email 1"
                                    value={formik.values.email1}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>

                        {/* Email 2 */}
                        <div className="col-12">
                            <div className="input-group mb-3">
                                <span className="input-group-text w-25 label-cat-w">
                                    Email 2
                                </span>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email2"
                                    placeholder="Enter email 2"
                                    value={formik.values.email2}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>

                        {/* Service Address */}
                        <div className="col-12">
                            <div className="input-group mb-3">
                                <span className="input-group-text w-25 label-cat-w">
                                    Service Address
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="serviceAddress"
                                    placeholder="Enter service address"
                                    value={formik.values.serviceAddress}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="text-end">
                            <button type="submit" className="custom-btn">
                                {isLoading
                                    ? id
                                        ? "Updating..."
                                        : "Saving..."
                                    : id
                                    ? "Update"
                                    : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
