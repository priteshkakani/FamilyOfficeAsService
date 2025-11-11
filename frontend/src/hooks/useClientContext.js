// Removed illegal top-level return statement. If you need a useClientContext hook, define it as a function:
// import { useContext } from "react";
// import { AdvisorClientContext } from "../contexts/AdvisorClientContext";
// export function useClientContext() {
//   const { clientId, setClientId } = useContext(AdvisorClientContext);
//   const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
//   const isValidClientId = typeof clientId === "string" && uuidRegex.test(clientId);
//   return { clientId: isValidClientId ? clientId : null, setClientId };
// }
import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabaseClient";

// Client context is no longer needed in Client Mode. Remove all logic.
