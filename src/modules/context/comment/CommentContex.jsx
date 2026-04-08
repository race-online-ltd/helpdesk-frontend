import React, { createContext, useState } from "react";
const CommentUpdateContext = createContext();

const CommentUpdateProvider = ({ children }) => {
  const [commentUpdated, setCommentUpdated] = useState(false);

  return (
    <CommentUpdateContext.Provider
      value={{ commentUpdated, setCommentUpdated }}>
      {children}
    </CommentUpdateContext.Provider>
  );
};

export { CommentUpdateContext, CommentUpdateProvider };
