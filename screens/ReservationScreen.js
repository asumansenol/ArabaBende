import React from 'react';
import {
  PacmanIndicator,
} from 'react-native-indicators';
import {
  ScrollView,
  StyleSheet,
  Text,StatusBar,
  View,AsyncStorage,
  TextInput,Alert
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import DateTimePicker from "react-native-modal-datetime-picker";
import { Button,Card ,Divider} from 'react-native-elements';

export default class ReservationScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      animating: true,
      date1:new Date,
      date2: new Date,
      isDateTimePickerVisible1: false,
      isDateTimePickerVisible2: false,
      vehicleList:[],
      startDate:'',
      endDate:'',
      isVisible: false,
      vehicleID:'',
      gerekce:'',
      personId:'',
     
    };
  }
  componentDidMount = () =>
  {
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
        vehicleList:responseJson,
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
        vehicleList:responseJson,
        animating:false
        });
    })
    .catch((error) => {
    });
    AsyncStorage.getItem('userToken').then((token) => {
      if(token){
        this.setState({
        personId: token.split('*')[0],
        animating:false,
      });
      }
    });
  }
 
  showDateTimePicker1 = () => {
    this.setState({ isDateTimePickerVisible1: true });
  };
 
  hideDateTimePicker1 = () => {
    this.setState({ isDateTimePickerVisible1: false });
  };
 
  handleDatePicked1 = date1 => {
    var day= date1.getDate()<10?'0'+date1.getDate():date1.getDate();
    var month= (date1.getMonth()+1)<10?'0'+(date1.getMonth()+1):(date1.getMonth()+1);
    var year=date1.getFullYear();
    var hour =date1.getHours()<10? "0"+date1.getHours() : date1.getHours() ; 
    var min =   date1.getMinutes()<10?"0"+  date1.getMinutes(): date1.getMinutes();
    var datestart= day +"/"+month+"/"+year+" " +hour+":"+min+":"+"00";
    var datestart= day +"/"+month+"/"+year+" " +hour+":"+min+":"+"00";
    this.setState({startDate:datestart});
    this.hideDateTimePicker1();
  };
  showDateTimePicker2 = () => {
    this.setState({ isDateTimePickerVisible2: true });
  };
 
  hideDateTimePicker2 = () => {
    this.setState({ isDateTimePickerVisible2: false });
  };
  handleDatePicked2 = date2 => {
    var day= date2.getDate()<10?'0'+date2.getDate():date2.getDate();
    var month= (date2.getMonth()+1)<10?'0'+(date2.getMonth()+1):(date2.getMonth()+1);
    var year=date2.getFullYear();
    var hour =date2.getHours()<10? "0"+date2.getHours() : date2.getHours() ;  
    var min =   date2.getMinutes()<10?"0"+  date2.getMinutes(): date2.getMinutes();
    var dateend= day +"/"+month+"/"+year+" " +hour+":"+min+":"+"00";
    this.setState({endDate:dateend});
    this.hideDateTimePicker2();
  };
  handleFocus = event => {
    this.setState({ isFocused: true });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
};

handleBlur = event => {
  this.setState({ isFocused: false });
  if (this.props.onBlur) {
    this.props.onBlur(event);
  }
};
Drop(vehicleIDFromCard) {
  this.setState({
    animating: true
  });
  fetch('https://arababendeapi20190415025913.azurewebsites.net/api/VehicleInUsedReservation?id=' + vehicleIDFromCard, {
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
      });
    })
    .catch((error) => {
    });
}


Save(vehicleIDFromCard) {
  this.setState({
    animating: true
  });
  const reservation = Object.assign({}, this.state.reservation, {
    PersonID: this.state.personId,
    Aim: this.state.gerekce,
    BeginDate:this.state.startDate,
    EndDate:this.state.endDate,
    VehicleID:vehicleIDFromCard,
    ReservationID:0
  });
  fetch('https://arababendeapi20190415025913.azurewebsites.net/api/Reservation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservation)
  })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson==true){
        Alert.alert(
          'UYARI',
          '',
          [
            {text: 'Kapat', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'Bu tarihler arasında başka bir rezervasyon bulunmaktadır', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
      
      }
      this.setState({
        animating:false,
      });
    })
    .catch((error) => {
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
 
      <ScrollView>  
      { this.state.vehicleList.map(element => {
          return  <Card key={element.VehicleID +'Card'}>
          <Text  style={{marginLeft: 10,marginBottom:10,fontSize:20,fontWeight:"bold",color:"rgb(69, 66, 71)", textAlign: 'center'}}>{element.Plaka} </Text>
           <Divider style={{marginBottom:10}}/>
           <Card>
           <TextInput  
                        multiline = {true}
                        underlineColorAndroid = "gray"
                        placeholderTextColor = "gray"
                        numberOfLines = {4}
                        placeholder="Gerekçe"
                        style={{borderColor:'black'}}
                        onChangeText={(gerekce)=> this.setState({gerekce:gerekce})} 
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}   
          />
           </Card>
         
          <Card  style={{marginBottom:10,marginTop:10}}>
          <Text style={{marginBottom:10,color:"gray"}}>Başlangıç</Text>
          <DatePicker
          style={{ width: 200 }}
          date={this.state.date1} 
          mode="datetime" //The enum of date, datetime and time
          placeholder="Başlangıç"
          format="YYYY-MM-DD HH:mm:ss"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 36,
            },
          }}
          onDateChange={date1 => {
            
            var datestart= date1.split(' ')[0].replace(/-/g, '/') +' '+date1.split(' ')[1];
            this.setState({startDate:datestart,date1:date1});
          }}
        />
        
      
        <View    style={{marginBottom:10,marginTop:10}}>
        <Text style={{marginBottom:10,color:"gray"}}>Bitiş</Text>
          <DatePicker
           date={this.state.date2} 
          style={{ width:200 }}
          mode="datetime" //The enum of date, datetime and time
          placeholder="Bitiş"
          format="YYYY-MM-DD HH:mm:ss"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 36,
            },
          }}
          onDateChange={date2 => {
            var dateend= date2.split(' ')[0].replace(/-/g, '/') +' '+ date2.split(' ')[1];
            this.setState({endDate:dateend,date2:date2});
          }}
        />
          
          </View>
          
          </Card>
          <View  style={{marginBottom:10,marginTop:10}}>
          <Button   type="outline" 
                              titleStyle={{ 
                                color: 'rgb(0,100,0)',
                                }}
  
                                title="Rezervasyon Yap"
                                onPress={()=>this.Save(element.VehicleID)}
  buttonStyle={{ 
  borderRadius:5,
  margin:16,
  borderWidth: 1,
  borderColor: 'rgb(67, 192, 74)',
  }}
/>
          </View>
         
       
          
          </Card>           
          })}
          </ScrollView>
            )
  }
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
