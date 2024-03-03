import { useEffect, useState, useMemo } from "react";
import { ILine } from "../redux/models/input/inputInterfaces";
import { useStoreActions, useStoreState } from "../redux/store";
import { ICase } from "../redux/models/cases/casesInterfaces";
import _ from "lodash";
import { uuid } from "uuidv4";

export const useInputPage = (caseData: ICase) => {
  const [pageData, setPageData] = useState<ILine[]>([]);

  // Select relevant data from Redux store
  const inputData = useStoreState((state) => state.input.data);
  const layout = useStoreState((state) => state.input.layout);
  const selected = useStoreState((state) => state.cases.selected);

  // Define action to add input page to store
  const addInputPage = useStoreActions((actions) => actions.input.addData);

  // Memoize the caseIdentifier object to avoid recreating it on every render
  const caseIdentifier = useMemo(
    () => ({
      groupId: caseData.groupId,
      caseId: caseData.caseId,
    }),
    [caseData]
  );

  useEffect(() => {
    // Check if a case is selected
    if (selected.caseId === "None" || selected.groupId === "None") return;

    // Find input page corresponding to the current case
    const inputPage = inputData.find((inputElement) => {
      return _.isEqual(inputElement.id, caseIdentifier);
    });

    if (!inputPage) {
      // If input page doesn't exist, create one
      const newLines = layout ? layout.map((element) => ({ ...element, lineId: uuid() })) : [];
      addInputPage({ id: caseIdentifier, lines: newLines, outData: "" });
      setPageData(newLines);
    } else {
      // If input page exists, set page data from store
      setPageData(inputPage.lines);
    }
  }, [caseIdentifier, inputData, layout, selected]);

  return { pageData, setPageData };
};
