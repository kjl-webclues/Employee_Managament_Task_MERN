import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { delete_MultipleFile, delete_UploadFile, get_UploadFile, set_Loader, upload_Files } from "../Actions/userAction";
import { Pagination } from "@material-ui/lab";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
toast.configure()


const FileUpload = () => {
    /////////////////////////// For File Upload ///////////////////////////
    const [multiInputState, setMultiInputState] = useState("asc");
    const [loaderFile, setLoaderFile] = useState(false)

    const [checkboxDelete, setCheckboxDelete] = useState([])


    /////////////////////////// For Dispatch File ///////////////////////////
    const dispatch = useDispatch()

    /////////////////////////// For Map Uploaded FileList ///////////////////////////
    const uploadFile = useSelector(state => state.uploadFile)

    const LoginUser = useSelector(state => state.LoginUser);

    /////////////////////////// For Set Loader for UploadFile ///////////////////////////
    const loader = useSelector(state => state.loader)

    /////////////////////////// Pagination for UploadFile ///////////////////////////
    const FilePage = useSelector(state => state.FilePage)
    const [pageNumber, setPageNumber] = useState(1)

    const DeleteUser = useSelector(state => state.DeleteUser)

    //For Multiple File Upload
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
            setLoaderFile(true)
            console.log("loder", loader);
            event.target.reset();
            const formData = new FormData();
            for (let i = 0; i < 5; i++) {
                formData.append("multi-files", multiInputState[i]);
            }
            dispatch(upload_Files(formData))
            setMultiInputState('');
        }
    }

    /////////////////////////// For Single Delete File ///////////////////////////
    const handleDeleteFile = (id) => {
        window.confirm("Are You Sure?")
        setLoaderFile(true)
        setCheckboxDelete([])
        dispatch(set_Loader())
        dispatch(delete_UploadFile(id))
    }
    
    /////////////////////////// For Multiple Delete File ///////////////////////////
    const handleMultiDelete = (e) => {
        if (checkboxDelete === null) {
            toast.error("Please Select File", {position: toast.POSITION.TOP_RIGHT, autoClose: 2000})
            e.preventDefault();
        } else {
        e.preventDefault()
        window.confirm("Are You Sure")
        dispatch(set_Loader());
        dispatch(delete_MultipleFile(checkboxDelete));
        }
    }

    const handleChange = (id) => {
        console.log(id);
        if (checkboxDelete.includes(id)) {
            const checkedArray = checkboxDelete.filter((i) => {
                return i !== id
            })
            setCheckboxDelete(checkedArray)
        } else {
             setCheckboxDelete([...checkboxDelete, id])
        }
    }

/////////////////////////// For Get File ///////////////////////////
    useEffect(() => {
        dispatch(get_UploadFile(pageNumber))
    }, [ loader, pageNumber,DeleteUser, dispatch])
    

/////////////////////////// For Set Loader ///////////////////////////
    useEffect(() => {
        if (loader === false || DeleteUser === true) {
            setLoaderFile(false)
            dispatch(set_Loader())
        }
    }, [loader, DeleteUser, dispatch])

    return (
        <>
            <h1>{ LoginUser && (`Welcome ${LoginUser.name}`)}</h1>
            <form onSubmit={handleSubmit}>
                <div className="fileupload">
                    {
                        loaderFile ? (
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

            <form onSubmit={handleMultiDelete}>
                <div>
                    <button type='submit' >Delete Selected File</button>
                </div>
            </form>

            {
                loaderFile ? (                     
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
                                        <h6>
                                            <input type='checkbox' onChange={() => handleChange(elem.public_Id)} />                                            
                                            <img width='4%' src='https://icons.iconarchive.com/icons/graphicloads/filetype/128/pdf-icon.png' alt='PDF' />
                                            {elem.fileName}<br />
                                            <button className="FileDelete" onClick={() => handleDeleteFile(elem.public_Id)}>Delete</button>
                                            </h6>
                                    </>
                                ) : null
                                }
                                {elem.fileType === ".jpg" || elem.fileType === ".jpeg" || elem.fileType === ".png" || elem.fileType === ".gif" ? (
                                    <>
                                        <h6>
                                            <input type='checkbox'  onChange={() => handleChange(elem.public_Id) } />                                            
                                            <img width='4%' src={elem.filePath} alt='JPG' />
                                            {elem.fileName}<br />
                                            <button className="FileDelete" onClick={() => handleDeleteFile(elem.public_Id)}>Delete</button></h6>
                                    </>
                                ) : null
                                }
                                {elem.fileType === ".xml" ? (
                                    <>
                                        <h6>
                                            <input type='checkbox'  onChange={() =>  handleChange(elem.public_Id) } />                                            
                                            <img width='4%' src='https://as1.ftcdn.net/v2/jpg/04/46/40/84/1000_F_446408465_aqlGBK2DsZTvhkcDqV6rkaOvvEMtVmau.jpg' alt='XML' />
                                            {elem.fileName}<br />
                                            <button className="FileDelete" onClick={() => handleDeleteFile(elem.public_Id)}>Delete</button></h6>
                                    </>
                                ) : null
                                }
                                {elem.fileType === ".txt" ? (
                                    <>
                                        <h6>
                                            <input type='checkbox'  onChange={() =>  handleChange(elem.public_Id) } />                                            
                                            <img width='4%' src='https://cdn-icons.flaticon.com/png/512/202/premium/202313.png?token=exp=1644907668~hmac=a423c46355a1bdfbeede81a7ebb6cde2' alt='TXT' />
                                            {elem.fileName}<br />
                                            <button className="FileDelete" onClick={() => handleDeleteFile(elem.public_Id)}>Delete</button></h6>
                                    </>
                                ) : null
                                }
                                {elem.fileType === ".doc" || elem.fileType === ".docx" ? (
                                    <>
                                        <h6>
                                            <input type='checkbox'  onChange={() =>  handleChange(elem.public_Id) } />                                            
                                            <img width='4%' src='https://cdn4.vectorstock.com/i/1000x1000/62/88/monochrome-round-doc-file-icon-vector-5106288.jpg' alt='TXT' />
                                            {elem.fileName}<br />
                                            <button className="FileDelete" onClick={() => handleDeleteFile(elem.public_Id)}>Delete</button></h6>
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