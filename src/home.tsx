/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import chatJSON from './json/chat.json'
import { Queue } from 'queue-typescript';

// @ts-ignore
import Button from 'apsl-react-native-button'


type chatProps = {
  user_id: string,
  chat_room_id: string,
  time: number,
  text: string
}

type Props = {
  navigation: any
}

type State = {
  list: any;
  itemToRender: number;
  setChatItems: chatProps;
}

class HomeScreen extends Component<Props, State> {

  constructor(props: any) {
    super(props);

    this.state = {
      list: chatJSON,
      itemToRender: 10,
      setChatItems: {
        user_id: "",
        chat_room_id: "",
        time: 0,
        text: ""
      }
    }
  }

  convertUnixTime = (time: number) => {
    var date = new Date(time * 1000);
    var year = date.getFullYear();
    var month = "0" + (date.getMonth() + 1);
    var day = "0" + date.getDate();
    var hour = "0" + date.getHours();
    var minute = "0" + date.getMinutes();
    var second = "0" + date.getSeconds();

    return year + "-" + month.substr(-2) + "-" + day.substr(-2) + " " + hour.substr(-2) + ":" + minute.substr(-2) + ":" + second.substr(-2);
  }

  getChat = () => {
    console.log(JSON.stringify(chatJSON.messages));
    console.log(chatJSON.messages[1]['time'])
    console.log(this.convertUnixTime(chatJSON.messages[1]['time']))
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>HomeScreens</Text>
        <Button
          onPress={this.getChat}
          activeOpacity={0.5}>
        </Button>
      </View>
    );
  }
}

export default HomeScreen;
