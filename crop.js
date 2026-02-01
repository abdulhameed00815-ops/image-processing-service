const submittedImageDiv = document.getElementById("submitted-image-div")
const imageUrl = sessionStorage.getItem('image_url');


window.onload = function loadUploadedImage() {
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


function downloadImageFromBlob(blobUrl, filename) {
	const link = document.createElement('a');

	link.href = blobUrl;

	link.download = filename;

	document.body.appendChild(link);

	link.click();

	document.body.removeChild(link);
}




const cropAmountForm = document.getElementById("crop-amount-form");


cropAmountForm.addEventListener("submit", async function cropImage (e) {
	e.preventDefault()
	const file = await blobUrlToFile(imageUrl, "image.jpg");
	//we create a form data to let the browser send the file safely thro http
	const formData = new FormData();
	formData.append("image", file)
	const cropAmount1 = document.getElementById("crop-amount-1").value;
	const cropAmount2 = document.getElementById("crop-amount-2").value;
	const cropAmount3 = document.getElementById("crop-amount-3").value;
	const cropAmount4 = document.getElementById("crop-amount-4").value;
        const response = await fetch(`http://127.0.0.1:8000/crop/${cropAmount1}/${cropAmount2}/${cropAmount3}/${cropAmount4}`, {
		method: "POST",
		body: formData
	});

        const imageBlob = await response.blob();
        const croppedImageUrl = URL.createObjectURL(imageBlob);
        sessionStorage.setItem('image_url', croppedImageUrl);
        const img = document.createElement("img");
        img.src = croppedImageUrl;

        submittedImageDiv.innerHTML = "";
        submittedImageDiv.appendChild(img);
	
	const downloadButton = document.getElementById("download-button");
	downloadButton.addEventListener("click", function() {
		downloadImageFromBlob(croppedImageUrl, "cropped_image.jpg");
	})

	const directToHomepage = document.getElementById("direct-to-homepage");
	directToHomepage.addEventListener("click", function() {
		window.location.assign("http://localhost:5500/homepage.html");
	})
})
