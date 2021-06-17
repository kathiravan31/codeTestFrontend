import React,{useState,useEffect} from 'react'
import axios from 'axios'
import './Home.css'
import {Link} from 'react-router-dom'
import {Form, Button, Table} from 'semantic-ui-react';


function AdminHome (props){
    const [error, setError] = useState('');
    const [users,setUsers] = useState([]);
    const [connects,setConnects] = useState([]);

    const logout = (e) =>{
        localStorage.removeItem('username')
        return props.history.push('/login')
    }

    const fetch = async ()=>{
        await axios({
            method:'GET',
            headers:{
                "Authorization" : `Bearer ${localStorage.getItem('user_token')}`
            },
            url:'http://127.0.0.1:5000/api/users/',
        })
        .then(function (response) {
            let res = response.data

            if(res){
                setUsers(res)
            }
            
          });
    }

    const fetch_connects = async () =>{
        var username = localStorage.getItem('username')

        console.log(username, 'username')
        await axios({
            method:'GET',
            url:`http://127.0.0.1:5000/api/user/connects?username=${username}`,
            headers:{
                "Authorization" : `Bearer ${localStorage.getItem('user_token')}`
            },
            
        })
        .then(function (response) {
            let res = response.data

            console.log(response)

            if(res){
                if(res.active === 'false'){
                    return logout()
                }
                setConnects(res.connects)
            }
            
          });
    }
    useEffect(()=>{
        if(!localStorage.getItem('username')){
            return props.history.push('/login')
        }
        fetch_connects();
        fetch();
    },[])


    

    const disconnect_ = async (user) =>{
        await axios({
            method:'PUT',
            url:`http://127.0.0.1:5000/api/user/connects/remove?username=${localStorage.getItem('username')}&&newuser=${user.username}`,
            headers:{
                "Authorization" : `Bearer ${localStorage.getItem('user_token')}`
            },
        }).then((res)=>{
            if(res.data.error){
                setError(res.error)
            }else{
                console.log('disconnects success')
                console.log(res)
                fetch();
                fetch_connects();
            }
        })

        
    }

    const connect_ = async (user) =>{
        console.log('connects user')
        console.log(localStorage.getItem('user_token'))

        await axios({
            method:'PUT',
            url:`http://127.0.0.1:5000/api/user/connects/add?username=${localStorage.getItem('username')}&&newuser=${user.username}`,
            headers:{
                "Authorization" : `Bearer ${localStorage.getItem('user_token')}`
            },
        }).then((res)=>{
            console.log(res)
            if(res.data.error){
                setError(res.error)
            }else{
                console.log('connects success')
                console.log(res)
                fetch();
                fetch_connects();
            }
        })

        
    }

    const find_user = (item) =>{
        var user = connects.find(e => e.username === item.username);
        if(user){
            return true;
        }
        
        return false;
    }

    
    return(
        <div style={{width:'100%', alignItems:'center',justifyContent:'center'}}>
            <div style={{width:'100%', alignItems:'center',justifyContent:'flex-end',display:'flex',paddingRight:'30px',paddingLeft:'30px',paddingTop:'20px'}}>
                <Button onClick={(e)=>logout(e)}>Logut</Button>
            </div>
            <div style={{width:'100%',display:'flex'}}>
                <div style={{width:'50%'}}>
                    <h2>Your Contacts</h2>
                    <Table >
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell style={{alignItems:'center',justifyContent:'center'}}>Name</Table.HeaderCell>
                                <Table.HeaderCell style={{alignItems:'center',justifyContent:'center'}}>E-mail address</Table.HeaderCell>
                                <Table.HeaderCell style={{alignItems:'center',justifyContent:'center'}}>status</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {connects.map(item=>(
                                <Table.Row id="user_name">
                                    <Table.Cell>
                                        <Link to={{
                                            pathname:"/send_mail",
                                            data:{
                                                username: item.username,
                                                email: item.email
                                            }
                                            
                                        }}>
                                            {item.username}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{item.email}</Table.Cell>
                                    <Table.Cell>
                                        <Button primary type="button" onClick={()=>disconnect_(item)}>Disconnect</Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        
                        </Table.Body>
                    </Table>
                </div>
                <div style={{width:'50%'}}>
                    <h2>User Lists</h2>
                    <Table >
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>E-mail address</Table.HeaderCell>
                                <Table.HeaderCell>Statuc</Table.HeaderCell>

                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {users.map(item=>{

                                if(item.username !== localStorage.getItem('username')){
                                    var user = find_user(item)
                                    if(!user){
                                        return(
                                            <Table.Row id="user_name">
                                                <Table.Cell>
                                                    {item.username}
                                                </Table.Cell>
                                                <Table.Cell>{item.email}</Table.Cell>
                                                <Table.Cell>
                                                    <Button primary type="button" onClick={()=>connect_(item)}>Connect</Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    }
                                }
                            })}
                        
                        </Table.Body>
                    </Table>
                </div>
            </div>
            
        </div>
    )
}

export default  AdminHome