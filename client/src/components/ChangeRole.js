import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {dispatchLogin, fetchUser,dispatchGetUser} from '../redux/actions/authAction'
import Loading from './Loading'
function ChangeRole({user, isAdmin, isLogged}) {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch()
    const token = useSelector(state => state.token)
    const auth = useSelector(state => state.auth)
    const [renderBack, setRenderBack] = useState(true);
    const role = auth?.isAdmin ? 0 : 1;
    const history = useHistory();
    useEffect(()=>{
        // console.log("(Change Role) UseEffect")
        // console.log('Change Role role:', role)
        if(auth && renderBack){
            // console.log("ChangeRole auth function")
            try {
                axios.patch(`/user/changeRole/${auth?.user._id}`, {
                    role: auth?.isAdmin ? 0 : 1
                })
                
            } catch (err) {
                console.log("Change Role Error:", err)
            }
        }
        if(token){
            const getUser = () => {
              dispatch(dispatchLogin())
              return fetchUser(token).then(res => {
                try{
                  dispatch(dispatchGetUser(res))
                
                //   console.log("ChangeUser dispatch State", auth?.user)
                  setLoading(false)   
                }
                catch(e) {
                  console.log(res, e)
                }
              })
            }
            getUser()
            history.push('/')
            // if(auth?.user?.isAdmin){
            //     console.log("going to admin")
            //     history.push('/admin')
            // }
            // if(!auth?.user?.isAdmin){
            //     console.log("going to candidate")
            //     history.push('/candidate')
            // }
          }
 
    }, [token, dispatch]);

    const renderFunction = ()=>{
        setRenderBack(false);
    }
    return (
        <div>
        {loading ? (
            <>
                <Loading />
            </>
        ):(
            <>
           
            </>
        )}
        </div>
       
        
    )
}

export default ChangeRole
