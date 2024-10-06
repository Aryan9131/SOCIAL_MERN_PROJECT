import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Tabs, Tab, Box } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ListItems from './ListItems'

export default function FriendsDialog({ allFriends, allGroups, setAllFriends }) {
  const [open, setOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState("friends");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  console.log("friends in friendDialog --> "+JSON.stringify(allFriends))
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  console.log("allGroups --> "+allGroups) 
  
  return (
    <React.Fragment>
      <PersonAddAltIcon onClick={handleClickOpen} />
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        {/* Tabs component in Material-UI automatically passes two arguments to the onChange event handler:
        event: The event object that triggered the change.
        newValue: The index or value of the newly selected tab. */}
        <DialogContent  sx={{ minHeight: "100px" }}>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                  <Tab label="Freinds" value="friends" />
                  <Tab label="Requests" value="requests" />
                  <Tab label="Explore" value="explore" />
                </TabList>
              </Box>
              <TabPanel value="friends">
                <ListItems handleClose={handleClose} listValues={allFriends} allGroups={allGroups} type={tabValue} setAllFriends={setAllFriends} />
              </TabPanel>
              <TabPanel value="requests">
                <ListItems type={tabValue} setAllFriends={setAllFriends} />
              </TabPanel>
              <TabPanel value="explore">
                <ListItems type={tabValue} listValues={allFriends} setAllFriends={setAllFriends} />
              </TabPanel>
            </TabContext>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
