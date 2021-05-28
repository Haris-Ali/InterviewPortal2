import React, { useEffect, useState } from 'react'
import axios from 'axios'
function ApiCall() {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([]);
    const apiCall = async ()=>{
        const options = {
          method: 'POST',
          url: 'https://facial-emotion-recognition.p.rapidapi.com/cloudVision/facialEmotionRecognition',
          params: {
            source: 'https://images.unsplash.com/photo-1527631120902-378417754324?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
            sourceType: 'url'
          },
          headers: {
            'content-type': 'application/json',
            'x-rapidapi-key': '079c64180bmsh62991ef0e2ce12ep108159jsn4683640dc701',
            'x-rapidapi-host': 'facial-emotion-recognition.p.rapidapi.com'
          },
          data: {
            source: 'https://images.unsplash.com/photo-1527631120902-378417754324?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
            sourceType: 'url'
          }
        };
        setLoading(true)
        await axios.request(options).then(function (response) {
            console.log(response.data);
            setData(response.data);
            setLoading(false)
        }).catch(function (error) {
            console.error(error);
        });
        
        // var options = {
        //     method: 'GET',
        //     url: 'https://twinword-emotion-analysis-v1.p.rapidapi.com/analyze/',
        //     params: {
        //     text: 'After living abroad for such a long time, seeing my family was the best present I could have ever wished for.'
        //     },
        //     headers: {
        //     'x-rapidapi-key': '079c64180bmsh62991ef0e2ce12ep108159jsn4683640dc701',
        //     'x-rapidapi-host': 'twinword-emotion-analysis-v1.p.rapidapi.com'
        //     }
        // };
        // axios.request(options).then(function (response) {
        //     console.log("hey")
        //     console.log(response.data);
        // }).catch(function (error) {
        //     console.error(error);
        //});
    }
    useEffect(()=> {
        apiCall();      
    }, [])
    return (
        <div>
            {loading ? (
                <>
                    <h1>Loading...</h1>
                </>
            ): (
                <>
                    <h1> Calling api..</h1> 
                </>
            )}
           
        </div>
    )
}

export default ApiCall
