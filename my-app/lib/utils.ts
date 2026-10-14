export { cn } from "cn";

//for passing large payloads, need to do this
export const parseStringify = (value: unknown) => {
  return JSON.parse(JSON.stringify(value));
};

//Returns the file category (type) and the file extension
export const getFileType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  let type = "";

  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      type = "image";
      break;
    case "mp4":
    case "mkv":
    case "avi":
    case "webm":
      type = "video";
      break;
    case "mp3":
    case "wav":
      type = "audio";
      break;
    case "pdf":
    case "doc":
    case "docx":
    case "txt":
      type = "document";
      break;
    default:
      type = "other";
  }

  return { type, extension };
};

//export const getFileTypeParams = (type: string) => {
// switch (type) {
//    case "documents":
//     return ["document"];

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

//generates the URL to preview the file
export const constructFileUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

//generates the URL to download the file
export const constructDownloadUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${id}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

export const convertFileSize = (sizeInBytes: number, digits?: number) => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + " Bytes";
  } else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB = sizeInBytes / 1024;
    return sizeInKB.toFixed(digits || 1) + " KB";
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(digits || 1) + " MB";
  } else {
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
    return sizeInGB.toFixed(digits || 1) + " GB";
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};
