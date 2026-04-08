// import React, { useContext, useEffect, useState } from "react";
// import { useFormik } from "formik";
// import { SelectDropdown } from "../SelectDropdown";
// import { userContext } from "../../../context/UserContext";
// import {
//     errorMessage,
//     successMessage,
// } from "../../../../api/api-config/apiResponseMessage";

// import {
//     store,
//     fetchClientAggregatorMappingById,
//     update,
// } from "../../../../api/api-client/settings/clientAggregatorMapping";

// import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
// import { raceClients } from "../../../../api/api-client/prismerpApi";
// import { fetchAggregator } from "../../../../api/api-client/settings/aggregator";
// import { fetchWebAppPartnerEntity, fetchRaceMaximEntity } from "../../../../api/api-client/ticketApi";

// export const AddNewAggregator = ({ id }) => {
//     const { user } = useContext(userContext);

//     const [companyOptions, setCompanyOptions] = useState([]);
//     const [clientOptions, setClientOptions] = useState([]);
//     const [aggregatorOptions, setAggregatorOptions] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);

    
//     useEffect(() => {
//         setIsLoading(true);

//         // const loadCompanies = () =>
//         //     fetchCompany({ userType: user?.type, userId: user?.id }).then(
//         //         (res) =>
//         //             setCompanyOptions(
//         //                 res.result.map((item) => ({
//         //                     value: item.id,
//         //                     label: item.company_name,
//         //                 }))
//         //             )
//         //     );


//         const loadCompanies = () =>
//                 fetchCompany({ userType: user?.type, userId: user?.id }).then((res) =>
//                     setCompanyOptions(
//                         res.result
//                             .filter(item => [8, 11].includes(item.id))
//                             .map((item) => ({
//                                 value: item.id,
//                                 label: item.company_name,
//                             }))
//                     )
//                 );


//         const loadClients = () =>
//             fetchWebAppPartnerEntity().then((res) =>
//                 setClientOptions(
//                     res.map((item) => ({
//                         value: item.entity_id,
//                         label: item.source_entity,
//                     }))
//                 )
//             );

//         const loadAggregators = () =>
//             fetchAggregator().then((res) =>
//                 setAggregatorOptions(
//                     res.data.map((item) => ({
//                         value: item.id,
//                         label: item.name,
//                     }))
//                 )
//             );

//         Promise.all([loadCompanies(), loadClients(), loadAggregators()])
//             .catch(errorMessage)
//             .finally(() => setIsLoading(false));
//     }, []);

    
//     const formik = useFormik({
//         initialValues: {
//             businessEntity: 8,
//             client: "",
//             aggregator: "",
//         },
//         onSubmit: (values, { resetForm }) => {
//             setIsLoading(true);

//             const payload = {
//                 business_entity_id: values.businessEntity,
//                 client_id: values.client,
//                 aggregator_id: values.aggregator,
//             };

//             const apiCall = id ? update(id, payload) : store(payload);

//             apiCall
//                 .then((res) => {
//                     successMessage(res);
//                     if (!id) resetForm();
//                 })
//                 .catch(errorMessage)
//                 .finally(() => setIsLoading(false));
//         },
//     });

    
//     useEffect(() => {
//         if (!id) return;

//         setIsLoading(true);
//         setIsEditing(true);
//         fetchClientAggregatorMappingById(id)
//             .then((res) => {
//                 if (res.status && res.data) {
                    
//                     formik.setValues({
//                         businessEntity: res.data.business_entity_id ? String(res.data.business_entity_id) : "",
//                         client: res.data.client_id ? String(res.data.client_id) : "",
//                         aggregator: res.data.aggregator_id ? String(res.data.aggregator_id) : "",
//                     });
//                 }
//             })
//             .catch(error => {
//                 errorMessage(error);
//                 console.error('Error fetching mapping:', error);
//             })
//             .finally(() => {
//                 setIsLoading(false);
//                 setIsEditing(false);
//             });
//     }, [id]);

//     // Get the selected labels for display
//     const getSelectedLabel = (value, options) => {
//         if (!value || !options.length) return "";
//         const option = options.find(opt => String(opt.value) === String(value));
//         return option ? option.label : "";
//     };

//     return (
//         <div className="row">
//             <div className="col-12">
//                 <div className="alert alert-secondary p-2">
//                     <h6>{id ? "Update" : "Create"} Aggregator Mapping</h6>
//                     <i>Please input the required information.</i>
//                 </div>
//             </div>

