import React from "react";
import { baseURL } from "../../../api/api-config/config";

export const PopUp = ({ imgLink, onClose }) => {
  const attachtment = imgLink.split(",");

  const handleCommentAttachment = (item) => {
    const fileExtension = item.split(".").pop().toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
      fileExtension
    );
    const fileUrl = `${baseURL}${encodeURIComponent(item)}`;

    if (isImage) {
      window.open(fileUrl, "_blank");
    } else {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = item;
      link.target = "blank";
      link.click();
      link.remove();
    }
  };
  return (
    <div className='popup-overlay animate__animated animate__fadeIn'>
      <div className='popup-content'>
        <button className='close-button' onClick={onClose}>
          X
        </button>
        <ul className='py-5 px-3'>
          {attachtment &&
            attachtment.map((item) => (
              <li
                className='mb-3 '
                style={{
                  textDecoration: "underline",
                  color: "#0a5dc2",
                }}>
                <button
                  className='bg-transparent '
                  type='button'
                  onClick={() => handleCommentAttachment(item)}>
                  <i className='bi bi-link-45deg'></i>
                  {item.split("/").pop()}
                </button>
              </li>
            ))}
        </ul>
        {/* <img src={imageURL} alt='image' width='100%' height='auto' /> */}
      </div>
    </div>
  );
};
