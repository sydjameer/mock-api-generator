document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("mockForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        // Collect form data
        const httpStatus = document.getElementById("httpStatus").value;
        const contentType = document.getElementById("contentType").value;
        const charset = document.getElementById("charset").value;
        const headers = document.getElementById("headers").value;
        const responseBody = document.getElementById("responseBody").value;

        let parsedHeaders;
        try {
            parsedHeaders = headers ? JSON.parse(headers) : {};
        } catch (error) {
            alert("Invalid JSON in headers!");
            return;
        }

        // Send to backend
        const response = await fetch("/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                httpStatus, contentType, charset, headers: parsedHeaders, responseBody
            })
        });

        const data = await response.json();
        if (data.url) {
            // document.getElementById("generatedUrl").style.display = "block";
            document.getElementById("urlDisplay").textContent = data.url;
            document.getElementById("urlLink").href = data.url;
            var options = {
                opacity: 0.7,    // Opacity of modal background
                inDuration: 250, // Transition in duration
                outDuration: 250 // Transition out duration
            };
            var elems = document.querySelectorAll('#modal1');
            var instances =  M.Modal.init(elems,options);
            if (instances.length > 0) {
                var instance = instances[0]; // Get the first (and likely only) instance
                instance.open();
            } else {
                console.error("Modal element not found.");
            }
        } else {
            alert("Error generating URL!");
        }
    });
});



 