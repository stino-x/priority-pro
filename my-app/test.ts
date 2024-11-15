function base64ToFile(base64String, fileName) {
  // Split the base64 string to remove the data type prefix
  const [mimeInfo, base64Data] = base64String.split(',');
  const mimeType = mimeInfo.match(/:(.*?);/)[1]; // Extract MIME type (e.g., "image/jpeg")

  // Decode the base64 string to binary data
  const binary = atob(base64Data);
  const binaryLength = binary.length;
  const binaryArray = new Uint8Array(binaryLength);

  for (let i = 0; i < binaryLength; i++) {
    binaryArray[i] = binary.charCodeAt(i);
  }

  // Create a Blob object
  const blob = new Blob([binaryArray], { type: mimeType });

  // Optionally convert Blob to File
  return new File([blob], fileName, { type: mimeType });
}

// Example usage
const base64String = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z";
const fileName = "image.jpg";
const file = base64ToFile(base64String, fileName);

console.log(file); // Output: File object
