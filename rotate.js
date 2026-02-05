const submittedImageDiv = document.getElementById("submitted-image-div")


window.onload = async function loadUploadedImage() {
	try {
		const imageUrl = sessionStorage.getItem('image_url');
		const img = document.createElement("img");
		img.src = imageUrl;

		submittedImageDiv.innerHTML = "";
		submittedImageDiv.appendChild(img);
	} catch (error) {
		imageRecord = await FetchImageFromDatabase("album", "images");
                if (!imageRecord) return;
                const imageUrl = URL.createObjectURL(imageRecord.image_blob);
                sessionStorage.setItem('image_url', imageUrl);
                const img = document.createElement("img");
                img.src = imageUrl;

                submittedImageDiv.innerHTML = "";
                submittedImageDiv.appendChild(img);
	};
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


const rotateButton = document.getElementById("rotate-button");


rotateButton.addEventListener("click", async function(e) {
	e.preventDefault();
	const imageUrl = sessionStorage.getItem('image_url');
	const file = await blobUrlToFile(imageUrl, "image.jpg")
	const formData = new FormData()
	formData.append("image", file)
	const response = await fetch(`http://127.0.0.1:8000/rotate`, {
                method: "POST",
                body: formData
        });

        const imageBlob = await response.blob();
        const rotatedImageUrl = URL.createObjectURL(imageBlob);
        sessionStorage.setItem('image_url', rotatedImageUrl);
        const img = document.createElement("img");
        img.src = rotatedImageUrl;

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



        const downloadButton = document.getElementById("download-button");
        downloadButton.addEventListener("click", function() {
                downloadImageFromBlob(rotatedImageUrl, "rotated_image.jpg");
        });

        const directToHomepage = document.getElementById("direct-to-homepage");
        directToHomepage.addEventListener("click", function() {
                window.location.assign("http://localhost:5500/homepage.html");
        });

});
