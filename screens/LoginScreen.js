import React, {Component} from 'react';
import { View,Text, StyleSheet, TextInput,Image, Dimensions, ImageBackground , AsyncStorage} from 'react-native';
import { MyContext } from '../Provider';
import {Icon,Button} from 'react-native-elements';


class LoginScreen extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
          user:'',
          userExist:'false',
          photoId:'',
          empId:'',
          newUser:{
              PersonId:0,
              TelephoneNumber:'',
              Email:'',
              FirstName:'',
              LastName:''
          }
      };
  }
    
  _signInAsync = async (saveToken) => {
    saveToken()
        .then((data) => {
            this.props.navigation.navigate('App');
        })
        .catch((error) => {
            this.setState({ error })
        })

};
  render() {

    return(
        <ImageBackground
        style={{
          backgroundColor: '#ccc',
          flex: 1,
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
        }}
        source={require('../assets/images/5.jpeg')}
      >
      
       
      <View style={styles.bottom2}>
     
        </View>
      <View style={styles.bottom}>
        <MyContext.Consumer>
                    {context => ((
                        <Button
                        icon={<Icon
                          reverse
                          name='google'
                          type='material-community'
                          color='rgb(0,100,0)'
                          size={20}
                        />}
                        title="GOOGLE İLE GİRİŞ YAP"
                        onPress={() => this._signInAsync(context.saveToken)}
                        buttonStyle={{
                          backgroundColor: "rgb(0,100,0)"
                        }}
                      />
                    ))}
        </MyContext.Consumer>
      </View>
       

 
      </ImageBackground>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
    flexDirection: 'column',
    alignItems: 'center',
  },
  bottom2: {
    color:'white',
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    justifyContent: 'flex-end'
  },
 
  button: {
    textAlign: 'center',
    position: 'absolute',
    bottom:0,
  }
});
