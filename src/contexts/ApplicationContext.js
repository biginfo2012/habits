import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import jwt_decode from 'jwt-decode';
import { globalSettings } from '../misc/globals';

const ApplicationContext = createContext()

const ApplicationContextProvider = (props) => {

    const  [userInfo, setUserInfo] = useState({
        name: localStorage.getItem("username") || "",
        email: localStorage.getItem("email") || "",
        role: localStorage.getItem("role") || "",
        token: localStorage.getItem("token") || ""
    })
    const [user, setUser] = useState({})
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [homepageState, setHomepageState] = useState("PaginaHome")

    const [categories, setCategories] = useState([])

    const fetchUser = () => {
        const token = localStorage.getItem('token')
        if (token !== null ) {
            axios({
                method: "post",
                url: globalSettings.baseApiUrl + globalSettings.authApi + globalSettings.user.validate,
                headers: {
                    "Access-Control-Allow-Origin" : "*",
                    "Content-type": "Application/json",
                    "Authorization": `Bearer ${token}`
                },
            }).then((res) => {
                if (res && res.status === StatusCodes.CREATED) {
                    if (res.data && res.data.accessToken) {
                        const token = res.data.accessToken
                        localStorage.setItem('token', token)

                        var decoded = jwt_decode(token);
                        console.log(decoded);

                        const newUserInfo = { 
                            name: decoded.name,
                            email: decoded.email,
                            role: decoded.role,
                            token: token
                        }

                        const headerPayload = {
                            "Access-Control-Allow-Origin" : "*",
                            "Content-type": "Application/json",
                            "Authorization": `Bearer ${token}`,
                        }
                        axios({
                            method: "get",
                            url: globalSettings.baseApiUrl + globalSettings.userApi + "/" + newUserInfo.email,
                            headers: headerPayload
                        }).then((res) => {
                            if (res ) {
                                const userResult = res.data
                                setUser(userResult)
                                console.log(userResult)
                            } else {
                                
                            }
                        }).catch((err) => {
                            // handle err
                            console.log(err)
                        })
                        
                        setUserInfo(newUserInfo)
                        setIsLoggedIn(true)
                    } else {
                        // manca il token
                        setUserInfo({})
                        setIsLoggedIn(false)
                        
                        localStorage.removeItem('token')
                        console.log( "manca il token")
                    }
                } else {
                    // non ha loggato l'utente
                    setUserInfo({})
                    setIsLoggedIn(false)
                                        
                    localStorage.removeItem('token')
                    console.log( "utente non loggato")
                }
            }).catch((err) => {
                let message = typeof err.response !== "undefined" ? err.response.data.message : err.message;
                setUserInfo({})
                setIsLoggedIn(false)
               
                localStorage.removeItem('token')
                console.log(err)
            }) 
        } else {
            setUserInfo({})
            setIsLoggedIn(false)
                       
            localStorage.removeItem('token')
            console.log( "token nullo")
        }
    }

    const fetchCategories = () => {
        const headerPayload = {
          "Access-Control-Allow-Origin" : "*",
          "Content-type": "Application/json",
      }
      axios({
          method: "get",
          url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.categories,
          headers: headerPayload
      }).then((res) => {
          if (res ) {
              const categoriesResult = res.data
              setCategories(categoriesResult)
          } else {
              
          }
      }).catch((err) => {
          // handle err
          console.log(err)
      })
    }

    useEffect(() => {
        fetchUser()
        fetchCategories()
    }, [])


    return (
        <ApplicationContext.Provider
            value={{
                isLoggedIn, setIsLoggedIn,
                userInfo, setUserInfo,
                user, setUser,
                homepageState, setHomepageState,
                categories, setCategories
            }}>
            {props.children}
        </ApplicationContext.Provider>
    );
};

export const useLogin = () => useContext(ApplicationContext)

export default ApplicationContextProvider;