import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
export const MyContext = React.createContext();
import { Google } from 'expo';

export default class MyProvider extends Component {
    state = {
        token: '',
        user:'',
        empId:'',
        newUser:'',
        photoUrl:'',
        saveToken: async () => {
            try {
                const clientId = '969734947435-j3jlcdt6rin8vigsba73ibcofj2anlc6.apps.googleusercontent.com';
                const { type, accessToken, user } = await Google.logInAsync({ clientId });
                this.setState({
                    user:user
                });
               
                if (type === 'success') {
                    await fetch('https://arababendeapi20190415025913.azurewebsites.net/api/EmployeeExists?email=' + this.state.user.email, {
                      method: 'GET',
                      headers: {
                        'Accept': 'application/json',
                          'Content-Type': 'application/json',
                        }
                   })
                   .then((response) => response.json())
                   .then(async (responseJson) => {
                      if(responseJson){
                        await fetch('https://arababendeapi20190415025913.azurewebsites.net/api/FindPersonIdFromEmail?email='+ this.state.user.email, {
                          method: 'GET',
                          headers: {
                            'Accept': 'application/json',
                              'Content-Type': 'application/json',
                            }
                        })
                        .then((response) => response.json())
                        .then(async (responseJson) => {
                          this.setState({
                              empId: responseJson
                          })
                          const resp = await AsyncStorage.setItem('userToken', this.state.empId+'*'+this.state.user.photoUrl+'*'+this.state.user.name);
                          return resp;
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                       
                      }else{
                        await fetch('https://arababendeapi20190415025913.azurewebsites.net/api/Employee' , {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                              },
                            body:JSON.stringify(this.state.user)
                        })
                        .then((response) => response.json())
                        .then(async(responseJson) => {
                            const resp = await AsyncStorage.setItem('userToken', responseJson.PersonID+'*'+this.state.user.photoUrl+'*'+this.state.user.name);
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                    }
                   })
                   .catch((error) => {
                      console.error(error);
                   });
                  }  
            }
            catch (error) {
                this.setState({ error })
            }
        },
        removeToken: async () => {
            try {
                const resp = await AsyncStorage.removeItem('userToken');
                return resp
            }
            catch (error) {
                this.setState({ error })
            }
        },
        getToken: async () => {
            try {
                const resp = await AsyncStorage.getItem('userToken');
                return resp;
            }
            catch (error) {
                this.setState({ error })
            }
        }

    }


    componentWillMount() {
        AsyncStorage.getItem('userToken')
            .then((token) => {
                this.setState({ token })
            })
            .catch(error => {
                this.setState({ error })
            })
    }

    render() {
        return (
            <MyContext.Provider value={this.state}>
                {this.props.children}
            </MyContext.Provider>
        );
    }
}