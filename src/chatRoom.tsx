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

    sendMessage = (text: string) => {
        let msg = {
          //"chat_room_id": chat_room_id,
          //"user_id": this.user_id,
          //"time": Date.now(),
          "text": text
        };

        console.log(JSON.stringify(msg));
        this.state.connection.connection.send(JSON.stringify(msg));
    }

    checkMessage = () => {
        this.setState({sendMessageText: {...this.state.sendMessageText, message: this.state.sendMessageText.tmpMessage}})
        this.sendMessage(this.state.sendMessageText.message);
    }

    render() {
        return(
            <View style={styles.container}>
                <Text>{this.user_id}</Text>
                <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.setState({sendMessageText: {...this.state.sendMessageText, tmpMessage: text}})}
                placeholder="전송할 내용을 입력하세요."
                />
                <Button
                isLoading={this.state.loading.sendMessageLoading}
                onPress={this.checkMessage}
                activeOpacity={0.1}
                style={styles.btnKakaoLogin}
                textStyle={styles.txtKakaoLogin}>
                Send
                </Button>
            </View>
            
        )
    }
}