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
import { Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { MdOutlineClosedCaptionDisabled } from 'react-icons/md';

export default function UpdateDrawer({ post, allPosts, setPosts }) {
    console.log("update drawer --> " + JSON.stringify(post));
    console.log("****** all Events in Before Update--> " + JSON.stringify(allPosts))

    const [date, setDate] = React.useState(dayjs('2022-04-17'));
    const [time, setTime] = React.useState(dayjs('2022-04-17T15:30'));
    useEffect(() => {
        if (post.postType == 'Event') {
            setDate(dayjs(post.date));
            setTime(dayjs(post.time));
        }
    }, [])

    const [open, setOpen] = React.useState(false);
    const [postType, setPostType] = React.useState(post.postType);
    console.log("update drawer --> " + postType + "   comein type --> " + post.postType);
    const [imgFile, setImgFile] = React.useState(null);
    const [description, setDesc] = React.useState(post.data)
    const [caption, setCaption] = React.useState(post.postType == 'Event' ? post.heading : post.data);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const imgRef = React.useRef(null);
    const [closeIconVisible, setCloseIconVisible] = React.useState(post.img ? true : false);
    const { handleMediaChange, mediaUrl, isVideo, clearMedia, setMedia } = useImgPreview(post.img ? post.img.url : null, setImgFile, setCloseIconVisible)
    let postChanged = false;
    let postImgChanged = false;
    let user = useSelector((state) => state.user).user;
    const handleClickOpen = () => {
        setMedia(post.img ? post.img.url : null)
        setOpen(true);
    };
    const handleClose = () => {
        clearMedia();
        setOpen(false);
    };
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            let updatedPost = {};
            const token = localStorage.getItem('token'); // Make sure 'token' is the string key

            console.log("handle Submit called !")
            // if imgFile is null this means img is not changed so no need to upload
            // img in cloudinary just set newImgObj's imgUrl to post.img.url and 
            // imgId=post.img.id
            // else delete the post.img.id (previous img of post fom cloudinary) and upload the image and set newImgObj's imgUrl to return cloudinary img url and id
            let cloudinaryResponseStatus = false;
            if (imgFile) {
                postChanged = true;
                console.log("postChanged change to " + postChanged)
                const data = new FormData();
                data.append('file', imgFile);
                data.append('upload_preset', 'Social-App');
                data.append('cloud_name', "anayak");
                const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/anayak/image/upload', {
                    method: 'POST',
                    body: data
                });
                cloudinaryResponseStatus = cloudinaryResponse.ok;
                if (!cloudinaryResponse.ok) {
                    throw new Error('Failed to upload image');
                }

                const cloudinaryData = await cloudinaryResponse.json();
                updatedPost = {
                    postType: post.postType,
                    img: {
                        url: cloudinaryData.url,
                        id: cloudinaryData.public_id
                    },
                    data: post.postType == 'Event' ? description : caption
                }
            } else if (post.postType == 'Post') {
                console.log("inside post.postType " + postImgChanged)
                if (post.data !== caption) {
                    console.log("Inside post.data!==caption !")
                    postChanged = true;
                    updatedPost = {
                        postType: "Post",
                        img: post.img,
                        data: caption
                    }
                    console.log("postChanged change to " + postChanged)
                }
                if (mediaUrl == null) {
                    postImgChanged = true;
                    console.log("Inside postImgChanged inside post.postType=='Post'  !")
                    updatedPost = {
                        postType: "Post",
                        data: caption
                    }
                }
            } else if (post.postType == 'Event') {
                if (post.data !== description || post.heading !== caption) {
                    console.log("Inside post.data!==description || post.heading!==caption !")
                    postChanged = true;
                    updatedPost = {
                        postType: "Event",
                        img: post.img,
                        data: description,
                    }
                    console.log("postChanged change to " + postChanged)
                }
                if (mediaUrl == null) {
                    postImgChanged = true;
                    console.log("Inside postImgChanged in post.data!==description || post.heading!==caption !")
                    updatedPost = {
                        postType: "Event",
                        data: description,
                    }
                }
            }
            if (postChanged || postImgChanged) {
                if (post.postType == 'Post') {
                    console.log("inside fetch call post.postType=='Post'")
                    const updatePostResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/post/update-post/${post._id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(updatedPost)
                    })

                    if (!updatePostResponse.ok) {
                        throw new Error('Failed to create post');
                    }

                    const updatePostData = await updatePostResponse.json();
                    console.log("updated post" + JSON.stringify(updatePostData));
                    setPosts((prevPostsList) => {
                        return prevPostsList.map((prevPost) => {
                            console.log("prevPost._id " + prevPost._id.toString() + "  post._id " + post._id.toString() + "  " + prevPost._id.toString() != post._id.toString())
                            if (prevPost._id.toString() != post._id.toString()) {
                                return prevPost;
                            } else {
                                prevPost.img = updatedPost.img;
                                prevPost.data = updatedPost.data;
                                return prevPost;
                            }
                        })
                    })
                } else {
                    updatedPost.date = date.toISOString(); // or use date.format() if you prefer a specific format
                    updatedPost.time = time.toISOString();
                    updatedPost.heading = caption;
                    console.log("****** caption value --> " + caption)
                    console.log("updatedPost --> " + JSON.stringify(updatedPost));
                    const updatEventResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/event/update-event/${post._id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(updatedPost)
                    })

                    if (!updatEventResponse.ok) {
                        throw new Error('Failed to create post');
                    }

                    const updateEventData = await updatEventResponse.json();
                    console.log("updated post" + JSON.stringify(updateEventData));
                    setPosts((prevEventsList) => {
                        return prevEventsList.map((prevEvent) => {
                            console.log("prevPost._id " + prevEvent._id.toString() + "  post._id " + post._id.toString() + "  " + prevEvent._id.toString() != post._id.toString())
                            if (prevEvent._id.toString() != post._id.toString()) {
                                return prevEvent;
                            } else {
                                prevEvent.img = updatedPost.img;
                                prevEvent.data = updatedPost.data;
                                prevEvent.date = updatedPost.date;
                                prevEvent.time = updatedPost.time;
                                prevEvent.heading = updatedPost.heading;
                                return prevEvent;
                            }
                        })
                    })
                    console.log("****** all Events in Update Drawer After Update--> " + JSON.stringify(allPosts))
                }
                handleClose();
            }

        } catch (error) {
            console.log(`error while editing ${post.postType} : ${error}`)
        }
    }
    const handleRemovePreview = () => {
        console.log("clicked handle");
        setCloseIconVisible(false)
        clearMedia();
    }
    return (
        <React.Fragment>
            <p onClick={handleClickOpen} >Edit</p>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-label="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" sx={{ textAlign: "center" }}>
                    {"Update " + post.postType}
                </DialogTitle>
                <DialogContent>
                    <form action="api/v1/user/post/update-post" method="post" id="update-post-form" onSubmit={handleSubmit}>
                        <Box sx={{ display: "flex", flexDirection: "column", margin: "10px 2px" }}>
                            <Box sx={{ display: 'flex', justifyContent: postType == "Event" ? "space-evenly" : "flex-start", margin: "10px 2px" }}>
                                <IconButton aria-label="upload media" onClick={() => imgRef.current.click()} sx={{ padding: "8px", backgroundColor: "rgba(210, 210, 210, 0.599)", borderRadius: "10px", margin: "15px 5px", width: "30px" }}>
                                    <input type="file" name="img" id="file-upload" placeholder="hello" ref={imgRef} hidden onChange={handleMediaChange} />
                                    <CameraAltIcon aria-label="upload image" aria-hidden="false" sx={{ height: "15px", width: "15px" }}  />
                                </IconButton>
                                {
                                    postType === 'Event' && (
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Event Date"
                                                value={date}
                                                onChange={(newValue) => setDate(dayjs(newValue))}
                                            />
                                            <TimePicker
                                                label="Event Time"
                                                value={time}
                                                onChange={(newValue) => setTime(dayjs(newValue))}
                                            />
                                        </LocalizationProvider>
                                    )}
                            </Box>
                            <TextField
                                name="caption"
                                label="Caption"
                                multiline
                                maxRows={4}
                                value={caption}
                                onChange={(e) => {
                                    setCaption(e.target.value)
                                    console.log('new caption value --> ' + caption)
                                }}
                            />
                            {
                                postType == 'Event' ?
                                    <TextField
                                        name="description"
                                        label="Description"
                                        multiline
                                        maxRows={4}
                                        value={description}
                                        onChange={(e) => setDesc(e.target.value)}
                                        sx={{ margin: "10px 2px" }}
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
                                    postImgChanged = true;
                                    handleRemovePreview();
                                    console.log("postImgChanged-->" + postImgChanged)
                                }}
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button aria-label="close" onClick={handleClose}>
                        close
                    </Button>
                    <Button variant="outlined" aria-label="update" type="submit" form="update-post-form" >
                        update
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
