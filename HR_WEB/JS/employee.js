const employeeURL = "https://super-spoon-976p7x9r54gp2755-6006.app.github.dev/employees";

fetch(employeeURL).then(response => {
    if(!response.ok) {
        throw new Error("Failed to fetch employee data");
    }
    return response.json();
}).then(data => {
    const TBody = document.querySelector('#employee-table tbody')
    
    data.forEach(element => {
        const row = document.createElement("tr")
        row.innerHTML = `
            <td>${element.employee_id}</td>
            <td>${element.first_name}</td>
            <td>${element.last_name}</td>
            <td>${element.email}</td>
            <td>${element.phone_number}</td>
            <td>${element.hire_date}</td>
            <td>${element.job_id}</td>
            <td>${element.salary}</td>
            <td>${element.commission_pct}</td>
            <td>${element.manager_id}</td>
            <td>${element.department_id}</td>
        `;

        TBody.appendChild(row)
    });
}).catch(error => {
    console.log(error.message)
});