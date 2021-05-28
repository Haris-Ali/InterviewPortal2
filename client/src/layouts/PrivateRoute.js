
import React, { useEffect, useState } from "react";
import {Route, Redirect } from 'react-router-dom';
import {connect} from "react-redux"
import Loading from '../components/Loading'

import Layout from "./Layout";

function PrivateRoute({component: Component, user, isAdmin, isLogged, ...rest}){
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if(user){
            setLoading(false)
        }
    })

   return(
       <>
       {
        loading ? (
          <> 
            <Loading />
          </>
            ): (
                <>
                <Route
                    {...rest}
                    render={props =>
                        <>
                            <Layout user = {user} isLogged = {isLogged} isAdmin = {isAdmin} {...props}>
                                <Component user = {user} isLogged = {isLogged} isAdmin = {isAdmin} {...props} />
                            </Layout>
                        </>
                        
                    }
                />
            </>)}
        </>
    )     
};

export default PrivateRoute;