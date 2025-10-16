import { toast } from "react-hot-toast";

export function notifySuccess(message) {
  toast.success(message, {
    style: {
      borderRadius: "8px",
      background: "#f0f9ff",
      color: "#0f172a",
      fontFamily: "Inter, sans-serif",
    },
    iconTheme: {
      primary: "#2563eb",
      secondary: "#fff",
    },
  });
}

export function notifyError(message) {
  toast.error(message, {
    style: {
      borderRadius: "8px",
      background: "#fff1f2",
      color: "#991b1b",
      fontFamily: "Inter, sans-serif",
    },
    iconTheme: {
      primary: "#ef4444",
      secondary: "#fff",
    },
  });
}
