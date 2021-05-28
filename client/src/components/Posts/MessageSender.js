import React, {useState} from 'react'
import '../../componentsStyles/MessageSender.css'
import {Avatar} from "@material-ui/core";
import VideocamIcon from '@material-ui/icons/Videocam';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

import firebase from 'firebase';
import db from '../../Firebase/firebase';

function MessageSender({user}) {
    
    const [input, setInput] = useState('');
    const [imageUrl, setImageUrl] = useState('')

    const handleSubmit = e =>{
        e.preventDefault();
     
        db.collection('posts').add({
            message: input,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            profilePic: user?.avatar,
            username: user?.name,
            image: imageUrl,
        })
        // some clever db stuff

        setInput('')
        setImageUrl('')
    }
    return (
        <div className="messageSender">
            <div className="messageSender_top">
                <Avatar src = {user?.avatar}/>
                <form>
                    <input value = {input} onChange={(e) => setInput(e.target.value)} className = "messageSender_input" placeholder= {`Whats on your mind, ${user?.name}`} />
                    <input value = {imageUrl} onChange = {(e) => setImageUrl(e.target.value) }placeholder="Image URL (Optional)" />
                    <button disabled = { !input && !imageUrl } onClick={handleSubmit} type="submit"> Hidden submit</button>
                </form>
            </div>

            {/*<div className="messageSender_bottom">
                <div className="messageSender_option">
                    <VideocamIcon style= {{color : 'red'}}/>
                    <h3>Live Video</h3>
                </div>

                <div className="messageSender_option">
                    <PhotoLibraryIcon style= {{color : 'green'}}/>
                    <h3>Feeling/Activity</h3>
                </div>

                <div className="messageSender_option">
                    <InsertEmoticonIcon style= {{color : 'orange'}}/>
                    <h3>Photo/Video</h3>
                </div>
            </div> */}
             
        </div>
    )
}

export default MessageSender