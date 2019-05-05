import React from 'react';
import {AsyncStorage,View,StyleSheet,Icon
} from 'react-native';
import {
  PacmanIndicator,
} from 'react-native-indicators';
import { ListItem,Card } from 'react-native-elements'
import call from 'react-native-phone-call'
import { ScrollView } from 'react-native-gesture-handler';

export default class ReservationListScreen extends React.Component {
  call(num) {
    if(num!=""){
      const args = {
        number: num,
        prompt: false,
      };
      call(args).catch(console.error);
    }
    
  };
  constructor(props) {
    super(props);
    this.state = {
      reqList:[],
      animating: true,
      resList:[],

    };
  }
  static navigationOptions = {
    header: null,
  };
  componentDidMount = () =>
  {
    this.setState({
      animating: true
    });
    const {navigation} = this.props;
    navigation.addListener ('willFocus', () =>
    fetch('https://arababendeapi20190415025913.azurewebsites.net/api/Request', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
        }
    })
    .then((response) => response.json())

    .then((responseJson) => {
      this.setState({
        reqList:responseJson[0],
        resList:responseJson[1],
        animating:false
        });
    })
    .catch((error) => {
        console.error(error);
    })
    );
    AsyncStorage.getItem('userToken').then((token) => {
      if(token){
        this.setState({
        personId: token.split('*')[0],
        photoUrl: token.split('*')[1],
        animating:false,
      });
      fetch('https://arababendeapi20190415025913.azurewebsites.net/api/Request', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
        }
    })
    .then((response) => response.json())

    .then((responseJson) => {
      this.setState({
        reqList:responseJson[0],
        resList:responseJson[1],
        animating:false
        });
    })
    .catch((error) => {
        console.error(error);
    });
      }
    });
   
  
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
      return (
        <ScrollView style={{marginTop:20}}>
 <Card title="ARABA KİMDE">
   {
     this.state.reqList.map((u, i) => {
       return (
         <ListItem    key={i}
          leftAvatar={{ source: { uri: u.PhotoUrl } }}
          title={u.isim+'\nARAÇ:'+u.Plaka}
          subtitle={u.Duration=="0"?'Kısa Süreli':'Uzun Süreli'} button onPress={() => {this.call(u.TelephoneNumber)}}   
          rightIcon={{ name: 'phone',color:'rgb(9, 82, 163)' }}
          ></ListItem>
       
       );
     })
   }
 </Card>
 <Card title="REZERVASYON LİSTESİ">
   {
     this.state.resList.map((u, i) => {
       return (
         <ListItem    key={i}
          leftAvatar={{ source: { uri: u.PhotoUrl } }}
          title={u.Name+' \nARAÇ: '+u.Plaka}
          subtitle={"Gerekçe: "+u.Aim+"\nBaşlangıç: "+u.BeginDate+"\n"+"Bitiş: "+u.EndDate} button onPress={() => {this.call(u.TelephoneNumber)}} 
          rightIcon={{ name: 'phone',color:'rgb(9, 82, 163)' }}
          />
     
       );
     })
   }
 </Card>
           </ScrollView>
           
      
    );
    }
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
  
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
 
});