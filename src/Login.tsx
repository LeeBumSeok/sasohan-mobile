/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {View, Text, Image, TextInput} from 'react-native';
import kakaoLogins, {KAKAO_AUTH_TYPES} from '@react-native-seoul/kakao-login'
import styles from './styles';

// @ts-ignore
import Button from 'apsl-react-native-button'

interface Profile {
  id: string,
  profile_image_url: any,
  account_type: string
}

interface Token {
  accessToken: string,
  refreshToken: string
}


type loadingProps = {
  loginLoading: boolean;
  logoutLoading: boolean;
  profileLoading: boolean;
  unlinkLoading: boolean;
  signinLoading: boolean;
  sendMessageLoading: boolean
}

type idInfoProps = {
  token: Token;
  profile: Profile;
}

type messageProps = {
  message: string
}

type connectionProps = {
  connection: WebSocket
}

type State = {
  loading: loadingProps;
  idInfo: idInfoProps;
  sendMessageText: messageProps;
  connection: connectionProps;
}

const TOKEN_EMPTY = {
  accessToken: 'cannot fetched access token',
  refreshToken: 'cannot fetched refresh token'
}

const PROFILE_EMPTY = {
  id: 'cannot fetched id',
  profile_image_url: '',
  account_type: ''
};

export default class LoginScreen extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      loading: {
        loginLoading: false,
        logoutLoading: false,
        profileLoading: false,
        unlinkLoading: false,
        signinLoading: false,
        sendMessageLoading: false
      },
      idInfo: {
        token: TOKEN_EMPTY,
        profile: PROFILE_EMPTY
      },
      sendMessageText: {
        message: ""
      },
      connection: {
        connection: new WebSocket("ws://192.168.0.5:1323/connect")
      }
    }
  }

  kakaoLogin = () => {
    console.log('login for kakao');
    this.setState({loading: {...this.state.loading, loginLoading: true}});

    kakaoLogins.login([KAKAO_AUTH_TYPES.Talk, KAKAO_AUTH_TYPES.Account]).then(result => {
      this.setState({idInfo: {...this.state.idInfo, token: {accessToken: result.accessToken, refreshToken: result.refreshToken}}})
      this.setState({loading: {...this.state.loading, loginLoading: false}}),
      console.log(`Login Finished:${JSON.stringify(result)}`,
      console.log(`Token:${JSON.stringify(this.state.idInfo.token)}`),
      );
    })
    .catch(err => {
    if (err.code === 'E_CANCELLED_OPERATION') {
      this.setState({loading: {...this.state.loading, loginLoading: false}})
      console.log(`Login Cancelled:${err.message}`);
    } else {
      this.setState({loading: {...this.state.loading, loginLoading: false}})
      console.log(`Login Failed:${err.code} ${err.message}`);
      }
    });
  };

  kakaoLogout = () => {
    console.log('Logout');
    this.setState({loading: {...this.state.loading, logoutLoading: true}});

    kakaoLogins.logout().then(result => {
      this.setState({idInfo: {...this.state.idInfo, token: TOKEN_EMPTY}})
      this.setState({idInfo: {...this.state.idInfo, profile: PROFILE_EMPTY}})
      console.log(`Logout Finished:${result}`);
      this.setState({loading: {...this.state.loading, logoutLoading: false}})
    })
    .catch(err => {
      this.setState({loading: {...this.state.loading, logoutLoading: false}})
      console.log(`Logout Failed:${err.code} ${err.message}`);
    });
  };

  getProfile = async() => {
    console.log('Get Profile Start');
    this.setState({loading: {...this.state.loading, profileLoading: true}})

    kakaoLogins.getProfile()
      .then(result => {
        this.setState({idInfo: {...this.state.idInfo, profile: {id: result.id, profile_image_url: result.profile_image_url, account_type: 'kakao'}}})
        this.setState({loading: {...this.state.loading, profileLoading: false}})
        console.log(`Get Profile Finished:${JSON.stringify(result)}`);
        this.connectToChatServer(this.state.idInfo.profile.id, this.state.connection.connection)
        this.props.navigation.navigate('chatRoom', {user_ide: this.state.idInfo.profile.id, user_account_type: this.state.idInfo.profile.account_type});
      })
      .catch(err => {
        this.setState({loading: {...this.state.loading, profileLoading: false}})
        console.log(`Get Profile Failed:${err.code} ${err.message}`);
      });
  };

  unlinkKakao = () => {
    console.log('Unlink Start');
    this.setState({loading: {...this.state.loading, unlinkLoading: true}})

    kakaoLogins.unlink().then(result => {
      this.setState({idInfo: {...this.state.idInfo, token: TOKEN_EMPTY}})
      this.setState({idInfo: {...this.state.idInfo, profile: PROFILE_EMPTY}})
      console.log(`Unlink Finished:${result}`);
      this.setState({loading: {...this.state.loading, unlinkLoading: false}})
      })
      .catch(err => {
        this.setState({loading: {...this.state.loading, unlinkLoading: false}})
        console.log(`Unlink Failed:${err.code} ${err.message}`);
      });
  };

  // connectToChatServer connects to chat server.
  // @param id: user ID
  connectToChatServer = async(id: string, connection: WebSocket) => {
    let body = {
      "id": id
    };

    connection.onopen = () => {
      connection.send(JSON.stringify(body));
    };

    connection.onmessage = (event: WebSocketMessageEvent) => {
      console.log(event.data);
    };

    connection.onerror = (error) => {
      console.log(console.error);
      connection.close();
    };

    connection.onclose = (event) => {
      console.log(event.code, event.message, event.reason);
    };
  }

  // disconnectFromChatServer closes connection from chat server.
  // @param id: user ID
  disconnectFromChatServer = async(id: string) => {
    fetch('http://192.168.0.5:1323/disconnect', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'id': id
      })
    }).then().catch()
  }

  // newChatRoomID generates an unique chat room ID.
  newChatRoomID = () => Date.now().toString();

  // newChatRoom creates a new chat room with given user lists.
  newChatRoom = (users: Array<string>) => {
    fetch('http://192.168.0.5:1323/newchat', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "chat_room_id": this.newChatRoomID(),
        "users": users
      })
    }).then().catch()
  }

  // sendMessage sends mesg to chat room with the given chat room ID.
  sendMessage = (id: string, chat_room_id: string, text: string, connection: WebSocket) => {
    let msg = {
      "chat_room_id": chat_room_id,
      "user_id": this.state.idInfo.profile.id,
      "time": Date.now(),
      "text": text
    };

    connection.send(JSON.stringify(msg));
  }

  render() {
    return(
      <View style={styles.container}>
      <View style={styles.profile}>
        <Image style={styles.profilePhoto} source={{uri: this.state.idInfo.profile.profile_image_url !== "" ? this.state.idInfo.profile.profile_image_url : undefined}} />
        <Text>{`id : ${this.state.idInfo.profile.id}`}</Text>
      </View>
      <View style={styles.content}>
        <Button
          isLoading={this.state.loading.loginLoading}
          onPress={() => {
            this.kakaoLogin();
            setTimeout(() => {
              this.getProfile();
            } , 500);
            }
          }
          activeOpacity={0.5}
          style={styles.btnKakaoLogin}
          textStyle={styles.txtKakaoLogin}>
          LOGIN
        </Button>
        <Button
          isLoading={this.state.loading.logoutLoading}
          onPress={this.kakaoLogout}
          activeOpacity={0.5}
          style={styles.btnKakaoLogin}
          textStyle={styles.txtKakaoLogin}>
          LOGOUT
        </Button>
        <Button
          isLoading={this.state.loading.unlinkLoading}
          onPress={this.unlinkKakao}
          activeOpacity={0.5}
          style={styles.btnKakaoLogin}
          textStyle={styles.txtKakaoLogin}>
          unlink
        </Button>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({sendMessageText: {...this.state.sendMessageText, message: text}})}
          placeholder="전송할 내용을 입력하세요."
        />
        
      </View>
    </View>
    )
  };
}