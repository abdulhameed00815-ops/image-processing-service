const imagePathForm = document.getElementById("image-path-form")
const submittedImageDiv = document.getElementById("submitted-image-div")


function downloadImageFromBlob(blobUrl, filename) {
        const link = document.createElement('a');

        link.href = blobUrl;

        link.download = filename;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
}




function checkIfImageExistsFromSession() {
	const imageUrl = sessionStorage.getItem("image_url")
	if (imageUrl !== null) {
		const imageUrl = sessionStorage.getItem("image_url");
		const img = document.createElement("img");
		img.src = imageUrl;

		submittedImageDiv.innerHTML = "";
		submittedImageDiv.appendChild(img);
	} 
}


function checkIfImageExistsFromDatabase(dbName, storeName) {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName);
		request.onupgradeneeded = () => {
			resolve(false);
		};

		request.onsuccess = (event) => {
			const db = event.target.result;
			if (!db.objectStoreNames.contains(storeName)) {
				db.close()
				resolve(false);
				return
			}

			let transaction = db.transaction("images", "readonly");
			let store = transaction.objectStore("images");
			let request = store.get("1");

			request.onsuccess = function(event) {
				const imageObject = request.result;

			};

			request.onerror = function(event) {
				reject(event.target.error);
				db.close();
			};

		};

		request.onerror = () => reject(request.error);
	});
}


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

	let openRequest = indexedDB.open("lastImage", 1)

	openRequest.onupgradeneeded = function() {
		let db = openRequest.result;
		if (!db.objectStoreNames.contains("lastImage")) {
			db.createObjectStore("lastImage", {keyPath: 'id'})
		}
	};
})






const directToCropButton = document.getElementById("direct-to-crop-button");


directToCropButton.addEventListener("click", function directToCropPage() {
	window.location.assign("http://localhost:5500/crop.html");
});


const directToRotateButton = document.getElementById("direct-to-rotate-button");


directToRotateButton.addEventListener("click", function() {
	window.location.assign("http://localhost:5500/rotate.html");
});


const downloadButton = document.getElementById("download-button");
downloadButton.addEventListener("click", function() {
	const imageUrl = sessionStorage.getItem("image_url");
	downloadImageFromBlob(imageUrl, "image.jpg");
});


