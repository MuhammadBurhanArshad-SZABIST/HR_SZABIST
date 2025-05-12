const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', async (req, res) => {
    try{
        res.json('Welcome to HR API')
    } catch(error) {
        res.status(500).json({Error: error.message})
    }
})

const apiData = [
      {
        endPoint: '/emp-with-location',
        query: 'SELECT e.employee_id, e.first_name, e.last_name, l.street_address, l.city, l.state_province, c.country_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON l.location_id = d.location_id INNER JOIN countries c ON c.country_id = l.country_id'
    },
    {
        endPoint: '/jh-with-emp',
        query: 'SELECT e.employee_id, e.first_name, e.last_name, jh.start_date, jh.end_date, jh.job_id from employees e RIGHT JOIN job_history jh ON jh.employee_id = e.employee_id'
    },
    {
        endPoint: '/emp-with-jh',
        query: 'SELECT e.employee_id, e.first_name, e.last_name, jh.start_date, jh.end_date, jh.job_id from employees e LEFT JOIN job_history jh ON jh.employee_id = e.employee_id'
    },
    {
        endPoint: '/emp-with-jh-dep',
        query: 'SELECT e.employee_id, e.first_name, e.last_name, jh.start_date, jh.end_date, jh.job_id, d.department_name from employees e LEFT JOIN job_history jh ON jh.employee_id = e.employee_id INNER JOIN departments d ON e.department_id = d.department_id'
    },
    {
        endPoint: '/emp-with-jh-dep-loc',
        query: 'SELECT e.employee_id, e.first_name, e.last_name, jh.start_date, jh.end_date, jh.job_id, d.department_name, l.street_address, l.city from employees e LEFT JOIN job_history jh ON jh.employee_id = e.employee_id INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON d.location_id = l.location_id'
    },
    {
        endPoint: '/emp-with-jh-dep-loc-country',
        query: 'SELECT e.employee_id, e.first_name, e.last_name, jh.start_date, jh.end_date, jh.job_id, d.department_name, l.street_address, l.city, c.country_name from employees e LEFT JOIN job_history jh ON jh.employee_id = e.employee_id INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON d.location_id = l.location_id INNER JOIN countries c ON c.country_id = l.country_id'
    },
    {
        endPoint: '/jh-with-emp-dep',
        query: 'SELECT e.employee_id, e.first_name, e.last_name, jh.start_date, jh.end_date, jh.job_id, d.department_name FROM job_history jh INNER JOIN employees e ON e.employee_id = jh.employee_id INNER JOIN departments d ON d.department_id = jh.department_id'
    },
    {
        endPoint: '/jh-with-emp-job',
        query: 'SELECT e.employee_id, e.first_name, e.last_name, jh.start_date, jh.end_date, j.job_title FROM job_history jh INNER JOIN employees e ON e.employee_id = jh.employee_id INNER JOIN jobs j ON j.job_id = jh.job_id'
    },
    {
        endPoint: '/jh-with-emp-job-dep',
        query: 'SELECT e.first_name, e.last_name, j.job_title, d.department_name FROM job_history jh INNER JOIN employees e ON jh.employee_id = e.employee_id INNER JOIN departments d ON d.department_id = jh.department_id INNER JOIN jobs j ON j.job_id = jh.job_id'
    },
    {
        endPoint: '/jh-with-emp-job-loc',
        query: 'SELECT e.first_name, e.last_name, j.job_title, l.street_address FROM job_history jh INNER JOIN employees e ON jh.employee_id = e.employee_id INNER JOIN departments d ON d.department_id = jh.department_id INNER JOIN jobs j ON j.job_id = jh.job_id INNER JOIN locations l ON l.location_id = d.location_id'
    },
    {
        endPoint: '/jh-with-emp-job-country',
        query: 'SELECT e.first_name, e.last_name, j.job_title, c.country_name FROM job_history jh INNER JOIN employees e ON jh.employee_id = e.employee_id INNER JOIN departments d ON d.department_id = jh.department_id INNER JOIN jobs j ON j.job_id = jh.job_id INNER JOIN locations l ON l.location_id = d.location_id INNER JOIN countries c ON c.country_id = l.country_id'
    },
    {
        endPoint: '/regions-countries-locations',
        query: 'SELECT l.street_address, l.city, c.country_name, r.region_name FROM locations l INNER JOIN countries c ON l.country_id = c.country_id INNER JOIN regions r ON r.region_id = c.region_id'
    },
    {
        endPoint: '/countries-regions-locations',
        query: 'SELECT c.country_name, r.region_name, l.street_address FROM locations l RIGHT JOIN countries c ON c.country_id = l.country_id INNER JOIN regions r ON r.region_id = c.region_id'
    },
    {
        endPoint: '/locations-countries-regions',
        query: 'SELECT c.country_name, r.region_name, l.street_address FROM locations l LEFT JOIN countries c ON l.country_id = c.country_id INNER JOIN regions r ON r.region_id = c.region_id'
    },
    {
        endPoint: '/departments-employees-locations',
        query: 'SELECT e.first_name, e.last_name, d.department_name, l.city FROM departments d LEFT JOIN employees e ON e.department_id = d.department_id INNER JOIN locations l ON d.location_id = l.location_id'
    },
    {
        endPoint: '/employees-departments-locations-countries',
        query: 'SELECT e.first_name, e.last_name, d.department_name, l.city, c.country_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON l.location_id = d.location_id INNER JOIN countries c ON c.country_id = l.country_id'
    },
    {
        endPoint: '/employees-managers-departments-locations',
        query: 'SELECT e.first_name as employee_first_name, e.last_name as employee_last_name, m.first_name as manager_first_name, m.last_name as manager_last_name, d.department_name, l.city FROM employees e INNER JOIN employees m ON e.manager_id = m.employee_id INNER JOIN departments d ON d.department_id = e.department_id INNER JOIN locations l ON d.location_id = l.location_id'
    },
    {
        endPoint: '/employees-jobs-departments-locations',
        query: 'SELECT e.first_name, e.last_name, j.job_title, d.department_name, l.city from employees e INNER JOIN jobs j ON e.job_id = j.job_id INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON d.location_id = l.location_id'
    },
    {
        endPoint: '/employees-jobs-departments-managers',
        query: 'SELECT e.first_name as employee_first_name, e.last_name as employee_last_name, m.first_name as manager_first_name, m.last_name as manager_last_name, j.job_title, d.department_name FROM employees e INNER JOIN employees m ON e.manager_id = m.employee_id INNER JOIN jobs j ON e.job_id = j.job_id INNER JOIN departments d ON e.department_id = d.department_id'
    },
    {
        endPoint: '/employees-jobs-departments-managers-locations',
        query: 'SELECT e.first_name as employee_first_name, e.last_name as employee_last_name, m.first_name as manager_first_name, m.last_name as manager_last_name, j.job_title, d.department_name, l.city FROM employees e INNER JOIN employees m ON e.manager_id = m.employee_id INNER JOIN jobs j ON e.job_id = j.job_id INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON d.location_id = l.location_id'
    },
    {
        endPoint: '/countries-region1',
        query: 'SELECT country_id, country_name, region_id FROM countries WHERE region_id = 1'
    },
    {
        endPoint: '/departments-cities-starting-with-N',
        query: 'SELECT d.department_name, l.city FROM departments d INNER JOIN locations l ON d.location_id = l.location_id WHERE city LIKE \'N%\''
    },
    {
        endPoint: '/employees-departments-high-commission-managers',
        query: 'SELECT e.first_name as employee_first_name, e.last_name as employee_last_name, m.first_name as manager_first_name, m.last_name as manager_last_name, m.commission_pct as manager_commission_pct FROM employees e INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN employees m ON d.manager_id = m.employee_id WHERE m.commission_pct > 0.15'
    },
    {
        endPoint: '/manager-job-titles',
        query: 'SELECT e.first_name, e.last_name, j.job_title FROM employees e INNER JOIN jobs j ON e.job_id = j.job_id INNER JOIN departments d ON d.department_id = e.department_id WHERE d.manager_id = e.employee_id'
    },
    {
        endPoint: '/locations-asia-region',
        query: 'SELECT l.street_address, l.city, c.country_id, r.region_name FROM locations l INNER JOIN countries c ON l.country_id = c.country_id INNER JOIN regions r ON c.region_id = r.region_id WHERE r.region_name LIKE \'Asia\''
    },
    {
        endPoint: '/departments-low-commission-employees',
        query: 'SELECT d.department_id, d.department_name FROM departments d INNER JOIN employees e ON d.department_id = e.department_id WHERE e.commission_pct < (SELECT AVG(commission_pct) FROM employees)'
    },
    {
        endPoint: '/employees-above-department-avg-salary',
        query: 'SELECT e.first_name, e.last_name, e.salary, j.job_title FROM employees e INNER JOIN jobs j ON e.job_id = j.job_id WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id)'
    },
    {
        endPoint: '/employees-no-department',
        query: 'SELECT employee_id, first_name, last_name FROM employees WHERE department_id IS NULL'
    },
    {
        endPoint: '/employees-multiple-jobs',
        query: 'SELECT e.first_name, e.last_name FROM employees e INNER JOIN (SELECT employee_id FROM job_history GROUP BY employee_id HAVING COUNT(employee_id) > 1) jh ON e.employee_id = jh.employee_id'
    },
    {
        endPoint: '/employee-count-by-department',
        query: 'SELECT department_id, COUNT(*) AS employee_count FROM employees GROUP BY department_id'
    },
    {
        endPoint: '/total-salary-by-job',
        query: 'SELECT j.job_id, j.job_title, SUM(e.salary) AS total_salary FROM employees e INNER JOIN jobs j ON e.job_id = j.job_id GROUP BY j.job_id, j.job_title'
    },
    {
        endPoint: '/avg-commission-by-department',
        query: 'SELECT d.department_id, d.department_name, AVG(e.commission_pct) AS avg_commission_pct, COUNT(e.employee_id) AS employee_count FROM departments d LEFT JOIN employees e ON d.department_id = e.department_id GROUP BY d.department_id, d.department_name'
    },
    {
        endPoint: '/max-salary-by-country',
        query: 'SELECT c.country_id, c.country_name, MAX(e.salary) AS max_salary from employees e INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON l.location_id = d.location_id INNER JOIN countries c ON c.country_id = l.country_id GROUP BY c.country_id, c.country_name'
    },
    {
        endPoint: '/employees-name-contains-z',
        query: 'SELECT e.first_name, e.last_name, d.department_name, l.city, l.state_province FROM employees e INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON d.location_id = l.location_id WHERE e.first_name LIKE \'%z%\''
    },
    {
        endPoint: '/jobs-1993-to-1997',
        query: 'SELECT e.first_name, e.last_name, j.job_title, d.department_name, jh.start_date FROM job_history jh INNER JOIN employees e ON e.employee_id = jh.employee_id INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN jobs j ON j.job_id = e.job_id WHERE jh.start_date >= \'1993-01-01\' AND end_date <= \'1997-08-31\''
    },
    {
        endPoint: '/departments-with-2plus-employees',
        query: 'SELECT c.country_name, l.city, COUNT(d.department_id) AS number_of_departments FROM countries c INNER JOIN locations l ON c.country_id = l.country_id INNER JOIN departments d ON l.location_id = d.location_id INNER JOIN employees e ON d.department_id = e.department_id GROUP BY c.country_name, l.city HAVING COUNT(e.employee_id) >= 2'
    },
    {
        endPoint: '/last-jobs-no-commission',
        query: 'SELECT e.first_name, e.last_name, j.job_title, jh.start_date, jh.end_date FROM employees e INNER JOIN jobs j ON e.job_id = j.job_id INNER JOIN job_history jh ON j.job_id = jh.job_id WHERE e.commission_pct IS NULL'
    },
    {
        endPoint: '/employees-with-country',
        query: 'SELECT e.employee_id, e.first_name, e.last_name, c.country_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON d.location_id = l.location_id INNER JOIN countries c ON c.country_id = l.country_id'
    },
    {
        endPoint: '/employees-with-min-department-salary',
        query: 'SELECT e.first_name, e.last_name, e.salary, d.department_id FROM employees e INNER JOIN departments d ON e.department_id = d.department_id WHERE e.salary = (SELECT MIN(salary) FROM employees WHERE department_id = e.department_id)'
    },
    {
        endPoint: '/third-highest-salary',
        query: 'SELECT * FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 2'
    },
    {
        endPoint: '/above-avg-salary-j-in-name',
        query: 'SELECT e.employee_id, e.first_name, e.last_name, e.salary FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees) AND e.department_id IN (SELECT department_id FROM employees WHERE first_name LIKE \'%J%\' OR last_name LIKE \'%J%\')'
    },
    {
        endPoint: '/employees-in-toronto',
        query: 'SELECT e.employee_id, e.first_name, e.last_name, j.job_title, l.city FROM employees e INNER JOIN jobs j ON e.job_id = j.job_id INNER JOIN departments d ON e.department_id = d.department_id JOIN locations l ON d.location_id = l.location_id WHERE l.city = \'Toronto\''
    },    
    {
        endPoint: '/countries',
        query: 'SELECT * FROM countries'
    },    
    {
        endPoint: '/employees',
        query: 'SELECT * FROM employees'
    },    
]

apiData.forEach(api => {
    app.get(api.endPoint, async (req, res) => {
        try{
            if(api.query) {
                const result = await pool.query(api.query);
                res.json(result.rows)
            } else {
                res.json('query not provided in an array');
            }
        } catch(error) {
            res.status(500).json({Error: error.message})
        }
    })
})


const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Connection Successfully on port = ${port}`)
})
