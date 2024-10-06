import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/More';
function Search(){
   return(
      <>
        <div id="search">
                <SearchIcon id="searchIcon" sx={{color:"grey"}}/>
                <input type="text" id="searchInput"  placeholder='Search in social' sx={{color:"grey"}}/> 
               <MoreIcon id="moreIcon" sx={{color:"grey"}}/>
        </div>
      </>
   )
}

export default Search