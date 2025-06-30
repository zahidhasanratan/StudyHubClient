import React, { useEffect } from "react";

export const PageWithTitle = ({ title, children }) => {
  useEffect(() => {
    document.title = title || "GroupStudyHub";
  }, [title]);

  return children;
};
