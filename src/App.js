import { useState } from 'react'
import axios from 'axios';
import { getItem, setItem } from './data/cache' 


export function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if(!dateString.match(regEx)) return false;  // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0,10) === dateString;
}

function App() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([])
  const [error , setError] = useState(false)
  const [flag, setFlag] = useState(false)

  const BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos'
  const API_KEY = 'mfZ709PhAdgsZ91bOioBS1V3W3XeSm8gQ0N0TkDz'

  const getImages = async () => {
    const DATE = query
    if(!isValidDate(DATE)){
      setError(true)
    }
    
    else{
      setError(false)
      setFlag(false)
      const DATE_QUERY = `?earth_date=${DATE}`
      const RAW_URL = BASE_URL+DATE_QUERY+'&api_key=' + API_KEY
    
      try{
        const response = await axios.get(RAW_URL)
        const data = response.data
        const filtered_repsonse = data.photos.map(image => image.img_src)    
        if (filtered_repsonse.length === 0){
          setFlag(true)
          setImages([])
        }
        return filtered_repsonse
        
      } catch (error){
        console.log(error)
      }  
    }
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault()
    let data = getItem(query);
    if (data === undefined){
      data = await getImages();
      setItem(query, data)
    }
    setImages(data)
  } 
  

  return (
    <>
    <div style={{margin:'auto',textAlign:'center',paddingTop:'10px',fontSize:'30px'}}>
      <label style={{}}>Enter Date in yyyy/mm/dd format</label>
      <form onSubmit={(e) => handleSubmit(e)}>
      <div style={{justifyContent:'center'}}>
        <input type='text' onChange={(e) => setQuery(e.target.value)} style={{padding:'5px',fontSize:'30px'}}/>
        <button style={{height:'3.5em'}}>Search</button>
      </div>
      </form>
      {error?
      <label style={{color:'red'}}>Please Enter Valid Date</label>:""}
      {flag?
      <label>There were no images from this date</label>:""}
    </div>
    {<ul>
      
      {images.map((image,i) => 
      <>
        <li key={i}><img src={image} style={{width:"150px"}}/></li>
        <a href={image}>{image}</a>
      </>
      )}
      </ul>}
    
   </>
  );
}

export default App;


