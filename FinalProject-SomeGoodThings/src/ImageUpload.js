import React, { useState } from 'react';
import { Button } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import firebase from "firebase";
import { storage, db } from "./firebase";
import './ImageUpload.css';

const BlueButton = withStyles({
    root: {
      background: '#147ce5',
      '&:hover': {
        background: '#147ce5'
      },
      borderRadius: 30,
      border: 0,
      color: 'white',
      height: 48,
      padding: '0 35px',
      margin: '20px 10px'
    },
    label: {
      textTransform: 'none',
      fontSize: 20, 
      '@media (max-width: 750px)': {
        fontSize: 16,
      },
    },
  })(Button);

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // upload progress
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // error function
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post image to db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            }
        )
    }

    return (
        <div className="imageupload">
            
            <textarea className="imageupload__caption" type="text" placeholder='Enter your story...' onChange={event => setCaption(event.target.value)} value={caption}/>
            <p className="imageupload__prompt"><strong>Would you mind sharing a photo of it?</strong></p>
            <div className="imageupload__buttonwrap">
                <input className="imageupload__choosefile" type="file" onChange={handleChange} />
            </div>
            <progress className="imageupload__progress" value={progress} max="100" />
            <center><BlueButton onClick={handleUpload}>
                <b>Submit</b>
            </BlueButton></center>
        </div>
    )
}

export default ImageUpload
