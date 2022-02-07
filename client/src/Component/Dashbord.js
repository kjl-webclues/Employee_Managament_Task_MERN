import React, {useEffect, useState } from 'react';
import { NavLink} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_User, delete_User} from '../Actions/userAction';
import { Pagination } from '@material-ui/lab';
import debounce from 'lodash.debounce';

const Dashbord = () => {

    //////////////////////////////////// useState Start /////////////////////////

    const [request, setRequest] = useState(''); //For Searching 
    const [page, setPage] = useState(1); //For Pagination
    const [sort, setSort] = useState('ascending')//For Sorting
    //////////////////////////////////// useState End /////////////////////////

    ///////////////////////// For Maping Data /////////////////////////
    const userData = useSelector(state => state.userData);

    const pageNumber = useSelector(state => state.pageNumber);
    const LoginUser = useSelector(state => state.LoginUser);
    const DeleteUser = useSelector(state => state.DeleteUser);
    
    //////////////// Dispatch the Api Request ///////////////////
    const dispatch = useDispatch();
    
    //////////////// For Delete User Api ////////////////
    const deleteUser = (id) => {
        window.confirm("Are You Sure?")
            dispatch(delete_User(id))
    }

    //////////////// For Searching ////////////////
    const handleSearch = debounce((value) => {
        setPage(1)
        setRequest(value)
    }, 500)
    
    //////////////// For Get Request ////////////////
    useEffect(() => {
        dispatch(get_User(page,sort,request))        
    }, [page, sort, request, dispatch, DeleteUser])
    

    return (        
        <> 
            <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 my-1 text-center'>
                            <h1>{ LoginUser && (`Welcome ${LoginUser.name}`)}</h1>            
                        </div>
                    </div>                    
            </div>

            <div className='searchbar'>
                <input type="search" placeholder='Search Here...' onChange={(e) => handleSearch(e.target.value)} />        
            </div>
            
            <div>                    
                <button onClick={() => setSort("ascending")}>Ascending</button>&nbsp;
                <button onClick={() => setSort("descending")}>Decsending</button>
            </div> 
            
            <hr />
            {
                pageNumber ? (<><div className='col-md-12  mx-auto'>
                        <table className='table table-hover'>
                                <thead className='text-black text-center'>
                                    <tr>                                        
                                        <th scope='col'>Name</th>
                                        <th scope='col'>Phone</th>
                                        <th scope='col'>Profession</th>
                                        <th scope='col'>Salary1st</th>
                                        <th scope='col'>Salary2nd</th>
                                        <th scope='col'>Salary3rd</th>
                                        <th scope='col'>TotalSalary</th>
                                        <th scope='col'>Email</th>
                                        <th scope='col'>Password</th>
                                        <th scope='col'>Confirmpassword</th>
                                        <th scope='col'>Country</th>                                        
                                        <th scope='col'>State</th>
                                        <th scope='col'>City</th>
                                        <th scope='col'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userData.map((elem) => {
                                        return (
                                            <tr key={elem._id}>                                        
                                                <td>{elem.name}</td>
                                                <td>{elem.phone}</td>
                                                <td>{elem.profession}</td>
                                                <td>{elem.salary1}</td>
                                                <td>{elem.salary2}</td>
                                                <td>{elem.salary3}</td>
                                                <td>{elem.salary1 + elem.salary2 + elem.salary3}</td>
                                                <td>{elem.email}</td>
                                                <td>{elem.password}</td>
                                                <td>{elem.confirmpassword}</td>
                                                <td>{elem.country && elem.country.map((i => i.countryName))}</td>
                                                <td>{elem.state && elem.state.map((i => i.stateName))}</td>
                                                <td>{elem.city && elem.city.map((i => i.cityName))}</td>
                                                <td><NavLink to={`/editUser/:?id=${elem._id}`}><button className='editbtn'>Edit</button></NavLink> &nbsp;
                                                <button className='deletebtn' onClick={() => deleteUser(elem.email)}>Delete</button></td>                                                        
                                            </tr> 
                                        )
                                    })}
                                </tbody>
                        </table>
                        <Pagination
                            count={pageNumber}                            
                            shape='rounded'
                            variant='outlined'                    
                            onChange={(event, value) => { setPage(value) }}
                        />
                </div></>) : (<>
                        <div><h1>NO DATA FOUND</h1></div>
                </>)
            }            
        </>
    )
}
export default Dashbord