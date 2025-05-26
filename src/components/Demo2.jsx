import { useEffect, useState } from "react";
import "./Demo2.css";
import { clearLog, convertFile, getFileList, getLog, getModelInfo } from "../services/uploadService";
import TrainingLog from "./TrainingLog";
import Modal from "./Modal";

const Demo2 = () => {
  const [selectedFile, setSelectedFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [files, setFiles] = useState([]);
  const [modelInfo, setModelInfo] = useState({});
  const [selectedModel, setSelectedModel] = useState("");
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleCallGetFileList = async () => {
      try {
        const res = await getFileList();
        if (res && res.data) {
          setFiles(res.data);
        } else {
          setMessage({
            type: "error",
            text: "Không thể tải danh sách file từ server",
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    const handleGetInfoModel = async () => {
      try {
        const res = await getModelInfo(); 
        setModelInfo(res)
      } catch (error) {
        console.error("Error:", error.message);
        setMessage({
          type: "error",
          text: "Không thể tải danh sách model từ server",
        });
      }
    };

    handleGetInfoModel();
    handleCallGetFileList();
  }, []);

  const handleStartFineTune = async () => {
    if (!selectedFile || !selectedModel) {
      setMessage({
        type: "error",
        text: "Vui lòng chọn file và model để bắt đầu fine-tune",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });
    setTrainingLogs([]);

    try {
      await clearLog();
      const res = await convertFile(selectedFile)   
      console.log(res) 
      
      setMessage({
        type: "success",
        text: "Quá trình fine-tune đã bắt đầu thành công!",
      });

      // Poll for logs every 2 seconds
      const pollInterval = setInterval(async () => {
        try {
          const logRes = await getLog();
          if (logRes && logRes.logs) {
            setTrainingLogs(logRes.logs);
            
            // Check if training is complete
            const isComplete = logRes.logs.some(log => 
              log.includes("=== KẾT THÚC QUÁ TRÌNH FINE-TUNE ===")
            );
            
            if (isComplete) {
              clearInterval(pollInterval);
              setIsLoading(false);
            }
          }
        } catch (error) {
          console.error("Error fetching logs:", error);
        }
      }, 2000);

      // Clear interval after 10 minutes (timeout)
      setTimeout(() => {
        clearInterval(pollInterval);
        setIsLoading(false);
      }, 10000);

    } catch (error) {
      setMessage({
        type: "error",
        text: "Có lỗi xảy ra trong quá trình fine-tune",
      });
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fine-tune-container">
      <div className="fine-tune-box">
        <div className="fine-tune-header">
          <h1 className="fine-tune-title">Fine-tune Model</h1>
          <p className="fine-tune-description">
            Chọn file PDF và model để bắt đầu quá trình fine-tune. Quá trình này
            có thể mất vài phút để hoàn thành.
          </p>
        </div>

        <div className="fine-tune-content">
          <div className="form-group">
            <label className="form-label">Chọn File PDF</label>
            <select
              className="form-select"
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
            >
              <option value="">-- Chọn file --</option>
              {files.map((file) => (
                <option key={file._id} value={file.fileId}>
                  {file.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Chọn Model</label>
            <select
              className="form-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="">-- Chọn model --</option>
              {modelInfo.model_name && (
                <option value={modelInfo.model_name}>
                  {modelInfo.model_name}
                </option>
              )}
            </select>
          </div>

          {message.type && (
            <div className={`${message.type}-message`}>
              {message.type === "error" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {message.text}
            </div>
          )}

          <div className="button-group">
            <button
              className="start-button"
              onClick={handleStartFineTune}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Bắt đầu Fine-tune
                </>
              )}
            </button>

            {trainingLogs.length > 0 && (
              <button
                className="view-details-button"
                onClick={() => setIsModalOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm0-4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Xem chi tiết
              </button>
            )}
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <TrainingLog logs={trainingLogs} />
        </Modal>
      </div>
    </div>
  );
};

export default Demo2;
