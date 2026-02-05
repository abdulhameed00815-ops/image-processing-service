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


function checkIfImageExistsFromBlobUrl() {
	const imageUrl = sessionStorage.getItem("image_url")
	if (imageUrl !== null) {
		const imageUrl = sessionStorage.getItem("image_url");
		const img = document.createElement("img");
		img.src = imageUrl;

		submittedImageDiv.innerHTML = "";
		submittedImageDiv.appendChild(img);
	} 
}


function FetchImageFromDatabase(dbName, storeName) {
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

			let transaction = db.transaction(storeName, "readonly");
			let store = transaction.objectStore(storeName);
			let request = store.get("1");

			request.onsuccess = function(event) {
				const imageObject = request.result;
				resolve(imageObject);
				db.close();
			};

			request.onerror = function(event) {
				reject(event.target.error);
				db.close();
			};

		};

		request.onerror = () => reject(request.error);
	});
}


window.onload = async () => {
	try {
		checkIfImageExistsFromBlobUrl();
	} catch (e) {
		console.log(`an error occured: ${e}`);
	};

	try {
		imageRecord = await FetchImageFromDatabase("album", "images");
		if (!imageRecord) return;
		const imageUrl = URL.createObjectURL(imageRecord.image_blob);
		sessionStorage.setItem('image_url', imageUrl);
		const img = document.createElement("img");
		img.src = imageUrl;

		submittedImageDiv.innerHTML = "";
		submittedImageDiv.appendChild(img);
	} catch (e) {
		console.log(`an error occured: ${e}`);
	}

	return
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


	let openRequest = indexedDB.open("album", 1)

	openRequest.onupgradeneeded = (event) => {
		console.log('onupgradeneeded fired bitch')
		let db = event.target.result;
		if (!db.objectStoreNames.contains("images")) {
			db.createObjectStore("images", {keyPath: "id"});
		}
	};

	openRequest.onsuccess = (event) => {
		let db = event.target.result;
		let transaction = db.transaction("images", "readwrite");
		let images = transaction.objectStore("images");
		let image = {
			id: "1",
			image_blob: imageBlob
		};
		let request = images.put(image);

		request.onsuccess = () => {
			console.log("image added to indexedDB", request.result);
		};

		request.onerror = () => {
			console.log("error: ", request.error);
		};
	};

});


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


