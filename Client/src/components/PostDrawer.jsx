import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import RadioGroup from './RadioGroup';
import IconButton from '@mui/material/IconButton';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import useImgPreview from '../hooks/handleImgPreview'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

export default function ResponsiveDialog({ createPost }) {
    const [open, setOpen] = React.useState(false);
    const [img, setImg] = React.useState("");
    const [imgFile, setImgFile] = React.useState(null);

    const [caption, setCaption] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [postType, setPostType] = React.useState("Post");
    const [date, setDate] = React.useState(dayjs('2022-04-17'));
    const [time, setTime] = React.useState(dayjs('2022-04-17T15:30'));
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const imgRef = React.useRef(null);
    const [closeIconVisible, setCloseIconVisible] = React.useState(false);
    const { handleMediaChange, mediaUrl, isVideo, clearMedia } = useImgPreview(null, null, setCloseIconVisible);

    let navigate = useNavigate();

    const token = localStorage.getItem('token'); // Make sure 'token' is the string key
    let user = useSelector((state) => state.user).user;
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        clearMedia();
        imgRef.current.value=null;
        setOpen(false);
    };
    const handleRemovePreview = () => {
        console.log("remove img clicked handle");
        setCloseIconVisible(false)
        clearMedia();
        imgRef.current.value=null;
       }
    const handleSubmit = async (e) => {
        console.log("postType inside handleSubmit --> "+postType);
        e.preventDefault();
        let cloudinaryData={
            url: undefined,
            public_id:undefined
        }
        let cloudinaryResponse ={
            ok:"ok"
        }
        if(mediaUrl){
            const formData = new FormData(e.target);
            const data = new FormData();
            formData.forEach((value, key) => {
                if (key == 'img') {
                    setImg(value);
                    data.append('file', value);
                }
            });
    
            data.append('upload_preset', 'Social-App');
            data.append('cloud_name', "anayak")
    
             cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/anayak/image/upload', {
                method: 'POST',
                body: data
            });
            if (!cloudinaryResponse.ok) {
                throw new Error('Failed to upload image postDrawer');
            }
             cloudinaryData = await cloudinaryResponse.json();
        }
        try { 
            const postData = {
                postType: postType,
                data: caption,
                img: {
                    url: cloudinaryData.url,
                    id: cloudinaryData.public_id
                },
                user: user._id
            };
            console.log(" ************ post data is "+ JSON.stringify(postData))
            if (postType == 'Event') {
                postData.date= date.toISOString();
                postData.time= time.toISOString();
                postData.heading=caption;
                postData.data=desc
            }

            // Second fetch: Create post
            if (cloudinaryResponse.ok) {
                const createPostResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/post/create-post`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(postData)
                });

                if (!createPostResponse.ok) {
                    throw new Error('Failed to create post');
                }

                const createPostData = await createPostResponse.json();
                console.log("created Post Response data --> " + JSON.stringify(createPostData.post));
                createPost(createPostData.post);
            }
            clearMedia();
            handleClose();
            if (postType == "Event") {
                console.log(postData)
                navigate('/events')
            }
        } catch (error) {
            console.log("error while posting post : " + error);
        }
    };
    React.useEffect(()=>{
        console.log("postType value in useEffect --> "+postType);
    },[postType])
    return (
        <React.Fragment>
            <Button aria-label="share" variant="contained" 
                    onClick={handleClickOpen}
                    sx={{marginLeft:"5px", display: "flex", alignItems: "center" }}
            >
               share <KeyboardArrowRightIcon  aria-label="arrow right" aria-hidden="false"/>
            </Button>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-label="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" sx={{ textAlign: "center" }}>
                    {"Create New Post"}
                </DialogTitle>
                <DialogContent>
                    <form action="api/v1/user/post/create-post" method="post" id="post-form" onSubmit={handleSubmit}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box >
                                <RadioGroup required setPostType={setPostType} />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: postType == "Event" ? "space-evenly" : "flex-start" }}>
                                <IconButton aria-label="upload button" onClick={() => imgRef.current.click()} sx={{ padding: "8px", backgroundColor: "rgba(210, 210, 210, 0.599)", borderRadius: "10px", margin: "15px 5px", width: "30px" }}>
                                    <input type="file" name="img" id="file-upload" placeholder="hello" ref={imgRef} hidden onChange={handleMediaChange} />
                                    <CameraAltIcon aria-label="upload image" aria-hidden="false" sx={{ height: "15px", width: "15px" }}  />
                                </IconButton>
                                {
                                   postType === 'Event' && (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Event Date"
                                            value={date}
                                            onChange={(newValue) => setDate(newValue)}
                                        />
                                        <TimePicker
                                            label="Event Time"
                                            value={time}
                                            onChange={(newValue) => setTime(newValue)}
                                        />
                                    </LocalizationProvider>
                                )}
                            </Box>
                            <TextField
                                id="caption"
                                name="caption"
                                label="Caption"
                                multiline
                                maxRows={4}
                                onChange={(e) => setCaption(e.target.value)}
                                sx={{ marginBottom: "10px" }}
                            />
                            {
                                postType == 'Event' ?
                                    <TextField
                                        id="description"
                                        name="description"
                                        label="Description"
                                        multiline
                                        maxRows={4}
                                        onChange={(e) => setDesc(e.target.value)}
                                        sx={{ marginBottom: "10px" }}
                                    />
                                    :
                                    null
                            }
                        </Box>
                    </form>
                    <hr />
                    <Box sx={{ position: "relative" }}>
                        {isVideo ? <video src={mediaUrl} width="400"></video>
                            : <img src={mediaUrl} width="400" style={{ backgroundSize: "contain" }} />}

                        {closeIconVisible && (
                            <CloseIcon
                                sx={{
                                    color: 'black',
                                    backgroundColor: 'rgba(150, 150, 200, 0.897)',
                                    borderRadius: '45%',
                                    fontSize: '30px',
                                    height: '30px',
                                    position: 'absolute',
                                    top: '1%',
                                    right: '2%',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    handleRemovePreview();
                                }}
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button aria-label="cancel post" variant="outlined"  onClick={handleClose}>
                        close
                    </Button>
                    <Button aria-label="send post" variant="outlined" type="submit" form="post-form">
                        post
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
