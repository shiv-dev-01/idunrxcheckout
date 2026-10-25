import { toast } from "react-hot-toast";

const useNotification = () => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const notifyInfo = (message) => toast(message, { icon: "ℹ️" });
  const notifyLoading = (message) => toast.loading(message);

  return {
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyLoading,
  };
};

export default useNotification;
