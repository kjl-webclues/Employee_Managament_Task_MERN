import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { delete_MultipleFile, delete_UploadFile, get_UploadFile, set_Loader, upload_Files } from "../Actions/userAction";
import { Pagination } from "@material-ui/lab";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import Checkbox from "./Checkbox";
toast.configure()


const FileUpload = () => {
    /////////////////////////// For File Upload ///////////////////////////
    const [multiInputState, setMultiInputState] = useState();

    /////////////////////////// useState   //////////////////////////
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);

    /////////////////////////// For Dispatch File ///////////////////////////
    const dispatch = useDispatch()

    /////////////////////////// For Map Uploaded FileList ///////////////////////////
    const uploadFile = useSelector(state => state.uploadFile)

    /////////////////////////// For Login Authenticate User ///////////////////////////
    const LoginUser = useSelector(state => state.LoginUser);

    /////////////////////////// For Set Loader for UploadFile ///////////////////////////
    const loader = useSelector(state => state.loader)

    /////////////////////////// Pagination for UploadFile ///////////////////////////
    const FilePage = useSelector(state => state.FilePage)
    const [pageNumber, setPageNumber] = useState(1)

    const [dropdown, setDropdown] = useState(5)


    ///////////////////////////// For Multiple File Upload ///////////////////////////
    const multipleFileChange = (e) => {
        setMultiInputState({ ...multiInputState, ...e.target.files })
    }
    /////////////////////////// Form Submit Event ///////////////////////////
    const handleSubmit = (event) => {
        if (!multiInputState) {
            event.preventDefault()
            toast.warning("Please Choose File", { position: toast.POSITION.TOP_LEFT, autoClose: 2000 });
        } else {
            /////////////////////////// Form Submit Event ///////////////////////////
            event.preventDefault()

            dispatch(set_Loader())

            const formData = new FormData();
            for (let i = 0; i < 5; i++) {
                formData.append("multi-files", multiInputState[i]);
            }
            event.target.reset();
            dispatch(upload_Files(formData))
            setMultiInputState('');
        }
    }

/////////////////////////// For Single Delete File ///////////////////////////
    const handleDeleteFile = (id) => {
        if (window.confirm("Are You Sure?")) {
            setIsCheck([])

            dispatch(set_Loader())

            dispatch(delete_UploadFile(id))
        }
    }
    
/////////////////////////// For Multiple Delete File ///////////////////////////
    const handleMultiDelete = (e) => {
        if (isCheck.length === 0) {
            toast.error("Please Select File", { position: toast.POSITION.TOP_RIGHT, autoClose: 2000 })
            e.preventDefault();            
        } else {
            if (window.confirm("Are You Sure")) {
                dispatch(set_Loader());
                dispatch(delete_MultipleFile(isCheck))
            }            
        }
    }

/////////////////////////// Check and Uncheck All Checkbox ///////////////////////////
    const handleSelectAll = (e) => {
        console.log("!isCheckAll", !isCheckAll);
        setIsCheckAll(!isCheckAll);
        setIsCheck(uploadFile[0] && uploadFile[0].getPage.length > 0 && uploadFile[0].getPage.map((i) => i._id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    const handleClick = (e) => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, id]);
        setIsCheckAll(false)
        console.log("checked", checked);
        if (!checked) {
            setIsCheck(isCheck.filter((item) => item !== id));
        }
    };
    console.log("isCheck", isCheck);

/////////////////////////// For Dropdown Pagination ///////////////////////////
    const handleDropdown = (e) => {
        setDropdown(e.target.value)
    }

    
/////////////////////////// For Get File ///////////////////////////
    useEffect(() => {
        dispatch(get_UploadFile(pageNumber,dropdown))
        setIsCheckAll(false)
    }, [loader, pageNumber, dropdown, dispatch])
    
