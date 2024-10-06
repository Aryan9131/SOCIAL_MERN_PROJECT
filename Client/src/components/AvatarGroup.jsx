import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

export default function GroupAvatars() {
  return (
    <AvatarGroup max={4}  variant="rounded" 
    slotProps={{
        additionalAvatar: {
          sx: { width: 28, height: 28,borderRadius: "10px" , zIndex:"10", backgroundColor:'black',fontSize:"12px"}
        }
      }}
    >
      <Avatar 
        alt="Remy Sharp" 
        src="https://mui.com/static/images/avatar/3.jpg" 
        variant="rounded" 
        sx={{ width: 28, height: 28, borderRadius: "10px" ,fontSize:"12px"}} 
      />
      <Avatar 
        alt="Travis Howard" 
        src="https://mui.com/static/images/avatar/1.jpg" 
        variant="rounded" 
        sx={{ width: 28, height: 28, borderRadius: "10px" ,fontSize:"12px"}} 
      />
      <Avatar 
        alt="Cindy Baker" 
        src="https://mui.com/static/images/avatar/2.jpg" 
        variant="rounded" 
        sx={{ width: 28, height: 28, borderRadius: "10px" ,fontSize:"12px"}} 
      />
      <Avatar 
        alt="Agnes Walker" 
        src="https://mui.com/static/images/avatar/3.jpg" 
        variant="rounded" 
        sx={{ width: 28, height: 28, borderRadius: "10px" ,fontSize:"12px"}} 
      />
      <Avatar 
        alt="Trevor Henderson" 
        src="/static/images/avatar/5.jpg" 
        variant="rounded" 
        sx={{ width: 28, height: 28, borderRadius: "10px" ,fontSize:"12px"}} 
      />
    </AvatarGroup>
  );
}
