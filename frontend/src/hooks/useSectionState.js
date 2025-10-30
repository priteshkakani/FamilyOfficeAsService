import { useParams } from "react-router-dom";

export default function useSectionState() {
  const { section, subtab } = useParams();
  return { section, subtab };
}