//             <div className="col-md-6">
//                 <form onSubmit={formik.handleSubmit}>
//                     {/* Business Entity */}
//                     <div className="input-group mb-3">
//                         <span className="input-group-text w-25 label-cat-w">
//                             Business Entity
//                         </span>
//                         <SelectDropdown
//                             id="businessEntity"
//                             options={companyOptions}
//                             value={formik.values.businessEntity}
//                             onChange={(value) =>
//                                 formik.setFieldValue("businessEntity", value)
//                             }
//                             // disabled={isLoading || isEditing}
//                             disabled={false}
//                             placeholder={getSelectedLabel(formik.values.businessEntity, companyOptions) || "Select business entity"}
//                         />
//                         {isEditing && formik.values.businessEntity && (
//                             <div className="form-text ms-2">
//                                 Selected: {getSelectedLabel(formik.values.businessEntity, companyOptions)}
//                             </div>
//                         )}
//                     </div>

//                     {/* Client */}
//                     <div className="input-group mb-3">
//                         <span className="input-group-text w-25 label-cat-w">
//                             Client
//                         </span>
//                         <SelectDropdown
//                             id="client"
//                             placeholder={getSelectedLabel(formik.values.client, clientOptions) || "Select client"}
//                             options={clientOptions}
//                             value={formik.values.client}
//                             onChange={(value) =>
//                                 formik.setFieldValue("client", value)
//                             }
//                             disabled={isLoading}
//                         />
//                         {isEditing && formik.values.client && (
//                             <div className="form-text ms-2">
//                                 Selected: {getSelectedLabel(formik.values.client, clientOptions)}
//                             </div>
//                         )}
//                     </div>

//                     {/* Aggregator */}
//                     <div className="input-group mb-3">
//                         <span className="input-group-text w-25 label-cat-w">
//                             Aggregator
//                         </span>
//                         <SelectDropdown
//                             id="aggregator"
//                             placeholder={getSelectedLabel(formik.values.aggregator, aggregatorOptions) || "Select aggregator"}
//                             options={aggregatorOptions}
//                             value={formik.values.aggregator}
//                             onChange={(value) =>
//                                 formik.setFieldValue("aggregator", value)
//                             }
//                             disabled={isLoading}
//                         />
//                         {isEditing && formik.values.aggregator && (
//                             <div className="form-text ms-2">
//                                 Selected: {getSelectedLabel(formik.values.aggregator, aggregatorOptions)}
//                             </div>
//                         )}
//                     </div>

//                     {/* Submit */}
//                     <div className="text-end">
//                         <button 
//                             type="submit" 
//                             className="custom-btn"
//                             disabled={isLoading}
//                         >
//                             {isLoading
//                                 ? id
//                                     ? "Updating..."
//                                     : "Saving..."
//                                 : id
//                                 ? "Update"
//                                 : "Save"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };





import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { SelectDropdown } from "../SelectDropdown";
import { userContext } from "../../../context/UserContext";
import {
    errorMessage,
    successMessage,
} from "../../../../api/api-config/apiResponseMessage";

import {
    store,
    fetchClientAggregatorMappingById,
    update,
} from "../../../../api/api-client/settings/clientAggregatorMapping";

import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
import { fetchAggregator } from "../../../../api/api-client/settings/aggregator";
import {
    fetchWebAppPartnerEntity,
    fetchRaceMaximEntity,
} from "../../../../api/api-client/ticketApi";

