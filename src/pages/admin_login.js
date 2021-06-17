import React,{useState,useEffect} from 'react';
import {Form, Button} from 'semantic-ui-react';
import axios from 'axios'
import {Link, Redirect} from 'react-router-dom'



function AdminLogin(props) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    
    useEffect(()=>{
        if(localStorage.getItem('admin_username')){
            return props.history.push('/admin_home')
        }
    },[])

    const validate = () =>{
        setError('')
        if(username === '' || password === ''){
            setError({'error':'please enter username and password'})
            return false
        }
        return true
    }


    const onSubmit = async () =>{

        const valid = validate()

        if(valid){
            setLoading(true)

            await axios({
                method:'GET',
                url:`http://127.0.0.1:5000/api/admin/login?username=${username}&password=${password}`,
            })
            .then(function (response) {
                
              setLoading(false)
                let res = response.data.data

                console.log(response)
                if(res){
                    if(res.username){

                        localStorage.setItem('admin_username',res.username)
                        localStorage.setItem('user_token_admin',response.data.token)
                        return props.history.push('/admin_home')
    
                    }
                }
                
                if(response.data.error){
                    setError(response.data.error)
                }
                console.log(response)
            })
        }

    }
    
    return (
        <div className="form-container">
            
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''} style={{padding:'20px'}}>
                <h1 style={{width:'100%',textAlign:'center'}}>Admin Login</h1>
                <Form.Input 
                    label="Username"
                    placeholder="Username.."
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                />
                
                <Form.Input 
                    label="Password"
                    placeholder="Password.."
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Button type="submit" primary style={{width:'130px'}}>
                        Login
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


export default AdminLogin
