import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { SelectDropdown } from "../SelectDropdown";
import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
import { fetchUniqueCategory } from "../../../../api/api-client/settings/categoryApi";
import {
    storeTeamMapping,
    fetchTeamMappingById,
    updateTeamMapping,
} from "../../../../api/api-client/settings/teamMappingApi";
import {
    errorMessage,
    successMessage,
} from "../../../../api/api-config/apiResponseMessage";
import { fetchTeam } from "../../../../api/api-client/settings/teamApi";
// import { fetchSubCategoriesByCategoryId } from "../../../../api/api-client/settings/subCategoryApi";
import { fetchSubCategoriesByCategoryId } from "../../../../api/api-client/settings/teamMappingApi";

export const AddNewTeamMapping = ({ id, user }) => {
    const [companyOptions, setCompanyOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subcategoryOptions, setSubcategoryOptions] = useState([]);
    const [teamOptions, setTeamOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);

    const formik = useFormik({
        initialValues: {
            companyId: "",
            categoryId: "",
            subcategory_id: "",
            team_id: "",
            is_active: true,
        },
        onSubmit: (values, { resetForm }) => {
            setIsLoading(true);

            const payload = {
                company_id: parseInt(values.companyId),
                category_id: parseInt(values.categoryId),
                subcategory_id: parseInt(values.subcategory_id),
                team_id: parseInt(values.team_id),
                is_active: values.is_active,
            };

            const apiCall = id ? updateTeamMapping(id, payload) : storeTeamMapping(payload);

            apiCall
                .then((res) => {
                    successMessage(res);
                    if (!id) {
                        resetForm();
                        setEditData(null);
                    } else {
                        setIsEditing(false);
                    }
                })
                .catch(errorMessage)
                .finally(() => setIsLoading(false));
        },
    });

    // Fetch initial data on component mount
    useEffect(() => {
        setIsLoading(true);

        // Fetch companies
        const loadCompanies = fetchCompany({
            userType: user?.type,
            userId: user?.id,
        })
            .then((response) => {
                setCompanyOptions(
                    response.result.map((option) => ({
                        value: option.id,
                        label: option.company_name,
                    }))
                );
            })
            .catch((err) => {
                console.error("Error loading companies:", err);
                errorMessage("Failed to load companies");
            });

        // Fetch teams
        const loadTeams = fetchTeam()
            .then((res) => {
                if (res.status && res.data) {
                    setTeamOptions(
                        res.data.map((item) => ({
                            value: item.id,
                            label: item.team_name,
                        }))
                    );
                }
            })
            .catch((err) => {
                console.error("Error loading teams:", err);
                errorMessage("Failed to load teams");
            });

        Promise.all([loadCompanies, loadTeams])
            .finally(() => setIsLoading(false));
    }, [user?.type, user?.id]);

    // Fetch existing data when editing
    useEffect(() => {
        if (!id) return;

        setIsLoading(true);
        setIsEditing(true);

        fetchTeamMappingById(id)
            .then((res) => {
                if (res.status && res.data) {
                    const data = res.data;
                    setEditData(data);

                    // Set company options with current company
                    if (data.company_id) {
                        const companyOption = {
                            value: data.company_id,
                            label: data.company?.company_name,
                        };
                        setCompanyOptions((prev) => {
                            const exists = prev.some((opt) => opt.value === data.company_id);
                            return exists ? prev : [...prev, companyOption];
                        });
                    }

                    // Fetch categories for the selected company
                    if (data.company_id) {
                        fetchUniqueCategory(data.company_id)
                            .then((response) => {
                                const catOptions = response.data.map((option) => ({
                                    value: option.id,
                                    label: option.category_in_english,
                                }));
                                setCategoryOptions(catOptions);

                                // Now fetch subcategories after categories are loaded
                                if (data.category_id) {
                                    fetchSubCategoriesByCategoryId(data.category_id)
                                        .then((subRes) => {
                                            if (subRes.status && subRes.data) {
                                                setSubcategoryOptions(
                                                    subRes.data.map((item) => ({
                                                        value: item.id,
                                                        label: item.sub_category_in_english || item.sub_category_in_bangla,
                                                    }))
                                                );
                                            }
                                        })
                                        .catch((err) => {
                                            console.error("Error loading subcategories:", err);
                                            errorMessage("Failed to load subcategories");
                                        });
                                }
                            })
                            .catch((err) => {
                                console.error("Error loading categories:", err);
                                errorMessage("Failed to load categories");
                            });
                    }

                    // Set form values AFTER fetching options
                    setTimeout(() => {
                        formik.setValues({
                            companyId: data.company_id ? String(data.company_id) : "",
                            categoryId: data.category_id ? String(data.category_id) : "",
                            subcategory_id: data.subcategory_id ? String(data.subcategory_id) : "",
                            team_id: data.team_id ? String(data.team_id) : "",
                            is_active: data.is_active ?? true,
                        });
                    }, 500);
                }
            })
            .catch(errorMessage)
            .finally(() => {
                setIsLoading(false);
            });
    }, [id]);

    // Fetch categories when company changes (but not in edit mode)
    useEffect(() => {
        if (!formik.values.companyId || isEditing) {
            return;
        }

        fetchUniqueCategory(formik.values.companyId)
            .then((response) => {
                setCategoryOptions(
                    response.data.map((option) => ({
                        value: option.id,
                        label: option.category_in_english,
                    }))
                );
                setSubcategoryOptions([]);
                formik.setFieldValue("categoryId", "");
                formik.setFieldValue("subcategory_id", "");
            })
            .catch((error) => {
                console.error("Error loading categories:", error);
                errorMessage(error);
            });
    }, [formik.values.companyId, isEditing]);

    // Fetch subcategories when category changes (but not in edit mode)
    useEffect(() => {
        if (!formik.values.categoryId || isEditing) {
            return;
        }

        fetchSubCategoriesByCategoryId(formik.values.categoryId)
            .then((res) => {
                if (res.status && res.data) {
                    setSubcategoryOptions(
                        res.data.map((item) => ({
                            value: item.id,
                            label: item.sub_category_in_english || item.sub_category_in_bangla,
                        }))
                    );
                }
            })
            .catch((err) => {
                console.error("Error loading subcategories:", err);
                errorMessage("Failed to load subcategories");
            });
    }, [formik.values.categoryId, isEditing]);

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
                    <h6>{id ? "Update" : "Create"} Team Mapping</h6>
                    <i>Map companies, categories, and subcategories to teams for automatic ticket assignment.</i>
                </div>
            </div>

            <div className="col-md-6">
                <form onSubmit={formik.handleSubmit}>
                    {/* Company Selection */}
                    <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w">
                            Business Entity
                        </span>
                        <SelectDropdown
                            id="companyId"
                            options={companyOptions}
                            value={formik.values.companyId}
                            onChange={(value) =>
                                formik.setFieldValue("companyId", value)
                            }
                            disabled={isLoading || isEditing}
                            placeholder={
                                getSelectedLabel(
                                    formik.values.companyId,
                                    companyOptions
                                ) || "Select business entity"
                            }
                        />
                    </div>

                    {/* Category Selection */}
                    <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w">
                            Category
                        </span>
                        <SelectDropdown
                            id="categoryId"
                            options={categoryOptions}
                            value={formik.values.categoryId}
                            onChange={(value) =>
                                formik.setFieldValue("categoryId", value)
                            }
                            disabled={isLoading || !formik.values.companyId}
                            placeholder={
                                getSelectedLabel(
                                    formik.values.categoryId,
                                    categoryOptions
                                ) || "Select category"
                            }
                        />
                    </div>

                    {/* Subcategory Selection */}
                    <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w">
                            Subcategory
                        </span>
                        <SelectDropdown
                            id="subcategory_id"
                            options={subcategoryOptions}
                            value={formik.values.subcategory_id}
                            onChange={(value) =>
                                formik.setFieldValue("subcategory_id", value)
                            }
                            disabled={isLoading || !formik.values.categoryId}
                            placeholder={
                                getSelectedLabel(
                                    formik.values.subcategory_id,
                                    subcategoryOptions
                                ) || "Select subcategory"
                            }
                        />
                    </div>

                    {/* Team Selection */}
                    <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w">
                            Team
                        </span>
                        <SelectDropdown
                            id="team_id"
                            options={teamOptions}
                            value={formik.values.team_id}
                            onChange={(value) =>
                                formik.setFieldValue("team_id", value)
                            }
                            disabled={isLoading}
                            placeholder={
                                getSelectedLabel(
                                    formik.values.team_id,
                                    teamOptions
                                ) || "Select team"
                            }
                        />
                    </div>

                    {/* Status Selection */}
                    <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w">
                            Status
                        </span>
                        <select
                            id="is_active"
                            className="form-select"
                            value={formik.values.is_active ? "active" : "inactive"}
                            onChange={(e) =>
                                formik.setFieldValue("is_active", e.target.value === "active")
                            }
                            disabled={isLoading}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Submit Button */}
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