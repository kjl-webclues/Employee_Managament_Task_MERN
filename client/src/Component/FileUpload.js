import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { delete_UploadFile, get_UploadFile, set_Loader, upload_Files } from "../Actions/userAction";
import { Pagination } from "@material-ui/lab";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
toast.configure()

const FileUpload = () => {
    /////////////////////////// For File Upload ///////////////////////////
    const [multiInputState, setMultiInputState] = useState();
    const [loaderFile, setLoaderFile] = useState(false)

    /////////////////////////// For Dispatch File ///////////////////////////
    const dispatch = useDispatch()

    /////////////////////////// For Map Uploaded FileList ///////////////////////////
    const uploadFile = useSelector(state => state.uploadFile)

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
            console.log("loder", loader );
            event.target.reset();
            const formData = new FormData();
        for (let i = 0; i < 5; i++) {
            formData.append("multi-files", multiInputState[i]);
        }
            dispatch(upload_Files(formData))
            setMultiInputState('');
        }
    }

    const handleDeleteFile = (id) => {
        console.log('delete_UploadFile', delete_UploadFile);
        dispatch(delete_UploadFile(id))
    } 

    useEffect(() => {
        dispatch(get_UploadFile(pageNumber))
    }, [multiInputState,loader, pageNumber, DeleteUser, dispatch])

    useEffect(() => {
        if (loader === false) {
            setLoaderFile(false)
            dispatch(set_Loader())
        }
    }, [loader, DeleteUser, dispatch])

    return (
        <>
            <h1>File Upload</h1>
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

            {
                loaderFile ? (                     
                        <div className='col-md-15 my-3 text-center'>
                        <h1>Loading ...</h1>                        
                        </div>                    
                     ) : 
                        null                        
            }
            {/* <div>
                {
                    uploadFile[0] && uploadFile[0].getPage.length > 0 && uploadFile[0].getPage.map((elem) => {
                        return (
                            <>
                                <div className="mapFile">
                                <div key={elem._id}>
                                    {elem.fileName}
                                    <button className='deletebtn'>Delete</button>
                                </div>
                            </div>  
                            </>
                        )
                    }) 
                }
            </div> */}

            <div>
                {
                    uploadFile[0] && uploadFile[0].getPage.length > 0 && uploadFile[0].getPage.map((elem) => {
                        return (
                            <>
                                {elem.fileType === ".pdf" ? (
                                    <>
                                        <h6><img width='4%' src='https://icons.iconarchive.com/icons/graphicloads/filetype/128/pdf-icon.png' alt='PDF' />
                                        {elem.fileName}
                                        <button className="FileDelete" onClick={() => handleDeleteFile(elem.public_Id)}>Delete</button></h6>                                        
                                    </>
                                        ): null
                                }                                
                                {elem.fileType === ".jpg" || elem.fileType === ".jpeg" || elem.fileType === ".png" || elem.fileType === ".gif" ? (
                                            <>
                                                <h6><img width='4%' src={elem.filePath} alt='JPG' />
                                                {elem.fileName}
                                                <button className="FileDelete" onClick={() => handleDeleteFile(elem.public_Id)}>Delete</button></h6>                                                                                
                                            </>
                                        ): null
                                }                              
                                {elem.fileType === ".xml" ? (
                                            <>
                                                <h6><img width='4%' src='https://as1.ftcdn.net/v2/jpg/04/46/40/84/1000_F_446408465_aqlGBK2DsZTvhkcDqV6rkaOvvEMtVmau.jpg' alt='XML' />
                                                {elem.fileName}
                                                <button className="FileDelete" onClick={() => handleDeleteFile(elem.public_Id)}>Delete</button></h6>                                        
                                            </>
                                        ): null
                                }
                                {elem.fileType === ".txt" ? (
                                            <>
                                                <h6><img width='4%' src='https://cdn-icons.flaticon.com/png/512/202/premium/202313.png?token=exp=1644907668~hmac=a423c46355a1bdfbeede81a7ebb6cde2' alt='TXT' />
                                                {elem.fileName}
                                                <button className="FileDelete" onClick={() => handleDeleteFile(elem.public_Id)}>Delete</button></h6>                                                                                
                                            </>
                                        ): null
                                }
                                {elem.fileType === ".doc" || elem.fileType === ".docx" ? (
                                            <>
                                                <h6><img width='4%' src='https://cdn4.vectorstock.com/i/1000x1000/62/88/monochrome-round-doc-file-icon-vector-5106288.jpg' alt='TXT' />
                                                {elem.fileName}
                                                <button className="FileDelete" onClick={() => handleDeleteFile(elem.public_Id)}>Delete</button></h6>                                                                               
                                            </>
                                        ): null
                                }
                                
                            </>
                        )
                    }) 
                }
                
            </div>

            {/* <div>
                {uploadFile.map((elem) => {
                    return (
                        <>
                            <div className="mapFile">
                                <div key={elem._id}>
                                    {elem.fileName}
                                    <button className='deletebtn'>Delete</button>
                                </div>
                            </div>                                
                        </>
                    )                        
                })}
            </div> */}

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