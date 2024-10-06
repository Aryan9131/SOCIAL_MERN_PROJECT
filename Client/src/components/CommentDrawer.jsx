import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '@mui/material/Input';
import SendIcon from '@mui/icons-material/Send';
import { Typography, Box, IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import MenuPopper from './MenuPopper';
import { useEffect } from 'react';
import CommentIcon from '@mui/icons-material/Comment';

export default function FormDialog(props) {
    console.log("props --> " + JSON.stringify(props))
    const { postComments, setPostComments, postId } = props;
    const { commentData, setCommentData, updatedCommentData, setUpdatedCommentData, handleCommentSubmit, handleEditCommentSubmit, handleCommentDelete } = props

    const [open, setOpen] = React.useState(false);
    let user = useSelector((state) => state.user).user;
    const token = localStorage.getItem('token'); // Make sure 'token' is the string key
    const [readOnlyStates, setReadOnlyStates] = React.useState({});
    useEffect(() => {
        let obj = {}
        postComments.map((comment) => {
            const commentId = comment._id
            obj[commentId] = true;
        })
        setReadOnlyStates(obj)
    }, [postComments])
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (commentId) => {
        if (commentId)
            handleReadOnlyStates(commentId, true)
        setOpen(false);
        setCommentData("");
    };
    const handleReadOnlyStates = (commentId, value) => {
        let obj = {};
        obj[commentId] = value
        setReadOnlyStates((prev) => ({ ...prev, ...obj }))
    }


    return (
        <React.Fragment>
            <IconButton aria-label="desc" sx={{ display: "flex", alignItems: "center" }} onClick={handleClickOpen}>
                <CommentIcon placeholder="Comment" sx={{ width: "90%" }} />
            </IconButton>
            <Dialog
                open={open}
                aria-label='commnent drawer'
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (e) => {
                        e.preventDefault();
                        handleCommentSubmit(postId, setPostComments);
                    },
                }}
            >
                <DialogTitle>Post Comments</DialogTitle>
                <DialogContent sx={{ position: "relative" }} >
                    <List sx={{ width: '100%', minWidth: 400, height: { xs: "100vh", sm: 400, md: 300 }, boxSizing: "border-box", overflowY: "scroll", bgcolor: 'background.paper' }}>
                        {
                            postComments.length > 0
                                ?
                                postComments.map((comment, key) => {
                                    const readOnly = readOnlyStates[comment._id]
                                    return (
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }} key={comment._id} id={comment._id}>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar alt="Remy Sharp" sx={{ width: 34, height: 34 }} src="https://mui.com/static/images/avatar/3.jpg" />
                                                </ListItemAvatar>

                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="body1">
                                                        {comment.user ? comment.user.name : 'guest'}
                                                    </Typography>
                                                    <Box id='editComment'>
                                                        <TextField
                                                            id={comment._id + "_textField"}
                                                            multiline
                                                            maxRows={6}
                                                            variant="standard"
                                                            InputProps={{
                                                                readOnly: readOnly,
                                                            }}
                                                            value={readOnly ? comment.data : updatedCommentData}
                                                            onChange={(e) => setUpdatedCommentData(e.target.value)}
                                                            sx={{
                                                                width: "100%",
                                                                '& .MuiInput-underline:before': {
                                                                    borderBottom: 'none',
                                                                },
                                                                '& .MuiInput-underline:hover:before': {
                                                                    borderBottom: 'none',
                                                                },
                                                                '& .MuiInput-underline:after': {
                                                                    borderBottom: 'none',
                                                                },
                                                                '& .MuiInput-underline:hover': {
                                                                    borderBottom: 'none'
                                                                }
                                                            }}
                                                        />
                                                        <Box sx={{
                                                            display: readOnlyStates[comment._id] ? 'none' : 'flex',
                                                            justifyContent: 'space-between',
                                                            textTransform: 'lowercase',
                                                            borderTop: "1px solid black"
                                                        }}>
                                                            <Button size="small"
                                                                aria-label="cancel"
                                                                onClick={(event) => {
                                                                    handleReadOnlyStates(comment._id, true);
                                                                    setUpdatedCommentData("");
                                                                }}
                                                            >
                                                                cancel
                                                            </Button>
                                                            <Button size="small"
                                                                aria-label="edit"
                                                                onClick={(event) => {
                                                                    event.preventDefault();
                                                                    handleEditCommentSubmit(comment._id, setPostComments);
                                                                }}
                                                            >
                                                                edit
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                {/* to Edit the comments */}
                                                {
                                                    (comment.user._id.toString() === user._id.toString()) &&
                                                        readOnlyStates[comment._id] ? (
                                                        <MenuPopper commentId={comment._id}
                                                            handleReadOnlyStates={handleReadOnlyStates}
                                                            setPostComments={setPostComments}
                                                            handleCommentDelete={handleCommentDelete}
                                                            setUpdatedCommentData={setUpdatedCommentData}
                                                            commentData={comment.data}
                                                            postId={postId}
                                                        />
                                                    ) : null
                                                }

                                            </ListItem>

                                            <Divider variant="inset" component="li" />
                                        </Box>
                                    )
                                })
                                :
                                "Be the first to comment :)"
                        }
                    </List>
                    <TextField
                        autoFocus
                        required
                        aria-label='text comment'
                        id="name"
                        name="text"
                        label="Comment"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={commentData}
                        onChange={(e) => setCommentData(e.target.value)}
                        sx={{ position: "sticky", bottom: "-21px", marginTop: "15px", backgroundColor: "whitesmoke" }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button aria-label="cancel comment" onClick={() => handleClose()}>Cancel</Button>
                    <Button aria-label="post comment" type="submit">comment</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
