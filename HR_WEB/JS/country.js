const countryURL = "https://super-spoon-976p7x9r54gp2755-6006.app.github.dev/countries";

fetch(countryURL).then(response => {
    if(!response.ok) {
        throw new Error("Failed to fetch country data");
    }
    return response.json();
}).then(data => {
    const TBody = document.querySelector('#country-table tbody')
    
    data.forEach(element => {
        const row = document.createElement("tr")
        row.innerHTML = `
            <td>${element.country_id}</td>
            <td>${element.country_name}</td>
            <td>${element.region_id}</td>
        `;

        TBody.appendChild(row)
    });
}).catch(error => {
    console.log(error.message)
});