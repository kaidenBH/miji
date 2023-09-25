import { useState } from 'react';
import './App.css';
import axios from "axios";
import loadingSvg from './assets/loading.svg';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [generated, setgenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState('');
  const [textToCopy, setTextToCopy] = useState('Text to be copied');
  const [loading, setLoading] = useState(false);

  const copyToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = textToCopy;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';

    document.body.appendChild(el);

    const selected =
      document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
    el.select();

    document.execCommand('copy');
    document.body.removeChild(el);

    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
      setCopied(true);
    }
  };



  const API = axios.create({ 
    baseURL:  "https://miji.onrender.com",
  });
  
  const newLink = (original_link) => API.post('/', {original_link});
  const deleteLink = (short_link) => API.delete(`/deleteLink/${short_link}`);
  const handleButtonClick = async () => {
    if (inputValue !== '') {
      setLoading(true);
      const { data } = await newLink(inputValue);
      setLink(data.short_link);
      setCopied(false);
      setTextToCopy("https://miji.onrender.com/"+data.short_link);
      setgenerated(true);
      setLoading(false);
    }
  };

  const handledelete = async () => {
    if (link !== '') {
      await deleteLink(link);
      setLink("data.short_link");
      setInputValue("");
      setTextToCopy("");
      setgenerated(false);
      setCopied(false);
    }
  };

  return (
    <>
      <h1>Create Your short link here:</h1>
      <div className="card">
        <input className="inputField"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        { loading? <img src={loadingSvg} alt="My SVG" className="loading" /> 
                : <button onClick={handleButtonClick} disabled={loading}> Generate Link</button>}
      </div>
      {generated? (
        <div className="card">
          <h2>Your Link: </h2>
          <h2 className="link"  onClick={(e) => {
            e.preventDefault();
            window.open(`https://miji.onrender.com/${link}`, '_blank');
          }}>https://miji.onrender.com/{link}</h2>
          <button onClick={copyToClipboard} disabled={copied}> Cop{copied? 'ied': 'y Link'}</button>
          <button onClick={handledelete}> Delete Link</button>
        </div>
      ) : null }
    </>
  )
}

export default App
