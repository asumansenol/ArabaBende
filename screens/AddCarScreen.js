import React from 'react';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import {
  PacmanIndicator,
} from 'react-native-indicators';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,AsyncStorage,
} from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { Card,Button,Icon, Divider } from 'react-native-elements';

var radio_props = [
  { label: 'Kısa süreli (15 dk)', value: 0 },
  { label: 'Uzun süreli (>15 dk)', value: 1 }
];

export default class AddCarScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.onPressSave = this.onPressSave.bind(this);
    this.onPressDrop = this.onPressDrop.bind(this);
    this.state = {
      animating: true,
      dialogVisible:false,
      vehicleList: [],
      value: '0',
      personId: '',
      buttonType:'',
      vehicleID:0
    };
  }
  componentDidMount = () => {
    this.setState({
      animating: true
    });
    const {navigation} = this.props;
    navigation.addListener ('willFocus', () =>
    fetch('https://arababendeapi20190415025913.azurewebsites.net/api/Vehicle', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          vehicleList: responseJson,
          animating:false
        });
      })
      .catch((error) => {
      })
    );
    fetch('https://arababendeapi20190415025913.azurewebsites.net/api/Vehicle', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          vehicleList: responseJson,
          animating:false
        });
      })
      .catch((error) => {
      });
    AsyncStorage.getItem('userToken').then((token) => {
      if(token){
        this.setState({
          personId: token.split('*')[0],
      });
    
      }
    });
 
  }
  Save(vehicleIDFromCard) {
    this.setState({
      animating: true
    });
    const request = Object.assign({}, this.state.request, {
      PersonID: this.state.personId,
      DurationCheck: this.state.value,
      VehicleID: vehicleIDFromCard,
      RequestID: 0,
    });
   fetch('https://arababendeapi20190415025913.azurewebsites.net/api/Request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          vehicleList: responseJson  ,
          animating: false,
          dialogVisible:false
         
        });
      })
      .catch((error) => {
      });

  }
  
  Drop(vehicleIDFromCard) {
    this.setState({
      animating: true
    });
    fetch('https://arababendeapi20190415025913.azurewebsites.net/api/VehicleInUsed?id=' + vehicleIDFromCard, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          vehicleList: responseJson,
          animating:false,
          dialogVisible:false
        });
      })
      .catch((error) => {
      });
  }
  radioButtonChanged(item) {
    this.setState({ value: item });
  }


  SaveOrDrop(){
    if(this.state.buttonType=="save"){
      this.setState({
        animating: true
      });
      const request = Object.assign({}, this.state.request, {
        PersonID: this.state.personId,
        DurationCheck: this.state.value,
        VehicleID: this.state.vehicleID,
        RequestID: 0,
      });
     fetch('https://arababendeapi20190415025913.azurewebsites.net/api/Request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            vehicleList: responseJson  ,
            animating: false,
            dialogVisible:false
           
          });
        })
        .catch((error) => {
        });
    } else{
   this.setState({
      animating: true
    });
    fetch('https://arababendeapi20190415025913.azurewebsites.net/api/VehicleInUsed?id=' + this.state.vehicleID, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          vehicleList: responseJson,
          animating:false,
          dialogVisible:false
        });
      })
      .catch((error) => {
      });
    }
  }
  onPressSave(element) {
    this.setState({ dialogVisible: true,buttonType:"save",vehicleID:element.VehicleID });
  }
  onPressDrop(element) {
    this.setState({dialogVisible: true,buttonType:"drop",vehicleID:element.VehicleID});
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
      
   <ScrollView style={styles.container}> 
   <ConfirmDialog
    title="Onay Ekranı"
    message="Araba ile ilgili alma/bırakma işlemi yapmak istediğinize emin misiniz?"
    visible={this.state.dialogVisible}
    onTouchOutside={() => this.setState({dialogVisible: false})}
    positiveButton={{
        title: "EVET",
        onPress: () => this.SaveOrDrop()
    }}
    negativeButton={{
        title: "HAYIR",
        onPress: () => this.setState({dialogVisible: false})
    }}
/>
      { this.state.vehicleList.map(element => {
        if(element.EnabledFlag=="1"){
          return  <Card key={element.VehicleID+'car'}> 
    
                      <Text key={element.VehicleID +'text'} style={{marginLeft: 10,color:"rgb(69, 66, 71)", textAlign: 'center',marginBottom:10,fontSize:20,fontWeight:"bold"}}>{element.Plaka} </Text>
                        <Divider style={{marginBottom:10}}/>
                        <RadioForm key={element.VehicleID+'radio'} 
                          radio_props={radio_props}
                          initial={0} style={{marginBottom:10}}
                          itemShowKey="label"
                          itemRealKey="value"
                          circleSize={16}
                          formHorizontal={false}
                          onPress={(item) => { this.setState({ value: item }) }
                          }
                        />
                      
                           
                   
                            <Button   type="outline" 
                              titleStyle={{ 
                                color: 'rgb(0,100,0)',
                                }}
  
  title="ARABA BENDE"
  onPress={() => this.onPressSave(element) }
  buttonStyle={{ 
  borderRadius:5,
  borderWidth: 1,
  borderColor: 'rgb(67, 192, 74)',
  }}
/>
              </Card> 
        }else{
          return  <Card key={element.VehicleID+'card'}> 
                      <Text key={element.VehicleID +'text'} style={{marginLeft: 10,color:"rgb(69, 66, 71)", textAlign: 'center',marginBottom:10,fontSize:20,fontWeight:"bold"}}>{element.Plaka} </Text>
                        <Divider style={{marginBottom:10}}/>
                        <Button   type="outline" 
                              titleStyle={{ 
                                color: 'rgb(79, 118, 220)',
                                }}
  
  title="ARABAYI BIRAK"
  onPress={() => this.onPressDrop(element) }
  buttonStyle={{ 
  borderRadius:5,
  borderWidth: 1,
  borderColor: 'rgb(79, 118, 220)',
  }}
/>

                          
              </Card> 
        }
     
                 
   })}
 </ScrollView>
 
    )
    }
    
 
  }
}

const styles = StyleSheet.create({
  loginScreenButton:{
    marginRight:40,
    marginLeft:40,
   marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#1E6738',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  loginText:{
      color:'#fff',
      textAlign:'center',
      paddingLeft : 10,
      paddingRight : 10
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor:'red'
  },
});
