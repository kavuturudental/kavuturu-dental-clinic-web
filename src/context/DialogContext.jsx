// src/context/DialogContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import CustomDialog from "../components/common/CustomDialog";

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    confirmText: "",
    cancelText: "",
    defaultValue: "",
    placeholder: "",
    onConfirm: null,
    onCancel: null
  });

  const closeDialog = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showDialog = useCallback((options) => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        type: options.type || "info",
        title: options.title || "",
        message: options.message || "",
        confirmText: options.confirmText || "",
        cancelText: options.cancelText || "",
        defaultValue: options.defaultValue || "",
        placeholder: options.placeholder || "",
        onConfirm: (val) => {
          options.onConfirm && options.onConfirm(val);
          resolve(val !== undefined ? val : true);
        },
        onCancel: () => {
          options.onCancel && options.onCancel();
          resolve(false);
        }
      });
    });
  }, []);

  const showAlert = useCallback((message, title = "Notice", type = "info") => {
    return showDialog({ type, title, message });
  }, [showDialog]);

  const showSuccess = useCallback((message, title = "Success", extraOptions = {}) => {
    return showDialog({ type: "success", title, message, ...extraOptions });
  }, [showDialog]);

  const showError = useCallback((message, title = "Error") => {
    return showDialog({ type: "error", title, message });
  }, [showDialog]);

  const showWarning = useCallback((message, title = "Warning") => {
    return showDialog({ type: "warning", title, message });
  }, [showDialog]);

  const showConfirm = useCallback((message, title = "Please Confirm", confirmText = "Continue", cancelText = "Cancel") => {
    return showDialog({
      type: "confirm",
      title,
      message,
      confirmText,
      cancelText
    });
  }, [showDialog]);

  // Patch window.alert, window.confirm, window.prompt as global fallback
  useEffect(() => {
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    const originalPrompt = window.prompt;

    window.alert = (msg) => {
      let title = "Notice";
      let type = "info";
      const messageStr = String(msg || "");

      if (messageStr.toLowerCase().includes("error") || messageStr.toLowerCase().includes("failed")) {
        title = "Validation Error";
        type = "error";
      } else if (messageStr.toLowerCase().includes("already") || messageStr.toLowerCase().includes("unavailable") || messageStr.toLowerCase().includes("exists")) {
        title = "Appointment Already Exists";
        type = "warning";
      } else if (messageStr.toLowerCase().includes("success") || messageStr.toLowerCase().includes("booked")) {
        title = "Booking Successful";
        type = "success";
      }

      showDialog({
        type,
        title,
        message: messageStr
      });
    };

    window.confirm = (msg) => {
      // Synchronous return wrapper for window.confirm
      showDialog({
        type: "confirm",
        title: "Please Confirm",
        message: String(msg || ""),
        confirmText: "Continue",
        cancelText: "Cancel"
      });
      return true;
    };

    window.prompt = (msg, defaultText = "") => {
      showDialog({
        type: "prompt",
        title: "Input Required",
        message: String(msg || ""),
        defaultValue: defaultText
      });
      return defaultText;
    };

    return () => {
      window.alert = originalAlert;
      window.confirm = originalConfirm;
      window.prompt = originalPrompt;
    };
  }, [showDialog]);

  return (
    <DialogContext.Provider
      value={{
        showDialog,
        showAlert,
        showSuccess,
        showError,
        showWarning,
        showConfirm,
        closeDialog
      }}
    >
      {children}
      <CustomDialog
        {...dialogState}
        onClose={closeDialog}
      />
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};

export default DialogContext;
