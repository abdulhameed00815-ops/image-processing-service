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

const cropAmountForm = document.getElementById("crop-amount-form")

cropAmountForm.addEventListener("submit", async function cropimage (e) {
	e.preventDefault()
	const imageUrl = sessionStorage.get("image_url")
	const cropAmount1 = document.getElementById("crop-amount-1")
	const cropAmount2 = document.getElementById("crop-amount-2")
	const cropAmount3 = document.getElementById("crop-amount-3")
	const cropAmount4 = document.getElementById("crop-amount-4")
        const response = await fetch(`http://127.0.0.1:8000/crop/${imageUrl}/${cropAmount1}/${cropAmount2}/${cropAmount3}/${cropAmount4}`);

        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        sessionStorage.set('image_url', imageUrl)
        const img = document.createElement("img");
        img.src = imageUrl;

        submittedImageDiv.innerHTML = "";
        submittedImageDiv.appendChild(img);
})
