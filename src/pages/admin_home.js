import React,{useState,useEffect} from 'react'
import axios from 'axios'
import './Home.css'
import {Link} from 'react-router-dom'
import {Form, Button, Table} from 'semantic-ui-react';


function AdminHome (props){
    const [error, setError] = useState('')
    const [users,setUsers] = useState([])

    

    const fetch_ = async ()=>{
        await axios({
            method:'GET',
            headers:{
                "Authorization" : `Bearer ${localStorage.getItem('user_token_admin')}`
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
    useEffect(()=>{
        if(!localStorage.getItem('admin_username')){
            return props.history.push('/admin')
        }
        fetch_();
    },[])

    const deactivate = async (event,username) =>{
        event.preventDefault();
        await axios({
            method:'PUT',
            url:'http://127.0.0.1:5000/api/user/deactivate',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization" : `Bearer ${localStorage.getItem('user_token_admin')}`
            },
            data:JSON.stringify({
                        username: username,
                    })
        }).then((res)=>{
            alert(res.data.message)
            fetch_();
            // window.location.reload()

        })
    }

    const activate = async (event,username) =>{
        event.preventDefault();

        await axios({
            method:'PUT',
            url:'http://127.0.0.1:5000/api/user/activate',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization" : `Bearer ${localStorage.getItem('user_token_admin')}`
            },
            data:JSON.stringify({
                        username: username,
                    })
        }).then((res)=>{
            alert(res.data.message)
            fetch_();
            // window.location.reload()

        })
    }

    const logout = (e) =>{
        localStorage.removeItem('admin_username')
        localStorage.removeItem('user_token_admin')
        return props.history.push('/admin')
    }

    
    return(
        <div style={{width:'100%', alignItems:'center',justifyContent:'center'}}>
            <div style={{width:'100%', alignItems:'center',justifyContent:'space-between',display:'flex',paddingRight:'30px',paddingLeft:'30px'}}>
                <h1>User List</h1>
                <Button onClick={(e)=>logout(e)}>Logut admin</Button>
            </div>
            <Table >
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>E-mail address</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
            </Table.Header>

            <Table.Body>
                {users.map(item=>(
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
                        {item.active === 'true' ? (
                            <Button primary type="button" onClick={(event)=>deactivate(event,item.username)}>Deactivate</Button>

                        ):(
                        <Button primary type="button"  onClick={(event)=>activate(event,item.username)}>activate</Button>

                        )
                        }
                        </Table.Cell>
                    </Table.Row>
                ))}
            
            </Table.Body>
        </Table>
        </div>
    )
}

export default  AdminHome