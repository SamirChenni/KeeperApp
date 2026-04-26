import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {useState , useRef , useLayoutEffect} from 'react';
 

function Note(props) {

  const [editNote , setEditNote] = useState({
    title : props.title,
    content : props.content
  })

  function handleChange(event) {
    const { name, value } = event.target;
    setEditNote(prev => ({ ...prev, [name]: value }));
  }

  const textAreaRef = useRef(null);

  // This handles the resize logic perfectly
  const adjustHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  // Trigger resize whenever we enter edit mode or the content changes
  useLayoutEffect(() => {
    if (props.isEditable) {
      adjustHeight();
    }
  }, [props.isEditable, editNote.content]);


  

  return (
     <div className="note">
     
      {!props.isEditable ? (
        <div>
         <h1>
        {props.title}
        </h1>
       <p>
        {props.content}
      </p>
          <button
            onClick={() => {
              props.deleteClick(props.id);
            }}
          >
            <DeleteIcon />
          </button>
          <button
            onClick={() => {
              props.updateClick(props.id);
            }}
          >
            <EditIcon />
          </button>
        </div>
      ) : (
        <div>
        <input 
            name="title" 
            value={editNote.title} 
            onChange={handleChange} 
          />
          <textarea 
            className="edit-textarea"
            ref={textAreaRef}
            name="content" 
            value={editNote.content} 
            onChange={handleChange} 
            rows="1"
          />
          <button onClick={()=>props.cancelUpdate(props.id)}><CancelIcon/></button>
          <button onClick={() => props.saveUpdate(props.id, editNote.title, editNote.content)}><SaveIcon /></button>
        </div>
      )}
    </div>
  );
}

export default Note;
