import React,{useState, useEffect} from 'react';
import {Form, Button} from 'semantic-ui-react';
import axios from 'axios'


function Register(props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        if(localStorage.getItem('username')){
            return props.history.push('/')
        }
    },[])

    const validate = () =>{
        setError('')

        if(username === '' || password === '' || email === '' || confirmPassword === ''){
            setError({'error':'please give all details'})

            return false
        }
        else if(password !== confirmPassword){
            setError({'error':'passwords not match'})

            return false
        }

        return true

    }

    const onSubmit = async () =>{

        const valid = validate();

        if(valid){
            setLoading(true)


            await axios({
                method:'POST',
                url:'http://127.0.0.1:5000/api/user/register',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data:JSON.stringify({
                            username: username,
                            password: password,
                            email: email
                        })
            })
            .then(function (response) {
                setLoading(false)
                let res = response.data.data

                console.log(response)
                if(res){
                    if(res.username){

                        localStorage.setItem('username',res.username)
                        localStorage.setItem('user_token',response.data.token)
                        
        
                        props.history.push('/')
    
                    }
                }
                
                if(response.data.error){
                    setError(response.data.error)
                }
                console.log(response)
                
              });
        }

    }
    
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''} style={{padding:'20px'}}>
                <h1 style={{width:'100%',textAlign:'center'}}>Register</h1>

                <Form.Input 
                    label="Username"
                    placeholder="Username.."
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e)=> setUsername(e.target.value)}
                />
                <Form.Input 
                    label="Email"
                    placeholder="Email.."
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                />
                <Form.Input 
                    label="Password"
                    placeholder="Password.."
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                />
                <Form.Input 
                    label="ConfirmPassword"
                    placeholder="ConfirmPassword.."
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e)=> setConfirmPassword(e.target.value)}
                />
                <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Button type="submit" primary style={{width:'130px'}}>
                        Register
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
    );
}


export default Register
