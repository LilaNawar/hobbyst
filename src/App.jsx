import React, { Component } from 'react'
import Signup from './user/Signup'
import Signin from './user/Signin'
import HomeLoggedIn from './landingPage/HomeLoggedIn'
import HomeLoggedOut from './landingPage/HomeLoggedOut'
import {BrowserRouter as Router, Route, Routes, Redirect} from "react-router-dom"
import Axios from "axios"
import jwt_decode from "jwt-decode"
import { Alert, Nav, NavItem } from "react-bootstrap" 
import HobbyList from './hobby/HobbyList'
import Profile from './Profile/ProfileDetail'
import ProfileEdit from './Profile/ProfileEdit'
import ProfileDelete from './Profile/ProfileDelete'
import EventCreateForm from './event/EventCreateForm' 
import EventDetail from './event/EventDetail'
import EventEditForm from './event/EventEditForm'
import EventItem from './event/EventItem'
import EventList from './event/EventList'
import HobbyDetail from './hobby/HobbyDetail'



export default class App extends Component {
  
  state = {
    isAuth: false,
    user: [],
    message: null,
    hobbies: [], 
    event:[],
    userhobbies: []
  }

  componentDidMount(){
    let token = localStorage.getItem("token")

    Axios.get(`/hobbyindex`)
    .then(response => {
      console.log("listt", response.data)
      // console.log("myhobbies",hobbies)
      this.setState({
        // hobbies: response.data.userhobbies.slice(),
        hobbies: response.data.hobbiesList.slice()
      })

    })
    .catch(error => console.log(error))

    if(token !== null){
      let user = jwt_decode(token)
      if(user){
        this.setState({
          isAuth: true,
          user: user
        })
      }
      else{
        localStorage.removeItem("token")
        this.setState({
          isAuth: false
        })
      }
    }
  }

  // showHobbyDetail = (id) => { 
  //   Axios.get('/hobbydetail') 
  //   .then(response => {
  //     console.log(response.data.hobbyDetail)
  //     // console.log("myhobbies",hobbies)
  //     this.setState({
  //       hobbies: response.data.hobbyDetail.slice()
  //     })
  //   }
  //   )}
  // }


  registerHandler = async(user) => {
    console.log(user,'this is the user in app.jsx')
    Axios.post("auth/signup", user)
    .then(response =>{
      console.log('Signup response',response.data.token)
      
      if(response.data.token !== null){
        localStorage.setItem("token", response.data.token)
        let user = jwt_decode(response.data.token)

        this.setState({
          isAuth: true,
          user: user,
          message: "User logged in successfully"
        })
      }
    })
    .catch(error => {
      console.log(error)
      this.setState({
        isAuth: false,
      })
    })

  }

  loginHandler = (cred) => {
    console.log(cred,'this is cred')
    Axios.post("auth/signin", cred)
    .then(response => {
      console.log("logged in",response.data.token)

      if(response.data.token !== null){
        localStorage.setItem("token", response.data.token)
        let user = jwt_decode(response.data.token)

        this.setState({
          isAuth: true,
          user: user,
          message: "User logged in successfully"
        })
      }
    })
    .catch(error =>{
       console.log(error)

       this.setState({
         isAuth: false,
       })
      
    })
  }

  logoutHandler = () => {
    // e.preventDefault()
    localStorage.removeItem("token")
    this.setState({
      isAuth: false,
      user: null,
      message: "User logged out successfully"
    })
  }
  

  createEventHandler = (eventy,userId)=>{
    console.log(eventy)
    Axios.post(`eventcreateform/${userId}`, eventy,
    {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })

    .then(response=>{
      console.log(response)
      this.setState({event:response.data})

    })
  .catch(error =>{
    console.log(error)
  })
}


  // ProfileHandler = (user)=>{
  //   // Axios.get('/profile',user)
  //   // .then(response=>{

  //   // })
  //   // .catch(error=>{
  //   //   console.log(error)
  //   // })
  // }

