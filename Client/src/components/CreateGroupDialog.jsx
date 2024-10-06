import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import { Box, ListItem } from '@mui/material';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import List from '@mui/material/List';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import getSocket from '../utils/socketManager';

export default function CreateNewGroupDialog({ allFriends }) {
    const [socket, setSocket]=React.useState(undefined);
    const [selectedFriends, setSelectedFriends]=React.useState(undefined);
    const [groupName, setGroupName]=React.useState("")
    const [groupAbout, setGroupAbout]=React.useState("")
    const [open, setOpen] = React.useState(false);
    const [tabValue, setTabValue] = React.useState("friends");
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const steps = [
        {
            label: 'Select Friends',
        },
        {
            label: 'Add Group details',
        }
    ];

    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = steps.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        console.log("Active step is " + activeStep)
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleFormSubmit = (event) => {
        console.log("handleFormSubmit called !")
        event.preventDefault(); // Prevent form from reloading the page
        const formData = new FormData(event.target);
        const selectedFriends = formData.getAll('selectedFriends'); // Get all selected friend IDs

        // Filter based on selected friend IDs
        const selectedFriendNamesList = allFriends
            .filter((friend) => selectedFriends.includes(friend.userId._id)) // Filter by IDs
            .map((friend) => friend.userId._id); // Map to friend names
        setSelectedFriends(selectedFriendNamesList);
        console.log("selectedFriendNames--> " + selectedFriendNamesList); // Logs the selected friend names
        handleNext();
    };

    const handleCreateGroupButtonClicked = () => {
        console.log("handle CreateGroup Button Clicked !")
        console.log(selectedFriends);
        console.log(groupName);
        console.log(groupAbout);

        socket.emit('new_group',{otherUsersId : selectedFriends , groupName: groupName , groupAbout: groupAbout})

        handleClose();
    }

    React.useEffect(()=>{
      setSocket(getSocket());
    },[socket])
    return (
        <React.Fragment>
            <GroupAddOutlinedIcon aria-label="group icon" aria-hidden="false" onClick={handleClickOpen} />
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-label="responsive-dialog-title"
            >
                {/* Tabs component in Material-UI automatically passes two arguments to the onChange event handler:
        event: The event object that triggered the change.
        newValue: The index or value of the newly selected tab. */}
                <DialogContent sx={{ minHeight: "100px" }}>
                    <Box sx={{ width: "100%", flexGrow: 1 }}>
                        <Paper
                            square
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                height: 50,
                                pl: 2,
                                bgcolor: 'grey',
                            }}
                        >
                            <Typography>{steps[activeStep] ? steps[activeStep].label : null}</Typography>
                        </Paper>
                        <Box sx={{ height: "100%", width: '100%', p: 2,display: "flex",flexDirection:"column", justifyContent: "center", alignItems: "space-around" }}>
                            {
                                activeStep == 0
                                    ?
                                    (
                                        <form action="" onSubmit={handleFormSubmit} id="post-form">
                                            <FormGroup>
                                                {allFriends.map((friend) => (
                                                    <FormControlLabel
                                                        key={friend.userId._id}
                                                        control={<Checkbox name="selectedFriends" value={friend.userId._id} />}
                                                        label={friend.userId.name}
                                                    />
                                                ))}
                                            </FormGroup>
                                        </form>
                                    )
                                    :
                                    (
                                        < >
                                            <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"flex-end" , marginBottom:"15px"}}>
                                                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                                                <TextField id="standard-basic" label="Group Name" variant="standard" onChange={(event)=>setGroupName(event.target.value)} />
                                            </Box>
                                            <TextField
                                                id="outlined-multiline-flexible"
                                                label="About Group"
                                                multiline
                                                maxRows={4}
                                                onChange={(event)=>setGroupAbout(event.target.value)}
                                            />
                                        </>
                                    )
                            }

                        </Box>
                        <MobileStepper
                            variant="text"
                            steps={maxSteps}
                            position="static"
                            sx={{ width: "100%" }}
                            activeStep={activeStep}
                            nextButton={
                                activeStep == 0
                                    ?
                                    <Button
                                        size="small"
                                        type="submit"
                                        form="post-form"
                                    >
                                        Next
                                        {theme.direction === 'rtl' ? (
                                            <KeyboardArrowLeft />
                                        ) : (
                                            <KeyboardArrowRight />
                                        )}
                                    </Button>
                                    :
                                    <Button
                                        size="small"
                                        type="submit"
                                        onClick={handleCreateGroupButtonClicked}
                                    >
                                        Create
                                        {theme.direction === 'rtl' ? (
                                            <KeyboardArrowLeft />
                                        ) : (
                                            <KeyboardArrowRight />
                                        )}
                                    </Button>
                            }
                            backButton={
                                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                    {theme.direction === 'rtl' ? (
                                        <KeyboardArrowRight />
                                    ) : (
                                        <KeyboardArrowLeft />
                                    )}
                                    Back
                                </Button>
                            }
                        />
                    </Box>

                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
