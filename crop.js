const submittedImageDiv = document.getElementById("submitted-image-div")


window.onload = function loadUploadedImage() {
	let imageUrl = sessionStorage.getItem("image_url");
        let img = document.createElement("img");
        img.src = imageUrl;

        submittedImageDiv.innerHTML = "";
        submittedImageDiv.appendChild(img);
};


async function blobUrlToFile(blobUrl, fileName) {
	try {
	let response = await fetch(blobUrl);
	let blob = await response.blob();

	let file = new File([blob], fileName, { type: blob.type, lastModified: Date.now() });
	return file;
	} catch (error) {
	console.error("Error converting blob URL to File:", error);
	return null;
	}
}


function downloadImageFromBlob(blobUrl, filename) {
	let link = document.createElement('a');

	link.href = blobUrl;

	link.download = filename;

	document.body.appendChild(link);

	link.click();

	document.body.removeChild(link);
}




const cropAmountForm = document.getElementById("crop-amount-form");


cropAmountForm.addEventListener("submit", async function cropImage (e) {
	e.preventDefault()
	let imageUrl = sessionStorage.getItem("image_url");
	let file = await blobUrlToFile(imageUrl, "image.jpg");
	//we create a form data to let the browser send the file safely thro http
	let formData = new FormData();
	formData.append("image", file)
	let cropAmount1 = document.getElementById("crop-amount-1").value;
	let cropAmount2 = document.getElementById("crop-amount-2").value;
	let cropAmount3 = document.getElementById("crop-amount-3").value;
	let cropAmount4 = document.getElementById("crop-amount-4").value;
	let values = [cropAmount1, cropAmount2, cropAmount3, cropAmount4];
	let actualValues = values.map(v => v === "" ? "0" : v);
        let response = await fetch(`http://127.0.0.1:8000/crop/${actualValues[0]}/${actualValues[1]}/${actualValues[2]}/${actualValues[3]}`, {
		method: "POST",
		body: formData
	});

        let imageBlob = await response.blob();
        let croppedImageUrl = URL.createObjectURL(imageBlob);
        sessionStorage.setItem('image_url', croppedImageUrl);
        let img = document.createElement("img");
        img.src = croppedImageUrl;

        submittedImageDiv.innerHTML = "";
        submittedImageDiv.appendChild(img);
	for (const key of formData.keys()) {
		formData.delete(key);
	}
	
})


const downloadButton = document.getElementById("download-button");
downloadButton.addEventListener("click", function() {
	let imageUrl = sessionStorage.getItem("image_url");
	downloadImageFromBlob(imageUrl, "image.jpg");
})


const directToHomepage = document.getElementById("direct-to-homepage");
directToHomepage.addEventListener("click", function() {
	window.location.assign("http://localhost:5500/homepage.html");
})
