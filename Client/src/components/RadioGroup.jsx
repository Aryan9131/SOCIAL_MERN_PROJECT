import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RowRadioButtonsGroup({setPostType, postType}) {
  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="type"
        defaultValue="Post"
        value={postType}
        onChange={(e) => {
          setPostType(e.target.value);
          console.log("Post value changed in groupButton to -->"+e.target.value);
        }}
      >
        <FormControlLabel value="Post" control={<Radio />} label="Post" />
        <FormControlLabel value="Event" control={<Radio />} label="Event" />
      </RadioGroup>
    </FormControl>
  );
}
