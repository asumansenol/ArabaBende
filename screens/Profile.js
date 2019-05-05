import React from 'react';
import {
  PacmanIndicator,
} from 'react-native-indicators';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View, AsyncStorage,
} from 'react-native';
import { MyContext } from '../Provider';
import { Button,Icon,Input } from 'react-native-elements';


export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      animating: true,
      userName:'',
      user:'',
      empId: '',
      photoUrl: '',
      phoneNum:'',
      phoneNumText:''
    };
  }
  componentDidMount = () =>
  {
    this.setState({
      animating: true
    });
    const {navigation} = this.props;
    navigation.addListener ('willFocus', () =>
    fetch('https://arababendeapi20190415025913.azurewebsites.net/api/PhoneExists?empId='+ this.state.empId, {
      method: 'GET',
    headers: {
        'Content-Type': 'application/json',
      }
  })
  .then((response) => response.json())
  .then((responseJson) => {
    this.setState({
      phoneNum:responseJson,
      animating:false,
      });
  })
  .catch((error) => {
  })
    );
   AsyncStorage.getItem('userToken').then((token) => {
        if(token){
          this.setState({
            empId: token.split('*')[0],
          photoUrl: token.split('*')[1],
          userName: token.split('*')[2],
        });
        fetch('https://arababendeapi20190415025913.azurewebsites.net/api/PhoneExists?empId='+ this.state.empId, {
          method: 'GET',
        headers: {
            'Content-Type': 'application/json',
          }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          phoneNum:responseJson,
          animating:false,
          });
      })
      .catch((error) => {
      });
        }
      });
 
  }
  addPhone (){
    this.setState({
      animating:true
       });
    fetch('https://arababendeapi20190415025913.azurewebsites.net/api/AddPhone?phone='+this.state.phoneNumText+'&empId='+ this.state.empId, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        phoneNum:responseJson,
        animating:false
         });
    })
    .catch((error) => {
    });
}
renderContactHeaderWithInputText = () => {
  const { avatar, name, bio } = this.props
  return (
    <View style={styles.headerContainer}>
      <View style={styles.userRow}>
        <Image
          style={styles.userImage}
          source={{
            uri: this.state.photoUrl,
          }}
        />
        <View style={styles.userNameRow}>
          <Text style={styles.userNameText}>{this.state.userName}</Text>
        </View>
      </View>
      <Input style={{margin:16}} onChangeText={(phoneNumText)=> this.setState({phoneNumText})} 
  placeholder='Telefon Numarası(05541112233)'  keyboardType={'phone-pad'}
  shake={true}   style={{  borderBottomColor: this.state.isFocused
    ? 'gray'
    : 'white',color:'white',
borderBottomWidth: 1,marginBottom:10}}
  rightIcon={
    <Icon onPress={() => this.addPhone()}
      name='phone'
      size={24}
      color='rgb(9, 82, 163)'
    />
  }
/>

        <View>
        <MyContext.Consumer>
          {context => ((
                   <View style={{width:100,marginBottom:10,marginRight: 10,marginTop:10}} >
                   <Button title="Sign out"onPress={() => this._signOutAsync(context.removeToken)} />
                   </View>
         
              
          ))}
        </MyContext.Consumer>
        </View>
    </View>
  )
}
renderContactHeader = () => {
  const { avatar, name, bio } = this.props
  return (
    <View style={styles.headerContainer}>
      <View style={styles.userRow}>
        <Image
          style={styles.userImage}
          source={{
            uri: this.state.photoUrl,
          }}
        />
        <View style={styles.userNameRow}>
          <Text style={styles.userNameText}>{this.state.userName}</Text>
        </View>
        <View style={styles.userBioRow}>
          <Text style={styles.userBioText}>{'Telefon Numarası: ' + this.state.phoneNum}</Text>
        </View>
      </View>
      <View style={styles.socialRow}>
        <View>
        <MyContext.Consumer>
          {context => ((
                   <View style={{width:100,marginBottom:10,marginRight: 10,marginTop:10}} >
                   <Button title="Sign out"onPress={() => this._signOutAsync(context.removeToken)} />
                   </View>
         
              
          ))}
        </MyContext.Consumer>
        </View>
      </View>
    </View>
  )
}
  render() {
    if(this.state.animating){
      return (
        <View style={styles.container}>
          {/*Code to show Activity Indicator*/}
          <PacmanIndicator size={60} color="rgb(9, 82, 163)" />
          {/*Size can be large/ small*/}
        </View>
      );  
    }else{
      if(this.state.phoneNum!=""){
        return (
          <ScrollView style={styles.scroll}>
          <View style={[styles.container, this.props.containerStyle]}>
            <View style={styles.cardContainer}>
              {this.renderContactHeader()}
            </View>
          </View>
        </ScrollView>
  
        
      )
      }else{
        return (
          <ScrollView style={styles.scroll}>
          <View style={[styles.container, this.props.containerStyle]}>
            <View style={styles.cardContainer}>
              {this.renderContactHeaderWithInputText()}
            </View>
          </View>
        </ScrollView>
  
        
      )
      }
    }
  
 
  }

  _signOutAsync = async (removeToken) => {
    removeToken()
        .then(() => {
            this.props.navigation.navigate('Auth');
        })
        .catch(error => {
            this.setState({ error })
        })
};
}

const styles = StyleSheet.create({
  textin: {
    position: 'absolute',
    bottom:0,
    color:'white'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  cardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 10,
    marginTop: 45,
  },
  indicatorTab: {
    backgroundColor: 'transparent',
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  sceneContainer: {
    marginTop: 10,
  },
  socialIcon: {
    marginLeft: 14,
    marginRight: 14,
  },
  socialRow: {
    flexDirection: 'row',
  },
  tabBar: {
    backgroundColor: '#EEE',
  },
  tabContainer: {
    flex: 1,
    marginBottom: 12,
  },
  tabLabelNumber: {
    color: 'gray',
    fontSize: 12.5,
    textAlign: 'center',
  },
  tabLabelText: {
    color: 'black',
    fontSize: 22.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  userBioRow: {
    marginLeft: 40,
    marginRight: 40,
  },
  userBioText: {
    color: 'gray',
    fontSize: 13.5,
    textAlign: 'center',
  },
  userImage: {
    borderRadius: 60,
    height: 120,
    marginBottom: 10,
    width: 120,
  },
  userNameRow: {
    marginBottom: 10,
  },
  userNameText: {
    color: '#5B5A5A',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 12,
  },
});
