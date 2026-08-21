import { useEffect, useState } from "react";
import axios from 'axios';

const EmployeeTable = () => {
    const [employees, setEmployees] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
                    .then(response => {
                        // Executes when the request is successful (HTTP 2xx)
                        setEmployees(response.data); // Axios automatically transforms responses to JSON
                        setTotal(response.data.length);
                        setPage(1);
                    })
                    .catch(error => {
                        // Executes if the request fails (HTTP 4xx, 5xx, or network issues)
                        console.error('Error fetching data:', error);
                        setError("failed to fetch data");
                    });

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const handlePaginatedData = (page: any) => {
        let maxPage = Math.ceil(total / 10);
        if (page > 0 && page <= maxPage) {
            setPage(page);
        }
    }

    useEffect(() => {
        let startIndex = (page * 10) - 10;
        let endIndex = page * 10;
        setFilteredEmployees(employees.slice(startIndex, endIndex));
    }, [page])
    return <>
        {loading ? (
            <div>Loading Results ...</div>
        ) : (
            error ? <div>{error}</div> :
                (
                    <div className="table_wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(
                                    filteredEmployees.map((user: any) => (
                                        <tr key={user?.id}>
                                            <td>{user?.id}</td>
                                            <td>{user?.name}</td>
                                            <td>{user?.email}</td>
                                            <td>{user?.role}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {total > 10 && <div>
                            <div className="pagination_btns">
                                <button onClick={() => handlePaginatedData(page - 1)}>Previous</button>
                                <span>{page}</span>
                                <button onClick={() => handlePaginatedData(page + 1)}>Next</button>
                            </div>
                        </div>}
                    </div>
                )
        )}
    </>
}
export default EmployeeTable;