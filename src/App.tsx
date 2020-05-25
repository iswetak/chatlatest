import React, { useState, useEffect } from 'react'
import { GiftedChat, IMessage, User,  Reply, MessageText } from 'react-native-gifted-chat'
// import EStyleSheet from 'react-native-extended-stylesheet';
// import  MediaQuery  from "react-native-responsive";
import  MediaQuery  from "react-responsive";
import { View, Dimensions,KeyboardAvoidingView, Text  } from 'react-native'
import { Image,TouchableOpacity, Linking, StyleSheet, } from 'react-native'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import './App.css'
// import {WebView} from 'react-native-w'
import htmlToImage from 'html-to-image';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
//   listenOrientationChange as loc,
//   removeOrientationListener as rol
// } from 'react-native-responsive-screen';

export interface RoboMessage extends ChatMessage{
  longMessage? : string;
  shortMessage? : string;
  quickReplies : [QuickReplyElement];
  cardItems? : [CardItem]
  clearContext? : boolean;
}



export interface QuickReplyElement {
  title : string;
  clientIntent? : number;
  payload? : {};
}

export interface CardItem{
  title? : string;
  subtitle? : string;
  buttons? : [QuickReplyElement];
  html? : string;
}
export interface ClientMessage extends ChatMessage{
  text? : string;
  displayText? : string;
  //userID? : string;
  accountID? : string;
  isLive? : boolean;
  sessionKey? : string;
}

export interface ChatMessage{
  msgTime? : number;
  sender? : string;
  intent? : number;
  contextID? : number;
  context? : {};
  payload? : {};
  messageType? : number;
}

