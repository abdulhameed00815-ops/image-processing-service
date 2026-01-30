const submittedImageDiv = document.getElementById("submitted-image-div")
const imageUrl = sessionStorage.getItem('image_url');


window.onload = function loadUploadedImage() {
	console.log(imageUrl)
        const img = document.createElement("img");
        img.src = imageUrl;

        submittedImageDiv.innerHTML = "";
        submittedImageDiv.appendChild(img);
};


async function blobUrlToFile(blobUrl, fileName) {
	try {
	const response = await fetch(blobUrl);
	const blob = await response.blob();

	const file = new File([blob], fileName, { type: blob.type, lastModified: Date.now() });
	return file;
	} catch (error) {
	console.error("Error converting blob URL to File:", error);
	return null;
	}
}


const file = blobUrlToFile(imageUrl, "image.png");


//we create a form data to let the browser send the file safely thro http
const formdata = new FormData();
formdata.append("image", file)


const cropAmountForm = document.getElementById("crop-amount-form");


cropAmountForm.addEventListener("submit", async function cropImage (e) {
	e.preventDefault()
	const cropAmount1 = document.getElementById("crop-amount-1");
	const cropAmount2 = document.getElementById("crop-amount-2");
	const cropAmount3 = document.getElementById("crop-amount-3");
	const cropAmount4 = document.getElementById("crop-amount-4");
        const response = await fetch(`http://127.0.0.1:8000/crop/${imageUrl}/${cropAmount1}/${cropAmount2}/${cropAmount3}/${cropAmount4}`, {
		method: "POST",
		body: formdata
	});

        const imageBlob = await response.blob();
        const croppedImageUrl = URL.createObjectURL(imageBlob);
        sessionStorage.setItem('image_url', croppedImageUrl);
        const img = document.createElement("img");
        img.src = croppedImageUrl;

        submittedImageDiv.innerHTML = "";
        submittedImageDiv.appendChild(img);
})
