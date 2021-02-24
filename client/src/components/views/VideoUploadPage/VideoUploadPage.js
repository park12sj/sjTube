import React, {useState} from 'react';
import {Typography, Button, Form, message, Input} from 'antd';
import {PlusOutlined} from '@ant-design/icons'
import Dropzone from 'react-dropzone';
import TextArea from 'antd/lib/input/TextArea';
import Axios from 'axios'
import {useSelector} from 'react-redux'

const {Title} = Typography;

const PrivateOption = [
    {value:0, label:"Private"},
    {value:1, label:"Public"}
]

const CategoryOption = [
    {value:0, label:"Film & Animation"},
    {value:1, label:"Auto & Vehecles"},
    {value:2, label:"Music"},
    {value:3, label:"Pets & Animals"}
]

function VideoUploadPage(props){
    const user = useSelector(state=>state.user)

    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Animation")

    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onTitleChange=(e)=>{
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange=(e)=>{        
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange=(e)=>{
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange=(e)=>{
        setCategory(e.currentTarget.value)
    }

    const onSubmit = (e)=>{
        e.preventDefault();

        const variable={
            writer:user.userData._id,
            title:VideoTitle,
            description:Description,
            privacy:Private,
            filePath:FilePath,
            category:Category,
            duration:Duration,
            thumbnail:ThumbnailPath
        }

        Axios.post('/api/video/uploadVideo', variable)
        .then(response=>{
            if(response.data.success){
                message.success('success upload')
                setTimeout(()=>{
                    props.history.push('/')

                }, 3000)
            }else{
                alert('fail upload video')
            }
        })
    }

    const onDrop = (files)=>{
        let formData = new FormData()
        const config = {
            header: { 'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0])

        Axios.post('/api/video/uploadfiles', formData, config)
        .then(response => {
            if(response.data.success){
                let variable={
                    url:response.data.filePath,
                    filename:response.data.fileName
                }

                setFilePath(response.data.url)

                Axios.post('/api/video/thumbnail', variable)
                .then(response =>{
                    if(response.data.success){
                        setDuration(response.data.fileDuration)
                        setThumbnailPath(response.data.thumbsFilePath)
                    }else{
                        alert('fail gen thumbnail')
                    }
                })
            }else{
                alert('upload fail')
            }
        })
    }

    return (
        <div style={{ maxWidth:'700px', margin:'2rem auto'}}>
            <div style={{textAlign:'center', marginBottom:'2rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit = {onSubmit}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <Dropzone
                        onDrop = {onDrop}
                        multiple = {false}
                        maxsize = {800000000}>
                        {({getRootProps, getInputProps}) =>(
                            <section>
                                <div style={{width:'300px', height:'240px', border:'1px solid lightgray', display:'flex',
                                alignItems:'center', justifyContent:'center'}} {...getRootProps()}>
                                    <Input {...getInputProps()}/>
                                    <PlusOutlined style={{fontSize:'3rem'}}/>
                                </div>
                            </section>
                        )}
                    </Dropzone>

                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt='thumbnail'/>
                        </div>
                    }
                </div>

                <br/>
                <br/>
                <label>Title</label>
                <br/>
                <input 
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br/>
                <br/>
                <label>Description</label>
                <TextArea 
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br/>
                <br/>

                <select onChange={onPrivateChange}>
                    {PrivateOption.map((item,index)=>(
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br/>
                <br/>

                <select onChange={onCategoryChange}>
                    {CategoryOption.map((item,index)=>(
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br/>
                <br/>

                <Button type='primary' size='large' onClick={onSubmit}>
                    submit
                </Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage