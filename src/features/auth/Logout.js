import React,{ useContext }  from 'react';
import { auth } from 'firebase';
import { Redirect } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function Logout(){

  const { isAuthenticated } = useContext(AuthContext);

    function onLogout() {
       auth().signOut().then(function() {
          
          }).catch(function(error) {
            // An error happened.
            alert(error.message)
          });
    }

    if(!isAuthenticated) {
      return <Redirect to='/' />
  }
   
    return(
    
         <div className="logout">
            <p><i className="fa fa-question-circle"></i> Sigur doriti sa va deconectati? <br /></p>
                <div className="actionsBtns">
                   <form >
                       <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
                       <input type="submit" className="btn btn-default btn-primary" data-dismiss="modal" value="Logout" onClick={onLogout}/>
                          <button className="btn btn-default" data-dismiss="modal">Anulare</button>
                  </form>
              </div>
        </div>
       
    )
}

