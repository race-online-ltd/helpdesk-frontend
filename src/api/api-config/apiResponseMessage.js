import { toast } from "react-toastify";

export const errorMessage = (error) => {
  toast.error(error.response?.data?.message || "An unexpected error occurred", {
    position: "top-right",
  });
};

export const successMessage = (response) => {
  toast.success(response.message || "Operation Error !", {
    position: "top-right",
  });
};

export const warningMessage = (response) => {
  toast.warn(response.message || "Operation Error !", {
    position: "top-right",
    autoClose: 30000,
  });
};
