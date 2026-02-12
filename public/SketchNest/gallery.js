document.getElementById("sketchUploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("sketchFile");
  const status = document.getElementById("upload-status");
  const preview = document.getElementById("uploaded-preview");
  const galleryDisplay = document.getElementById("gallery-display");

  if (!fileInput.files.length) {
    status.textContent = "⚠️ Please select an image first.";
    return;
  }

  const formData = new FormData();
  formData.append("sketch", fileInput.files[0]);

  try {
    const response = await fetch("/upload-sketch", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      status.textContent = data.message;
      preview.innerHTML = `<img src="${data.filePath}" alt="Uploaded Sketch" width="200">`;

      // Add to gallery
      const imgItem = document.createElement("div");
      imgItem.classList.add("gallery-item");
      imgItem.innerHTML = `<img src="${data.filePath}" alt="Sketch">`;
      galleryDisplay.appendChild(imgItem);
    } else {
      status.textContent = "❌ Upload failed: " + data.message;
    }
  } catch (err) {
    status.textContent = "❌ Error uploading file.";
    console.error(err);
  }
});