/////////////////////////// Return Function Start ///////////////////////////
    return (
        <>
            <h1>{ LoginUser && (`Welcome ${LoginUser.name}`)}</h1>
            <form onSubmit={handleSubmit}>
                <div className="fileupload">
                    {
                        loader ? (
                            <>  
                                <input type='file' disabled onChange={(e) => multipleFileChange(e)} multiple></input>                                                                    
                                <button disabled >Upload</button>
                            </>
                        ) :(
                            <>
                                <input type='file' name='files' className="multi_file" onChange={(e) => multipleFileChange(e)} multiple></input>
                                <button type="submit" className='signIn'>Upload</button>                                    
                            </>)
                    }
                </div>    
            </form>
            
            <div>
                {loader ? null :<button className="delete-select" onClick={()=>(handleMultiDelete()) }>Delete Selected File</button>}
                
                {loader ? null :<label class="checkbox-checked">
                        <Checkbox
                            type="checkbox"
                            name="selectAll"
                            id="selectAll"
                            handleClick={handleSelectAll}
                            isChecked={isCheckAll}
                        /><span class="label-text">Select All Checkbox</span>
                </label>}
                
                <select onClick={(e) => {handleDropdown(e)}}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="25">25</option>
                    <option value="30">30</option>
                </select>
            </div>
            
            {
                loader ? (                     
                    <div className='col-md-15 my-3 text-center'>
                        <h1>Loading ...</h1>                        
                        </div>                    
                     ) : 
                        null                        
            }            

            <div>
                {
                    uploadFile[0] && uploadFile[0].getPage.length > 0 && uploadFile[0].getPage.map((elem) => {
                        return (                            
                            <>  
                                {elem.fileType === ".pdf" ? (
                                    <>      
                                        <h6>{elem.fileName}</h6>
                                        <img width='4%' src='https://icons.iconarchive.com/icons/graphicloads/filetype/128/pdf-icon.png' alt='PDF' />                                        
                                        <Checkbox
                                            key={elem._id}
                                            type="checkbox"
                                            name={elem._id}
                                            id={elem._id}
                                            handleClick={handleClick}
                                            isChecked={isCheck.includes(elem._id)}
                                        />
                                        <button className="FileDelete" onClick={() => handleDeleteFile(elem.public_Id)}>Delete</button>
                                    </>
                                ) : null
                                }
                                {elem.fileType === ".jpg" || elem.fileType === ".jpeg" || elem.fileType === ".png" || elem.fileType === ".gif" ? (
                                    <>
                                        <h6>{elem.fileName}</h6>
                                        <img width='4%' src={elem.filePath} alt='JPG' />
                                        <Checkbox
                                            key={elem._id}
                                            type="checkbox"
                                            name={elem._id}
                                            id={elem._id}
                                            handleClick={handleClick}
                                            isChecked={isCheck.includes(elem._id)}
                                        />
                                        <button className="FileDelete" onClick={() => handleDeleteFile(elem.public_Id)}>Delete</button>
                                    </>
                                ) : null
                                }
                                {elem.fileType === ".xml" ? (
                                    <>      
                                        <h6>{elem.fileName}</h6> 
                                        <img width='4%' src='https://as1.ftcdn.net/v2/jpg/04/46/40/84/1000_F_446408465_aqlGBK2DsZTvhkcDqV6rkaOvvEMtVmau.jpg' alt='XML' />
                                        <Checkbox
                                            key={elem._id}
                                            type="checkbox"
                                            name={elem._id}
                                            id={elem._id}
                                            handleClick={handleClick}
                                            isChecked={isCheck.includes(elem._id)}
                                        />
                                        <button className="FileDelete" onClick={() => handleDeleteFile(elem.public_Id)}>Delete</button>
                                    </>
                                ) : null
                                }
                                {elem.fileType === ".txt" ? (
                                    <>
                                        <h6>{elem.fileName}</h6>
                                        <img width='4%' src='https://cdn-icons.flaticon.com/png/512/202/premium/202313.png?token=exp=1644907668~hmac=a423c46355a1bdfbeede81a7ebb6cde2' alt='TXT' />
                                        <Checkbox
                                            key={elem._id}
                                            type="checkbox"
                                            name={elem._id}
                                            id={elem._id}
                                            handleClick={handleClick}
                                            isChecked={isCheck.includes(elem._id)}
                                        />
                                        <button className="FileDelete" onClick={() => handleDeleteFile(elem.public_Id)}>Delete</button>
                                    </>
                                ) : null
                                }
                                {elem.fileType === ".doc" || elem.fileType === ".docx" ? (
                                    <>
                                        <h6>{elem.fileName}</h6>
                                        <img width='4%' src='https://cdn4.vectorstock.com/i/1000x1000/62/88/monochrome-round-doc-file-icon-vector-5106288.jpg' alt='TXT' />                                      
                                        <Checkbox
                                            key={elem._id}
                                            type="checkbox"
                                            name={elem._id}
                                            id={elem._id}
                                            handleClick={handleClick}
                                            isChecked={isCheck.includes(elem._id)}
                                        />
                                        <button className="FileDelete" onClick={() => handleDeleteFile(elem.public_Id)}>Delete</button>
                                    </>
                                ) : null
                                }    
                            </>
                        )
                    })                    
                }
                
            </div>            

            <div>
                
                <Pagination                
                    count={FilePage}                            
                    shape='rounded'
                    variant='outlined'                    
                    onChange={(event, value) => { setPageNumber(value) }}                    
                />                
            </div>            
        </>
    );
}
export default FileUpload