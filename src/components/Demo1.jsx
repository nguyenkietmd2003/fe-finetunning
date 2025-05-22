import { useState } from 'react';
import { uploadFile } from '../services/uploadService';
import './Demo1.css';

function Demo1() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setMessage({ type: '', text: '' });

    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        setMessage({
          type: 'error',
          text: 'Vui lòng chỉ chọn file PDF',
        });
        setSelectedFile(null);
        event.target.value = null; // Reset file input
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({
        type: 'error',
        text: 'Vui lòng chọn file để upload',
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: 'Đang tải lên...' });

    try {
      const result = await uploadFile(selectedFile);
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: `Tải file "${selectedFile.name}" thành công!`,
        });
        setSelectedFile(null);
      } else {
        setMessage({
          type: 'error',
          text: `File "${selectedFile.name}" đã tồn tại trong hệ thống.`,
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Có lỗi xảy ra khi upload file',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="demo-page upload-container">
      <h1>PDF File Upload</h1>
      
      <div className="upload-box">
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          className="file-input"
          accept=".pdf,application/pdf"
          disabled={isLoading}
        />
        <label htmlFor="file-input" className={`file-label ${isLoading ? 'disabled' : ''}`}>
          <span className="upload-icon">📄</span>
          <span>Chọn file PDF hoặc kéo thả vào đây</span>
          <span className="file-type-hint">(Chỉ chấp nhận file PDF)</span>
        </label>

        {message.text && (
          <div className={`message ${message.type === 'success' ? 'success-message' : 'error-message'}`}>
            {message.text}
          </div>
        )}

        {selectedFile && (
          <div className="file-info">
            <p>File đã chọn: {selectedFile.name}</p>
            <p>Kích thước: {(selectedFile.size / 1024).toFixed(2)} KB</p>
          </div>
        )}

        <button 
          onClick={handleUpload}
          className={`upload-button ${isLoading ? 'loading' : ''}`}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? 'Đang tải lên...' : 'Tải lên'}
        </button>
      </div>
    </div>
  );
}

export default Demo1; 
