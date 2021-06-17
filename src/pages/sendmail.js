import React,{useState, useEffect} from 'react'
import {Form, Button} from 'semantic-ui-react';
import axios from 'axios';


function SendMail (props){
    const [mail, setMail] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [loading, setloading] = useState(false)
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')


    useEffect(()=>{
        try{
            setMail(props.location.data.email)
            setUsername(props.location.data.username)
        }catch(e){
            props.history.goBack()
        }
        
    },[props.location.data])

    const validate = () =>{
        setError('')
        if(mail === '' || subject === '' || body === ''){
            setError({'error':'Please give all details'})
            return false
        }

        return true
    }

    const onSubmit = async () =>{

        const valid = validate();

        if(valid){

            setloading(true)

            await axios({
                method:'POST',
                url:'http://127.0.0.1:5000/api/send_mail/',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization" : `Bearer ${localStorage.getItem('user_token_admin') || localStorage.getItem('user_token')}`
                },
                data:JSON.stringify({
                            to: mail,
                            subject: subject,
                            text: body
                        })
            }).then((res)=>{
                setloading(false)
                console.log(res)
                if(res.data.message){
                    alert(res.data.message)
                    props.history.goBack()

                }
                else if(res.data.error){
                    setError(res.data.error)
                }
                
            })
        }
    }
    return(
        <div className="form-container" >
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''} style={{padding:'30px'}}>
                <h1 style={{width:'100%',textAlign:'center'}}>send Mail to {username}</h1>

                <Form.Input 
                    label="Mail ID"
                    placeholder="Mail ID"
                    name="mail"
                    type="text"
                    value={mail}
                    onChange={(e)=>setMail(e.target.value)}
                />

                <Form.Input 
                    label="Subject"
                    placeholder="Subject"
                    name="subject"
                    value={subject}
                    onChange={(e)=>setSubject(e.target.value)}
                />
                
                <Form.Input 
                    label="Body"
                    placeholder="Content"
                    name="body"
                    value={body}
                    onChange={(e)=>setBody(e.target.value)}
                />

                <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Button type="submit" primary style={{width:'130px'}}>
                        Send
                    </Button>
                    
                </div>
            </Form>

            {Object.keys(error).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(error).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}

            
            
        </div>
    )
}

export default SendMail;