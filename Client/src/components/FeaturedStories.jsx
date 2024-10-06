import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

export default function Stories({story, handleStoryClick, index}) {
  
  return (
        <Card sx={{ minWidth: 60,maxWidth:60 , backgroundColor:"whitesmoke", 
                    boxShadow:'0', border:"0px", margin:"5px 5px", display:"flex",
                    justifyContent:"center"
                  }}
                  onClick={()=>handleStoryClick(story, index)}
        >
        <CardActionArea >
          <CardMedia
            component="img"
            height="60"
            image={story.img.url}
            alt="green iguana"
            sx={{borderRadius:"50%", border:"2px solid blue", padding:"5px"}}
          />
        </CardActionArea>

      </Card>
  );
}
