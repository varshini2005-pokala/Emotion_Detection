// Load face-api.js models
window.addEventListener('load', async () => {
  try {
    // Load models from the models folder
await faceapi.nets.tinyFaceDetector.loadFromUri('models');
await faceapi.nets.faceExpressionNet.loadFromUri('models');

    console.log("✅ Models loaded successfully!");
    document.getElementById("result").innerHTML = "✅ Models loaded. Please upload an image.";
  } catch (error) {
    console.error("❌ Error loading models:", error);
    document.getElementById("result").innerHTML = "❌ Failed to load models. Check paths.";
  }
});

const imageUpload = document.getElementById('imageUpload');
const uploadedImage = document.getElementById('uploadedImage');
const overlay = document.getElementById('overlay');
const resultDiv = document.getElementById('result');

// When user uploads an image
imageUpload.addEventListener('change', async () => {
  const file = imageUpload.files[0];
  if (!file) return;

  // Show uploaded image
  uploadedImage.src = URL.createObjectURL(file);

  uploadedImage.onload = async () => {
    overlay.width = uploadedImage.width;
    overlay.height = uploadedImage.height;

    try {
      // Detect face + expressions
      const detections = await faceapi
        .detectSingleFace(uploadedImage, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      const context = overlay.getContext('2d');
      context.clearRect(0, 0, overlay.width, overlay.height);

      if (detections) {
        // Draw face box
        faceapi.draw.drawDetections(overlay, detections);

        // Show all emotions with confidence scores
        const expressions = detections.expressions;
        let output = "<h3>😊 Emotions detected:</h3>";
        for (let [expr, value] of Object.entries(expressions)) {
          output += `${expr}: ${(value * 100).toFixed(2)}% <br>`;
        }
        resultDiv.innerHTML = output;

        console.log("Emotions:", expressions);

      } else {
        resultDiv.innerHTML = "❌ No face detected. Try another image.";
      }
    } catch (err) {
      console.error("❌ Detection error:", err);
      resultDiv.innerHTML = "❌ Error during detection. Check console.";
    }
  };
});