  render() {
    console.log("user:",this.state.user)
    // console.log("Main app",this.state.hobbies)
    const message = this.state.message ? (
      <Alert variant='danger'>{this.state.message}</Alert>
    ) : null
    const {isAuth} = this.state
    // console.log("the user is", this.state.user)
    return (
      <div>
      {/* {message} */}
            { isAuth ? (
              <Nav  as="ul" className="justify-content-center nav">
              
              <Nav.Item as="li" className="home">
                <Nav.Link href="/" >Home</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link href='/user' >{this.state.user ? this.state.user.user.name : null}</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
              <Nav.Link href="/hobbylist"> All Hobbies</Nav.Link>
            </Nav.Item>
            <Nav.Item>
            <Nav.Link href="/eventcreateform" >New Event</Nav.Link>
            </Nav.Item>
              <Nav.Item as="li" className="logout">
                <Nav.Link href="/" onClick={this.logoutHandler} >Logout</Nav.Link>
              </Nav.Item>
              </Nav>
            ):
            (
              <Nav  as="ul" className="justify-content-center nav">
              <Nav.Item as="li">
                <Nav.Link href="/" className='text-white'>Home</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link href="/signin" className='text-white'>Signin</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link href="/signup" className='text-white'>Signup</Nav.Link>
              </Nav.Item>
              </Nav>
            )}
          

          <Router>
          <div>
            <Routes>
              <Route path='/' element={ this.state.isAuth ? <HomeLoggedIn user={this.state.user.user} hobbies={this.state.hobbies} /> : <HomeLoggedOut />}></Route>
              <Route path='/signup' element={<Signup register={this.registerHandler} hobbies={this.state.hobbies} />}></Route>
              <Route path='/signin' element={<Signin login={this.loginHandler} />}></Route>

              <Route path='/hobbylist' element={this.state.isAuth ? <HobbyList hobbies={this.state.hobbies} /> : <HomeLoggedOut />}> </Route> 
              <Route path='/hobbylist/:userid' element={this.state.isAuth ? <HobbyList hobbys={this.state.userhobbies} /> : <HomeLoggedOut />}> </Route> 


              <Route path='/hobby/detail/:id' element={this.state.isAuth ? <HobbyDetail user={this.state.user.user} hobbies={this.state.hobbies} /> : <HomeLoggedOut />}> </Route> 


              {/* {this.state.hobbies.map(hobby => <Route path="/hobby/:_id" element={<HobbyDetail />} /> ) }  */}
             

              <Route path='/user' element={this.state.isAuth ? <Profile user={this.state.user.user||1 }/> : <HomeLoggedOut />} ></Route>
              <Route path='/user/edit/:id' element={this.state.isAuth ? <ProfileEdit user={this.state.user.user||1 } hobbies={this.state.hobbies}/> : <HomeLoggedOut />} ></Route>
              <Route path='/user/delete/:id' element={this.state.isAuth ? <ProfileDelete user={this.state.user.user||1 } logout={this.logoutHandler}/> : <HomeLoggedOut />} ></Route>

              <Route path='/eventcreateform' element={this.state.isAuth ? <EventCreateForm hobbies={this.state.hobbies} user={this.state.user.user} eventy={this.createEventHandler} /> : <HomeLoggedOut />}></Route>
              <Route path='/event/detail/:eventid' element={this.state.isAuth ? <EventDetail hobbies={this.state.hobbies} user={this.state.user.user} event={this.state.event} /> : <HomeLoggedOut />}></Route>
              <Route path='/eventedit/:_id' element={this.state.isAuth ? <EventEditForm hobbies={this.state.hobbies} user={this.state.user.user} event={this.state.event} /> : <HomeLoggedOut />}></Route>
              {/* import EventEditForm from './event/EventEditForm'
              import EventItem from './event/EventItem'
            import EventList from './event/EventList' */}


              {/* <Route path='/eventcreateform' element={<HobbyList hobbies={this.state.hobbies} />}> </Route>   */}
              {/* <Route path='/eventcreateform' element={<EventCreateForm hobbies={this.state.hobbies} />}> </Route>  */}

              

            
            </Routes>

          </div> 

            {/* <footer id='footer'>
              <div id='copyright'>
                2022 HOBBYST © ALL RIGHTS RESERVED
              </div>
            </footer>  */}
            

        </Router>
      </div>
    )
  }
}