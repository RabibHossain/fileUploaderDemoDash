import React, { useEffect, useRef, useState } from 'react'
import Layouts from '../components/Layouts';

export default function Upload() {
    const fileRef = useRef();
    const API_URL = "http://127.0.0.1:8000/api";
    const [batchId, setBatchId] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    function handleForm(e) {
        e.preventDefault();
        if (isLoading) return;
        const inputFile = fileRef.current;
        const file = inputFile.files[0];
        if (!file) return;        
        const formData = new FormData();
        formData.append("csvFile", file);
        setIsLoading(true);
        fetch(`${API_URL}/data-upload`, { method: "post", body: formData })
            .then((res) => res.json())
            .then((data) => {
                setBatchId(data.id);
                setIsLoading(false);
            });
    }

    const [batchDetail, setBatchDetail] = useState({});

    function batchDetails(id = null) {
        const currentBatch = id ?? batchId
        fetch(`${API_URL}/batch?id=${currentBatch}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(progressInterval.current);
                if (data.progress > 30) {
                    clearInterval(progressInterval.current);
                }
                setBatchDetail(data);
            });            
    }

    const progressInterval = useRef("");

    function updateProgress()
    {
        if (progressInterval.current !== "") return;
        progressInterval.current = setInterval(() => {
            if (batchId != null)
                batchDetails();  
        }, 2000);
    }

    useEffect(() => {
        updateProgress();     
    }, [batchId])
    
    useEffect(() => {
        fetch(`${API_URL}/batch/pending`)
            .then((res) => res.json())
            .then((data) => setBatchId(data.id));
    }, []) ;

    return (
        <Layouts>
            {batchDetail.progress != undefined && (
                <section>
                    <p>Data upload ongoing ({batchDetail.progress})% </p>
                    <div className="w-full h-4 rounded-lg shadow-inner border">
                        <div className="bg-blue-700 w-full h-4 rounded-lg"
                            style={{width: `${batchDetail.progress}%`}}
                        >

                        </div>
                    </div>
                    {/* <progress value={batchDetail.progress} max="100"></progress> */}
                </section>                
            )}

            {batchDetail.progress == undefined &&
                <section>            
                    <h1 className="text-xl text-gray-800 text-center mb-5">Choose a file to upload</h1>  
                    <form className="border rounded p-4" onSubmit={handleForm}>
                        <input type="file" ref={fileRef} />
                        <input type="submit" 
                        value="Submit" 
                        className={`px-4 py-2 bg-gray-700 rounded text-white ${
                            isLoading ? "bg-gray-400 outline-none" : "bg-gray-700"
                        }`}/>
                    </form>  
                </section>
            }
        </Layouts>
        
    )
}
