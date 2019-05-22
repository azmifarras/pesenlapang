import React, { Component } from 'react';
import firebase, { storage } from 'firebase';
class ImageUpload extends Component {
    constructor(props){
        super(props);
        this.state = { 
            image: null,
            url: ''
         }
        this.handleChange = this.handleChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    handleChange = e => {
        if(e.target.files[0]){
            const image = e.target.files[0];
            this.setState(() =>({image}));
        }
    }
    handleUpload = () =>{
        const {image} = this.state;
        const uploadTask = firebase.storage().ref(`images/${image.name}`).put(image);
        uploadTask.on('state_changed',
        (snapshot) => {

        },
        (error) => {
            console.log(error);
        },
        ()=> {
            firebase.storage().ref('images').child(image.name).getDownloadURL().then(url => {
                console.log(url);
                this.setState({url});
            })
        });
    }
    render (){    
        console.log(this.state.image);
        const style= {
            height: '100',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: 250            
        };
        return (
            <div style={style}>
                <input type="file" onChange={this.handleChange}/>
                <button onClick={this.handleUpload}>Upload</button>
                <br/>
                <img src={this.state.url || 'http://via.placeholder.com/350x150'} alt="Uploaded Image" height="150" width="350" /> 
            </div>
        )
    }
}

export default ImageUpload;