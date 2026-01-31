const imagePathForm = document.getElementById("image-path-form")
const submittedImageDiv = document.getElementById("submitted-image-div")

function checkIfImageExists() {
	const imageUrl = sessionStorage.getItem("image_url")
	if (imageUrl !== null) {
		const imageUrl = sessionStorage.getItem("image_url");
		const img = document.createElement("img");
		img.src = imageUrl;

		submittedImageDiv.innerHTML = "";
		submittedImageDiv.appendChild(img);
	} else {
		imagePathForm.addEventListener("submit", async function submitimage(e) {
			e.preventDefault();
			const imagePath = document.getElementById("image-path").value;
			sessionStorage.setItem('image_path', imagePath)
			const response = await fetch(`http://127.0.0.1:8000/uploadimage/${imagePath}`);

			const imageBlob = await response.blob();
			const imageUrl = URL.createObjectURL(imageBlob);
			sessionStorage.setItem('image_url', imageUrl);
			const img = document.createElement("img");
			img.src = imageUrl;

			submittedImageDiv.innerHTML = "";
			submittedImageDiv.appendChild(img);
		})
	}
}

window.onload = checkIfImageExists();




const directToCropButton = document.getElementById("direct-to-crop-button")


directToCropButton.addEventListener("click", function directToCropPage() {
	window.location.assign("http://localhost:5500/crop.html")
})