export const AddNewAggregator = ({ id }) => {
    const { user } = useContext(userContext);

    const [companyOptions, setCompanyOptions] = useState([]);
    const [clientOptions, setClientOptions] = useState([]);
    const [aggregatorOptions, setAggregatorOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    
    useEffect(() => {
        setIsLoading(true);

        const loadCompanies = () =>
            fetchCompany({ userType: user?.type, userId: user?.id }).then(
                (res) =>
                    setCompanyOptions(
                        res.result
                            .filter((item) => [8, 11].includes(item.id))
                            .map((item) => ({
                                value: item.id,
                                label: item.company_name,
                            }))
                    )
            );

        const loadAggregators = () =>
            fetchAggregator().then((res) =>
                setAggregatorOptions(
                    res.data.map((item) => ({
                        value: item.id,
                        label: item.name,
                    }))
                )
            );

        Promise.all([loadCompanies(), loadAggregators()])
            .catch(errorMessage)
            .finally(() => setIsLoading(false));
    }, [user?.id, user?.type]);

    
    const formik = useFormik({
        initialValues: {
            businessEntity: "",
            client: "",
            aggregator: "",
        },
        onSubmit: (values, { resetForm }) => {
            setIsLoading(true);

            const payload = {
                business_entity_id: values.businessEntity,
                client_id: values.client,
                aggregator_id: values.aggregator,
            };

            const apiCall = id ? update(id, payload) : store(payload);

            apiCall
                .then((res) => {
                    successMessage(res);
                    if (!id) resetForm();
                })
                .catch(errorMessage)
                .finally(() => setIsLoading(false));
        },
    });

    
    useEffect(() => {
        const businessEntity = formik.values.businessEntity;

        if (!businessEntity) return;

        
        setClientOptions([]);
        formik.setFieldValue("client", "");

        
        if (String(businessEntity) === "8") {
            fetchWebAppPartnerEntity()
                .then((res) =>
                    setClientOptions(
                        res.map((item) => ({
                            value: item.entity_id,
                            label: item.source_entity,
                        }))
                    )
                )
                .catch(errorMessage);
        }

        
        if (String(businessEntity) === "11") {
            fetchRaceMaximEntity()
                .then((res) =>
                    setClientOptions(
                        res.map((item) => ({
                            value: item.entity_id,
                            label: item.source_entity,
                        }))
                    )
                )
                .catch(errorMessage);
        }
    }, [formik.values.businessEntity]);

    
    useEffect(() => {
        if (!id) return;

        setIsLoading(true);
        setIsEditing(true);

        fetchClientAggregatorMappingById(id)
            .then((res) => {
                if (res.status && res.data) {
                    formik.setValues({
                        businessEntity: res.data.business_entity_id
                            ? String(res.data.business_entity_id)
                            : "",
                        client: res.data.client_id
                            ? String(res.data.client_id)
                            : "",
                        aggregator: res.data.aggregator_id
                            ? String(res.data.aggregator_id)
                            : "",
                    });
                }
            })
            .catch(errorMessage)
            .finally(() => {
                setIsLoading(false);
                setIsEditing(false);
            });
    }, [id]);

    const getSelectedLabel = (value, options) => {
        if (!value || !options.length) return "";
        const option = options.find(
            (opt) => String(opt.value) === String(value)
        );
        return option ? option.label : "";
    };

    return (
        <div className="row">
            <div className="col-12">
                <div className="alert alert-secondary p-2">
                    <h6>{id ? "Update" : "Create"} Aggregator Mapping</h6>
                    <i>Please input the required information.</i>
                </div>
            </div>

            <div className="col-md-6">
                <form onSubmit={formik.handleSubmit}>
                    
                    <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w">
                            Business Entity
                        </span>
                        <SelectDropdown
                            id="businessEntity"
                            options={companyOptions}
                            value={formik.values.businessEntity}
                            onChange={(value) =>
                                formik.setFieldValue("businessEntity", value)
                            }
                            disabled={false}
                            placeholder={
                                getSelectedLabel(
                                    formik.values.businessEntity,
                                    companyOptions
                                ) || "Select business entity"
                            }
                        />
                    </div>

                   
                    <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w">
                            Client
                        </span>
                        <SelectDropdown
                            id="client"
                            options={clientOptions}
                            value={formik.values.client}
                            onChange={(value) =>
                                formik.setFieldValue("client", value)
                            }
                            disabled={isLoading || !clientOptions.length}
                            placeholder={
                                getSelectedLabel(
                                    formik.values.client,
                                    clientOptions
                                ) || "Select client"
                            }
                        />
                    </div>

                    
                    <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w">
                            Aggregator
                        </span>
                        <SelectDropdown
                            id="aggregator"
                            options={aggregatorOptions}
                            value={formik.values.aggregator}
                            onChange={(value) =>
                                formik.setFieldValue("aggregator", value)
                            }
                            disabled={isLoading}
                            placeholder={
                                getSelectedLabel(
                                    formik.values.aggregator,
                                    aggregatorOptions
                                ) || "Select aggregator"
                            }
                        />
                    </div>

                    
                    <div className="text-end">
                        <button
                            type="submit"
                            className="custom-btn"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? id
                                    ? "Updating..."
                                    : "Saving..."
                                : id
                                ? "Update"
                                : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
