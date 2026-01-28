const imagePathForm = document.getElementById("image-path-form")
const submittedImageDiv = document.getElementById("submitted-image-div")

imagePathForm.addEventListener("submit", async function submitimage(e) {
	e.preventDefault();
	const imagePath = document.getElementById("image-path").value;
	const response = await fetch(`http://127.0.0.1:8000/uploadimage/${imagePath}`);

	const imageBlob = await response.blob();
	const imageUrl = URL.createObjectURL(imageBlob);
	const img = document.createElement("img");
	img.src = imageUrl;

	submittedImageDiv.innerHTML = "";
	submittedImageDiv.appendChild(img);
})
