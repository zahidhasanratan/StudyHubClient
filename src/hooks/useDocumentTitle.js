import { useEffect } from "react";

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title || "GroupStudyHub";
  }, [title]);
};

export default useDocumentTitle;
