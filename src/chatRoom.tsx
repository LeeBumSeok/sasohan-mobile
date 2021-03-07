import React from 'react'
import {View, TextInput, Text} from 'react-native'
import styles from './styles'

// @ts-ignore
import Button from 'apsl-react-native-button'


interface room {
    chat_room_id: string,
    users: Array<string>
}

type loadingProps = {
    sendMessageLoading: boolean
}

type messageProps = {
    message: string;
    tmpMessage: string;
}

type connectionProps = {
    connection: WebSocket
}

type State = {
    room: room;
    loading: loadingProps;
    sendMessageText: messageProps;
    connection: connectionProps;
}
  

export default class chatRoom extends React.Component<any, State> { 
    constructor(props: any) {
        super(props);

        this.state = {
            room: {
                chat_room_id: '',
                users: new Array()
            },
            loading: {
                sendMessageLoading: false
            },
            sendMessageText: {
                message: '',
                tmpMessage: ''
            },
            connection: {
                connection: new WebSocket("ws://192.168.0.5:1323/connect")
            }
        }
    }
    user_id = this.props.route.params.user_ide;
    aa = "123123"


      // sendMessage sends mesg to chat room with the given chat room ID.
    sendMessage = async(text: string, connection: WebSocket) => {
        let msg = {
            "id" : this.user_id,
            "user_id": this.user_id,
            "chat_room_id": this.state.room.chat_room_id,
            "time": Date.now(),
            "text": text,
        };
        connection.send(JSON.stringify(msg));
        console.log(connection.send(JSON.stringify(msg)))
    }

    setInputMessage = (text: string) => {
        this.setState({sendMessageText: {...this.state.sendMessageText, tmpMessage: text}})
    }

    resetInputMessage = () => {
        this.setState({sendMessageText: {...this.state.sendMessageText, tmpMessage: ""}})
    }

    // newChatRoomID generates an unique chat room ID.
    newChatRoomID = () => {
        Date.now().toString();
    }

    // newChatRoom creates a new chat room with given user lists.
    newChatRoom = (users: Array<string>) => {
        let obj =  {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'},
            body: JSON.stringify({
                //"chat_room_id": this.newChatRoomID(),
                "chat_rood_id": "123123123",
                //"users": users
                "users": [this.user_id, "1332"]
            })
        }
        fetch('http://192.168.0.5:1323/newchat', obj)
    }

    render() {
        return(
            <View style={styles.container}>
                <Text>{this.user_id}</Text>
                {/* <Text>{this.state.sendMessageText.message}</Text> */}
                <TextInput
                style={styles.textInput}
                value={this.state.sendMessageText.tmpMessage}
                onChangeText={(text) => this.setInputMessage(text)}
                placeholder="전송할 내용을 입력하세요."
                />
                <Button
                isLoading={this.state.loading.sendMessageLoading}
                onPress={
                    () => {
                        this.setState({sendMessageText: {...this.state.sendMessageText, message: this.state.sendMessageText.tmpMessage}})
                        this.sendMessage(this.state.sendMessageText.message, this.state.connection.connection);
                        console.log(this.state.sendMessageText.message)
                    }
                }
                activeOpacity={0.5}
                style={styles.btnKakaoLogin}
                textStyle={styles.txtKakaoLogin}>
                Send
                </Button>

                {/* <Button
                isLoading={this.state.loading.sendMessageLoading}
                onPress={this.newChatRoom([this.user_id, '1234'])}
                activeOpacity={0.5}
                style={styles.btnKakaoLogin}
                textStyle={styles.txtKakaoLogin}>
                새로운 채팅방 만들기  
                </Button> */}
            </View>
            
        )
    }
}