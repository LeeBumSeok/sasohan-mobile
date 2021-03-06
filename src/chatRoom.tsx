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
            },
            connection: {
                connection: new WebSocket("ws://192.168.11.103:1323/connect")
            }
        }
    }
    user_id = this.props.route.params.user_ide;

    sendMessage = async(text: string, connection: WebSocket) => {
        let msg = {
          //"chat_room_id": chat_room_id,
          "id": this.user_id,
          "time": Date.now(),
          "text": text
        };
        connection.send(JSON.stringify(msg));
    }

    setInputMessage = (text: string) => {
        this.setState({sendMessageText: {...this.state.sendMessageText, message: text}})
    }

    resetInputMessage = () => {
        this.setState({sendMessageText: {...this.state.sendMessageText, message: ""}})
    }

    render() {
        return(
            <View style={styles.container}>
                <Text>{this.user_id}</Text>
                <Text>{this.state.sendMessageText.message}</Text>
                <TextInput
                style={styles.textInput}
                value={this.state.sendMessageText.message}
                onChangeText={this.setInputMessage}
                placeholder="전송할 내용을 입력하세요."
                />
                <Button
                isLoading={this.state.loading.sendMessageLoading}
                onPress={
                    () => {
                        this.sendMessage(this.state.sendMessageText.message, this.state.connection.connection);
                        console.log(this.state.sendMessageText.message)
                        this.resetInputMessage()
                    }
                }
                activeOpacity={0.1}
                style={styles.btnKakaoLogin}
                textStyle={styles.txtKakaoLogin}>
                Send
                </Button>
            </View>
            
        )
    }
}