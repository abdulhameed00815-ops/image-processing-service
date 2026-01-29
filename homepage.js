const imagePathForm = document.getElementById("image-path-form")
const submittedImageDiv = document.getElementById("submitted-image-div")

imagePathForm.addEventListener("submit", async function submitimage(e) {
	e.preventDefault();
	const imagePath = document.getElementById("image-path").value;
	sessionStorage.set('image_path', imagePath)
	const response = await fetch(`http://127.0.0.1:8000/uploadimage/${imagePath}`);

	const imageBlob = await response.blob();
	const imageUrl = URL.createObjectURL(imageBlob);
	sessionStorage.set('image_url', imageUrl)
	const img = document.createElement("img");
	img.src = imageUrl;

	submittedImageDiv.innerHTML = "";
	submittedImageDiv.appendChild(img);
})

const directToCropButton = document.getElementById("direct-to-crop-button")

directToCropButton.addEventListener("click", window.location.assign("http://localhost:5500/crop.html"))
