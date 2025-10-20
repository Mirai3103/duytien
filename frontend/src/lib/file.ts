export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`/api/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to upload file");
  }
  const data = await response.json();
  // Return the full URL for the uploaded file
  return `/api/file/${data.file}`;
}
// url format: /api/file/product-images/1234567890.jpg
export async function deleteFile(url: string) {
  const response = await fetch(url, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete file");
  }
  return response.json();
}
