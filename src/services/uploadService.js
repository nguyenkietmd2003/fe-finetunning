import instance from "../api/axios-config";

export const uploadFile = async (file) => {
  const URL_API = "http://localhost:8000/api/v1/dataset";
  const formData = new FormData();
  formData.append("file", file); // "file" là tên field bạn dùng trong multer

  try {
    const res = await instance.post(URL_API, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    // Return response with success property based on status code
    return {
      ...res.data,
      success: res.status === 201
    };
  } catch (err) {
    console.error("Upload failed:", err);
    throw err;
  }
};

export const getFileList = async () => {
  const URL_API = "http://localhost:8000/api/v1/dataset/allfile";
  try {
    const res = await instance.get(URL_API);
    return res;
  } catch (err) {
    console.error("Failed to fetch file list:", err);
    throw err;
  }
}


export const convertFile = async (id)=>{
  const URL_API = `http://localhost:8000/api/v1/dataset/analyze1/${id}`;
  try {
    const res = await instance.get(URL_API);
    return res;
  } catch (err) {
    console.error("Failed to convert file:", err);
    throw err;
  }
}

export const fineTune = async () => {
  const URL_API = `http://localhost:8000/fine-tune`;
  const data = {
    messages: [],
  "num_train_epochs": 3
  }
  try {
    const res = await instance.post(URL_API, data);
    return res;
  } catch (err) {
    console.error("Failed to fine-tune:", err);
    throw err;
  }
}


/// AI
export const getModelInfo = async () => {
  const URL_API = `http://localhost:5000/model-info`;
  try {
    const res = await instance.get(URL_API);
    return res;
  } catch (err) {
    console.error("Failed to fetch model info:", err);
    throw err;
  }
}


export const askAI = async (question) => {
  const URL_API = `http://localhost:8000/api/v1/dataset/chat`;
  try {
    const res = await instance.post(URL_API, question);
    return res;
  } catch (err) {
    console.error("Failed to ask AI:", err);
    throw err;
  }

}
export const getLog = async () => {
  const URL_API = `http://localhost:5000/get-logs`;
  try {
    const res = await instance.get(URL_API);
    return res;
  } catch (err) {
    console.error("Failed to fetch log:", err);
    throw err;
  }
}
