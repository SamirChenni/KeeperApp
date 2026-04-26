import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
function CreateArea(props) {
   
  const [note , setNote] = useState({title : "" , content : ""});
  const [isClicked , setIsClicked] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setNote((prevNote)=>{
      return {...prevNote , [name] : value}
    })
  }

  function handleSubmit(event) {
    props.handleClick(note.title, note.content);
    setNote({title : "" , content : ""});
    setIsClicked(false);
    event.preventDefault();
  }

  function handleClick() {
    setIsClicked(true);
  }

  return (
    <div>
      <form   className="create-note">
        {isClicked && (<input
          onChange={handleChange}
          name="title"
          placeholder="Title"
          value={note.title}
        />)}
        
        <textarea
          onChange={handleChange}
          onClick={handleClick}
          name="content"
          placeholder="Take a note..."
          rows={isClicked ? 3 : 1}
          value={note.content}
        />
        <Zoom in={isClicked} >
        <Fab
          onClick={handleSubmit}
        >
          <AddIcon />
        </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