const App: React.FC = () => {
  useEffect(() => {
    console.log("will do on mount once")
    fetch(url, 
   
      {
         method: 'GET',
         
         
           headers: 
          {
        
            'X-api-key': 'fyX65yeBWd5RtlunH4ikc7voovP3Nn1Y5iHFx1Gv'
            
            
          }
       })
        .then(
          res => res.json())
        .then(res => {
          // console.log('resgk --> '+res)
          let newMsg: IMessage[] =[];
         
          let promises : Promise<any>[] = []
          for (var i = 0, len = res.length; i < len; i++) {
            let json = JSON.parse(res[i])
            if(json.cardItems && json.cardItems.length>0){
              
              let frag =new DOMParser().parseFromString(json.cardItems[0].html,"text/html");
              const promise3 = new Promise(function(resolve, reject) {
                htmlToImage.toSvgDataURL(frag.documentElement,{height:250,width:250})
                .then(function (dataUrl) {
                  var received : IMessage = {_id:latestID++,text:json.longMessage!=null?json.longMessage:json.displayText  ,user:{_id:json.sender==="ROBO"?2:1,name:json.sender,avatar: json.sender==="ROBO"?'https://robotalk-lkp.s3.ap-south-1.amazonaws.com/lkp_logo.jpg':''}, createdAt: new Date()}
              
                  console.log("Image created",dataUrl)
                 
                  received.image = dataUrl
                 
                 // received.text = "Hello world";
                 
              
                 console.log("pushing",received._id,json.cardItems)
                
                 resolve(received)
                })
                .catch(function (error) {
                  console.error('oops, something went wrong!', error);
                });
              });

              
              promises.push(promise3)

            }else{
              var received : IMessage = {_id:latestID++,text:json.longMessage!=null?json.longMessage:json.displayText  ,user:{_id:json.sender==="ROBO"?2:1,name:json.sender,avatar: json.sender==="ROBO"?'https://robotalk-lkp.s3.ap-south-1.amazonaws.com/lkp_logo.jpg':''}, createdAt: new Date()}
            
              
             // console.log("pushing",received._id,json.cardItems)
             const promise3 = new Promise(function(resolve, reject) {
             resolve(received)
            });
            promises.push(promise3)
            }
          
           
            
            }

            Promise.all(promises).then(function(values) {
              for (var i = 0, len = values.length; i < len; i++) {
                //console.log("repaed valus:",values[i])
              newMsg.push(values[i]);
              }
            
              setMessages([...messages, ...newMsg])
            });

            
         
        })
        .catch(error => {
         console.log("error",error);
          
        });
  }, []);

  
 var latestID = 1;
 var currentContext : {};
 var  referralCode = "";
 var userID = "a93b6444-ca9c-11e7-917d-0221462188d8";
  var url= `https://b1ppljae3m.execute-api.ap-south-1.amazonaws.com/lkp/v1/chat/a93b6444-ca9c-11e7-917d-0221462188d8/history?startScore=0`;
  // var url= `https://b1ppljae3m.execute-api.ap-south-1.amazonaws.com/lkp/v1/chat/a93b6444-ca9c-11e7-917d-0221462188d8/history?startScore=0&referralCode=${referralCode}`;

  if(userID){
    url = `https://b1ppljae3m.execute-api.ap-south-1.amazonaws.com/lkp/v1/chat/a93b6444-ca9c-11e7-917d-0221462188d8/history?startScore=0&userID=${userID}`;
    console.log("lodaing:"+url);

    }
  const [messages, setMessages] = useState<IMessage[]>([
    
  ])

  const [replyToQuickReply, setQuickReplies] = useState<Map<any,QuickReplyElement>>(new Map<any,QuickReplyElement>())
  
 const onQuickReply = (replies : Reply[])=>{

  replies.forEach(element => {
    let qr = replyToQuickReply.get(element.title)!
    var sent : IMessage = {_id:messages.length+1,text:qr!.title,user:{_id:1,name:"sweta", avatar: ""}, createdAt: new Date()};
    let newMsg : IMessage[] = [];
    newMsg.push(sent);
    let msg : ClientMessage = {intent:qr.clientIntent,displayText:qr.title,messageType:4,payload:qr.payload};
    fetch(`https://b1ppljae3m.execute-api.ap-south-1.amazonaws.com/lkp/v1/chat/a93b6444-ca9c-11e7-917d-0221462188d8/message`, 
   
      {
         method: 'POST',
         
         body:JSON.stringify(msg),
           headers: 
          {
        
            'X-api-key': 'fyX65yeBWd5RtlunH4ikc7voovP3Nn1Y5iHFx1Gv',
            'Content-Type':'application/json'
            
          }
       })
        .then(
          res => res.json())
        .then(res => {
          
          
          let roboMessage : RoboMessage = res
          console.log("received resposne",roboMessage)
          var received : IMessage = {_id:messages.length+2,text:roboMessage.longMessage!,user:{_id:2,name:"sweta",   avatar: 'https://robotalk-lkp.s3.ap-south-1.amazonaws.com/lkp_logo.jpg'}, createdAt: new Date()}
          if(roboMessage.quickReplies!=null){
            var replies : Reply[] = [];
            let replyToQuickReply1 : Map<any,QuickReplyElement> = new Map<any,QuickReplyElement>();
          for (var i2 = 0, len2 = roboMessage.quickReplies.length; i2 < len2; i2++) {
              let qr = roboMessage.quickReplies[i2];
             let reply : Reply = {title : qr.title!,value : qr.title!,messageId:i2}
             replies.push(reply)
             replyToQuickReply1.set(reply.title,qr);
             console.log("Setting quick reply:"+reply.title);
            }
            received.quickReplies = {type:"radio",values:replies,keepIt:false}
          setQuickReplies(replyToQuickReply1)
          }

          if(roboMessage.cardItems && roboMessage.cardItems!.length>0){
            let frag =new DOMParser().parseFromString(roboMessage.cardItems[0].html!,"text/html");
            htmlToImage.toSvgDataURL(frag.documentElement,{height:250,width:250})
            .then(function (dataUrl) {
              console.log("Image created",dataUrl)
              received.image = dataUrl
             newMsg.push(received)
             setMessages([...messages, ...newMsg])
            })
            .catch(function (error) {
              console.error('oops, something went wrong!', error);
            });
          }else{
            newMsg.push(received)
            setMessages([...messages, ...newMsg])
          }
         
          
          
         
        })
        .catch(error => {
         console.log("error",error);
          
        });

    // setMessages([...messages, ...newMsg])   
    });
 }
  
  const onSend = (newMsg: IMessage[]) => {
    let toSend = newMsg[0];
   
    toSend._id = messages.length+1;
    let msg : ClientMessage = {text:toSend.text,displayText:toSend.text,messageType:2,context:currentContext,accountID:"",sessionKey:""};
    fetch(`https://b1ppljae3m.execute-api.ap-south-1.amazonaws.com/lkp/v1/chat/a93b6444-ca9c-11e7-917d-0221462188d8/message`, 
   
      {
         method: 'POST',
         
         body:JSON.stringify(msg),
           headers: 
          {
        
            'X-api-key': 'fyX65yeBWd5RtlunH4ikc7voovP3Nn1Y5iHFx1Gv',
            'Content-Type':'application/json'
            
          }
       })
        .then(
          res => res.json())
        .then(res => {
          
          let roboMessage : RoboMessage = res
          console.log("received resposne",roboMessage)
          var received : IMessage = {_id:messages.length+2,text:roboMessage.longMessage!,user:{_id:2,name:"sweta",   avatar: 'https://robotalk-lkp.s3.ap-south-1.amazonaws.com/lkp_logo.jpg'}, createdAt: new Date()}
            
          if(roboMessage.quickReplies!=null){
            var replies : Reply[] = [];
            let replyToQuickReply1 : Map<any,QuickReplyElement> = new Map<any,QuickReplyElement>();
          for (var i2 = 0, len2 = roboMessage.quickReplies.length; i2 < len2; i2++) {
              let qr = roboMessage.quickReplies[i2];
             let reply : Reply = {title : qr.title!,value : qr.title!,messageId:i2}
             replies.push(reply)
             replyToQuickReply1.set(reply.title,qr);
             console.log("Setting quick reply:"+reply.title);
            }
            received.quickReplies = {type:"radio",values:replies,keepIt:false}
          setQuickReplies(replyToQuickReply1)
          }
          newMsg.push(received)
          setMessages([...messages, ...newMsg])
          
         
        })
        .catch(error => {
         console.log("error",error);
          
        });
    
    
  }

  
  
 const renderMessageImage= (props :any) => {
  if(props.currentMessage.image){
    
    let sourceURl : string = props.currentMessage.image
    console.log("image url :",sourceURl)
    return (
      <View>
        {/* <webview></webview> */}
        <Image  source={{uri : sourceURl}} style={{height: 250,width:270}} 

        />
     
        
      </View>
    );
  }
    
  }

  

  const user: User = { _id: 1, name: 'me' }
  const inverted = false
  const renderUsernameOnMessage=true
  const { width, height } = Dimensions.get('window')
  return (
    // <MediaQuery minDeviceWidth={700}>
    <View style={{ height, width, backgroundColor: 'light', paddingVertical:20 }}>
      <View style={styles.responsiveBox} >
      <View style={{backgroundColor: '#F2F2F2', marginLeft: '0%',marginTop:'-3%', paddingVertical:10, width:350, borderLeftWidth:1,borderTopWidth:1,borderBottomWidth:1,borderRightWidth:1 ,borderColor: '#DCDCDC',}}>
        {/* <Link to='/'><ArrowBackIosIcon style={{ marginTop: 0, color:'#2196F3', marginLeft: 11}}></ArrowBackIosIcon></Link> */}
        <TouchableOpacity onPress={ ()=>{ Linking.openURL('https://rumitrade-lkp.s3.ap-south-1.amazonaws.com/index.html')}}  >
        <ArrowBackIosIcon style={{color: '#2196F3', marginLeft: '4%', marginTop: '3%'}}></ArrowBackIosIcon>
         </TouchableOpacity>

        <img src='https://getdrawings.com/free-icon/text-message-icons-free-53.png' style={{height: 35,width:35, marginLeft: 35, marginTop: -28 }}></img>
          <Text style={{ fontSize: 23,marginTop: -33,marginBottom:'2.5%', marginLeft: 68, }}>
              &nbsp;&nbsp;Robotalk</Text>
              </View>
      {/* <View><text style={{textAlign:'center', fontSize: 20,}}>Robotalk</text></View><br></br> */}
      <GiftedChat {...{ replyToQuickReply, renderMessageImage,messages, onSend,onQuickReply, user, renderUsernameOnMessage,inverted, }}/>  
    
    </View>
    {/* <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={80}/> */}
    </View>
    // </MediaQuery>


  )


    // const windowH= Dimensions.get('window').width
  // const windowW = Dimensions.get('window').height  
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  responsiveBox: {
    marginHorizontal:'5.8%',
    paddingTop:10,
     height: 500,
      width:352,
       borderLeftWidth:1
       ,borderTopWidth:1,
       borderBottomWidth:1,
       borderRightWidth:1 ,
       borderColor: 'gray',
        borderStyle: 'solid',
         position:'relative',
         
    '@media (min-width: 350) and (max-width: 500)': {
    responsiveBox: {
      marginHorizontal:'-97%',
    },    
  },

  },
  // '@media (min-width: 350) and (max-width: 500)': {
  //   responsiveBox: {
  //     marginHorizontal:'7%',
  //   }  
  // },
  
});

