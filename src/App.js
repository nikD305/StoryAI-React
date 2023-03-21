import React, { useEffect, useState } from "react";
import "./App.css";
import Home from "./myComponentes/home/Home";
import { motion } from "framer-motion"
import { useInView } from 'react-intersection-observer';

function App() {
  const [img, setImg] = useState([]);
  const [para, setPara] = useState(["avengers", "spiderman", "ghost rider"]);
const [input,setInput] = useState("")
const [scrolled , setScrolled] = useState(false)
const sentences = input;
// const [lines,setLines] = useState([])
const lines = sentences.split(".")
console.log(lines)
console.log(input)
const [loading ,setLoading] = useState(false)
const [detail, setDetail] = useState("")


var Spinner = require('react-spinkit');


useEffect(() => {
setTimeout(() => {
  if(scrolled){
    const scrollPos = window.innerHeight * 1; 
    window.scrollTo({ top: scrollPos, behavior: 'smooth' }); 
  }
 else{
  console.log("didnt work")
 }
}, 2000);
  

}, [scrolled])


const describe = async (text) =>{
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': process.env.REACT_APP_CHATGPT ,
      'X-RapidAPI-Host': 'chatgpt-ai-chat-bot.p.rapidapi.com'
    },
    body: JSON.stringify({ "query": `describe this in detail in the aim of generating image of it with prompthero,  ${text.inputs}` })
  };
  
  const response = await fetch('https://chatgpt-ai-chat-bot.p.rapidapi.com/ask', options)
    const data =  response.json()
    console.log("text",text)
    console.log("gpt",data)
    return data
}








  async function query(inputs) {
    const  output = await describe(inputs)
    console.log("prompt",output)
    const response = await fetch(
      "https://nikhil420305-prompthero-openjourney.hf.space/run/predict",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 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",
        },
        method: "POST",
        body: JSON.stringify({
          data: [" mdjrny-v4 style ,8k, realistic , highly detailed, shallow depth of field ,High detail RAW color art ,diffused soft lighting ,hyperrealism, cinematic lighting " +output.response ]  ,
        
        }),
      }
    );
    const result = await response.json();
    return result;
  }

  

  const handleContent = async () => {
    setLoading(true)
    for (let i = 0; i < lines.length; i++) {
      await query({ inputs: lines[i] }).then((response) => {
        
        console.log(response);
        const imgUrl =response.data;
        setImg((prevImg) => [...prevImg, imgUrl]);
        setLoading(false)
        setScrolled(true)
      });
    }
  };
console.log("lines",lines)
console.log("img",img)





  return (
<div className="cont" >


    <div className="back" >
      <Home/>

      
      <div className="type" style={{height:"100vh", width:"100vw" , display:"flex" , justifyContent:"center", alignItems:"center" , transform:"translateY(-25%)",flexDirection:"column",}}>

      <h1   >
<span style={{color:"white"}}>Read </span>Stories with AI ! 

</h1>


      <input type="text"
       style={{margin:"10px" , width:"500px",height:"50px", borderRadius:"10px",border:"none"}}
      onChange={(e)=>setInput(e.target.value)} placeholder="Paste  your  story....."/>
      <button id="scroll-btn"
       style={{width:"115px", height:"45px"}}
      onClick={() => handleContent()}>{loading? "Loading..." : "Start"}</button>
      <div style={{position:"absolute", top:"460px"}}>
    
{
  loading?  <Spinner name="ball-scale-multiple" color="aqua"/>:""
}
      </div>
      </div>
      </div>

<div className="bottom_line">
  <p>
    Turn your Stories into AI Powerd Images
  </p>
</div>





      
      {img.map((item, index) => {
        return (
          <div style={{ display: "flex", flexDirection: index%2===0?"row":"row-reverse", backgroundColor:"#20262c" ,overflow:"hidden"}} key={index}> 
          <motion.div
            initial={{ translateX: index%2===0?"-500px":"500px", opacity: 0 }}
            whileInView={{ translateX: index%2===0?"25px":"-25px", opacity: 1 }}
            viewport={{ amount:0.1}}
            transition={{ duration: 0.5 }}
            style={{ width:"50vw", marginRight:"25px" }}>
            <hr style={{ height:"2px", backgroundColor:"gray" }} />
            <div style={{width:"565px"}}>
              <p style={{
                textAlign:"left",
                marginTop:"10vh",
                boxSizing:"border-box",
                color:"white",
                overflowWrap: "break-word",
                marginLeft: index%2===0?"0":"125px",
                marginRight:index%2===0?"0":"-50px",
                fontFamily:"cursive"
              }}>{lines[index]} </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ translateX: index%2===0?"500px":"-500px", opacity: 0 }}
            whileInView={{ translateX: index%2===0?"-25px":"25px", opacity: 1 }}
            viewport={{amount:0.1}}
            transition={{ duration: 0.5 }}
            style={{ width:"50vw" }}>
            <hr style={{ height:"2px", backgroundColor:"gray" }} />
            <img src={img[index]} alt="" style={{ marginLeft:index%2===0? 0:"30px" }} />
          </motion.div>
        </div>
        
        );
    })} 

    </div>
  );
}

export default App;
