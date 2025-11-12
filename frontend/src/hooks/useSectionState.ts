import { useParams } from "react-router-dom";

type ValidSections = 'overview' | 'assets' | 'liabilities' | 'goals' | 'insurance' | 'documents' | 'settings';
type ValidSubTabs = string | undefined;

interface SectionState {
  section: ValidSections;
  subtab: ValidSubTabs;
  isActive: (sections: ValidSections | ValidSections[], subtab?: string) => boolean;
}

/**
 * Custom hook to manage and validate the current section and subtab from URL parameters
 * 
 * @returns {SectionState} Object containing the current section, subtab, and a helper function
 * 
 * @example
 * const { section, subtab, isActive } = useSectionState();
 * const isAssetsActive = isActive('assets');
 * const isStocksTabActive = isActive('assets', 'stocks');
 */
function useSectionState(): SectionState {
  const { section = 'overview', subtab } = useParams<{ 
    section?: ValidSections; 
    subtab?: string 
  }>();

  /**
   * Check if the given section (and optionally subtab) is currently active
   * @param sections - Section or array of sections to check
   * @param checkSubtab - Optional subtab to check for exact match
   * @returns {boolean} True if the section (and subtab) is active
   */
  const isActive = (
    sections: ValidSections | ValidSections[], 
    checkSubtab?: string
  ): boolean => {
    const sectionsArray = Array.isArray(sections) ? sections : [sections];
    const isSectionMatch = sectionsArray.includes(section as ValidSections);
    
    if (checkSubtab !== undefined) {
      return isSectionMatch && subtab === checkSubtab;
    }
    
    return isSectionMatch;
  };

  return {
    section: section as ValidSections,
    subtab,
    isActive,
  };
}

export default useSectionState;
