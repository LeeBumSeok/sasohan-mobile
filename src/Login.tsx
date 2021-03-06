/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {View, Text, Image, Share} from 'react-native';
import kakaoLogins, {KAKAO_AUTH_TYPES} from '@react-native-seoul/kakao-login'
import styles from './styles';

// @ts-ignore
import Button from 'apsl-react-native-button'
import { createWatchProgram } from 'typescript';
import { TabRouter } from '@react-navigation/native';
import { concat } from 'react-native-reanimated';
import { connect } from 'http2';

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
}

type idInfoProps = {
  token: Token;
  profile: Profile;
}

type State = {
  loading: loadingProps;
  idInfo: idInfoProps;
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
        signinLoading: false
      },
      idInfo: {
        token: TOKEN_EMPTY,
        profile: PROFILE_EMPTY
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

  getProfile = () => {
    console.log('Get Profile Start');
    this.setState({loading: {...this.state.loading, profileLoading: true}})

    kakaoLogins.getProfile()
      .then(result => {
        this.setState({idInfo: {...this.state.idInfo, profile: {id: result.id, profile_image_url: result.profile_image_url, account_type: 'kakao'}}})
        this.setState({loading: {...this.state.loading, profileLoading: false}})
        console.log(`Get Profile Finished:${JSON.stringify(result)}`);
        this.props.navigation.navigate('Search', {user_ide: this.state.idInfo.profile.id, user_account_type: this.state.idInfo.profile.account_type});
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

  connectToChatServer = () => {
    let connection = new WebSocket("ws://192.168.0.5:1323/connect");

    let body = {
      "id": this.state.idInfo.profile.id
    };

    connection.onopen = () => {
      connection.send(JSON.stringify(body));
    };

    connection.onmessage = (event: WebSocketMessageEvent) => {
      console.log(event.data);
    };

    connection.onerror = (error) => {
      connection.close();
    };

    connection.onclose = (error) => {
      console.log(error.code, error.message, error.reason);
    };
  }

  render() {
    return(
      <View style={styles.container}>
      <View style={styles.profile}>
        <Image style={styles.profilePhoto} source={{uri: this.state.idInfo.profile.profile_image_url !== "" ? this.state.idInfo.profile.profile_image_url : undefined}} />
        <Text>{`id : ${this.state.idInfo.profile.id}`}</Text>
        <Text></Text>
      </View>
      <View style={styles.content}>
        <Button
          isLoading={this.state.loading.loginLoading}
          onPress={() => {
            this.kakaoLogin();
            setTimeout(() => {
              this.getProfile();
            } , 500);
            this.connectToChatServer();
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
      </View>
    </View>
    )
  };
}