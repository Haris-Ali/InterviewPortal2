import React, {useEffect, useState} from 'react';
import { homeObjOne, homeObjTwo, homeObjThree, homeObjFour } from './Data';
import { InfoSection, Pricing } from '../../components';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux'
import {dispatchLogin, fetchUser, dispatchGetUser} from '../../redux/actions/authAction'
import Loading from '../../components/Loading'
function Home() {
  const dispatch = useDispatch()
  const token = useSelector(state => state.token)
  const auth = useSelector(state => state.auth)
  const {user, isLogged, isAdmin} = auth
  const [loading, setLoading] = useState(false)
  
  // useEffect(() => {
  //   const firstLogin = localStorage.getItem('firstLogin')
  //   if(firstLogin){
  //     const getToken = async () => {
  //       const res = await axios.post('/user/refresh_token', null)
  //       dispatch({type: 'GET_TOKEN', payload: res.data.access_token})
  //     }
  //     getToken()
  //   }
  // },[auth?.isLogged, dispatch])

  // useEffect(() => {
  //   if(token){
  //     console.log("HomeLanding user", auth?.user)
  //     const getUser = () => {
  //       dispatch(dispatchLogin())
  //       return fetchUser(token).then(res => {
  //         try{
  //           dispatch(dispatchGetUser(res))
  //           setLoading(false)
  //         }
  //         catch(e) {
  //           console.log(res, e)
  //         }
  //       })
  //     }
  //     getUser()
  //   }
  // },[token, dispatch])

  return (
    <>
      {loading ? (
        <>
          <Loading />
        </>
      ):(
        <>
          <InfoSection {...homeObjOne} />
          <InfoSection {...homeObjThree} />
          <InfoSection {...homeObjTwo} />
          <Pricing />
          <InfoSection {...homeObjFour} />
        </>
      )}
      
    </>
  );
}

export default Home;
