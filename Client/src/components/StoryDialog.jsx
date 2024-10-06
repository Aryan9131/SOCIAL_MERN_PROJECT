import * as React from 'react';
import { Box, Button, IconButton, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import useImgPreview from '../hooks/handleImgPreview';
import CloseIcon from '@mui/icons-material/Close';
import getSocket from "../utils/socketManager";
import { useSelector, useDispatch } from 'react-redux';
import { addStory } from '../features/conversationSlice';

export default function StoryDialog() {
  const [open, setOpen] = React.useState(false);
  const [storyCaption, setStoryCaption] = React.useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const imgRef = React.useRef(null);
  const [closeIconVisible, setCloseIconVisible] = React.useState(false);
  const [imgFile, setImgFile] = React.useState(null);
  const { handleMediaChange, mediaUrl, isVideo, clearMedia } = useImgPreview(null, setImgFile, setCloseIconVisible);
  const token = localStorage.getItem('token');
  const [socket, setSocket] = React.useState(undefined);
  let user = useSelector((state) => state.user).user;
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    clearMedia();
    imgRef.current.value = null;
    setOpen(false);
  };

  const handleStorySubmit = async () => {
    try {
      let cloudinaryData = undefined;
      if (mediaUrl) {
        const data = new FormData();
        data.append('file', imgFile);
        data.append('upload_preset', 'Social-App');
        data.append('cloud_name', 'anayak');
        const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/anayak/image/upload', {
          method: 'POST',
          body: data
        });
        if (!cloudinaryResponse.ok) {
          throw new Error('Failed to upload image');
        }
        cloudinaryData = await cloudinaryResponse.json();
      }
      const storyObject = {
        img: {
          url: mediaUrl ? cloudinaryData.url : '',
          id: mediaUrl ? cloudinaryData.public_id : ''
        },
        data: storyCaption,
        userId: user._id.toString()
      };
      socket.emit('createStory', storyObject, (data) => {
        console.log('create story event clicked');
        dispatch(addStory({ story: data.story }));
      });
      handleClose();
    } catch (error) {
      console.log('Error while posting Story : ' + error);
    }
  };

  const handleRemovePreview = () => {
    setCloseIconVisible(false);
    clearMedia();
    imgRef.current.value = null;
  };

  React.useEffect(() => {
    setSocket(getSocket());
  }, [socket]);

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        <DataSaverOnIcon sx={{ height: '40px', width: '40px', color: '#676bec' }} />
      </IconButton>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        sx={{ maxWidth: '100vw', overflow: 'hidden' }}
      >
        <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
          {'Add Story'}
        </DialogTitle>
        <DialogContent sx={{ padding: { xs: '10px', md: '20px' } }}>
          <IconButton
            aria-label="add to favorites"
            sx={{
              padding: '8px',
              backgroundColor: 'rgba(210, 210, 210, 0.599)',
              borderRadius: '10px',
              margin: '15px 5px',
              width: { xs: '40px', md: '30px' }
            }}
            onClick={() => imgRef.current.click()}
          >
            <input
              type="file"
              name="img"
              id="file-upload"
              ref={imgRef}
              hidden
              onChange={handleMediaChange}
            />
            <CameraAltIcon sx={{ height: '15px', width: '15px' }}  />
          </IconButton>

          <TextField
            placeholder="caption"
            value={storyCaption}
            sx={{ width: '90%', maxWidth: '100vw', marginBottom: '10px' }}
            onChange={(e) => setStoryCaption(e.target.value)}
          />
          <Box sx={{ position: 'relative', textAlign: 'center' }}>
            {isVideo ? (
              <video src={mediaUrl} style={{ maxWidth: '100%', height: 'auto' }} controls />
            ) : (
              <img src={mediaUrl} style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} alt="Preview" />
            )}

            {closeIconVisible && (
              <CloseIcon
                sx={{
                  color: 'black',
                  backgroundColor: 'rgba(150, 150, 200, 0.897)',
                  borderRadius: '50%',
                  fontSize: '30px',
                  position: 'absolute',
                  top: '5%',
                  right: '5%',
                  cursor: 'pointer'
                }}
                onClick={handleRemovePreview}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', padding: { xs: '10px', md: '20px' } }}>
          <Button variant="outlined" onClick={handleClose} sx={{ margin: { xs: '5px', md: '10px' } }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleStorySubmit} sx={{ margin: { xs: '5px', md: '10px' } }}>
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
