import React from 'react';
import {Alert, Text, View, TextInput} from 'react-native';
import styles from './styles';
import ButtonToggleGroup from 'react-native-button-toggle-group';
// @ts-ignore
import Button from 'apsl-react-native-button'
// @ts-ignore
import ModalDropdown from 'react-native-modal-dropdown'

type Userinfo = {
  user_id: string,
  nickname: string,
  tmpNickname: string,
  nicknameCheck: string,
  gender: string,
  age: number
}

type nicknameListProps = {
}

type ageListProps = {

}

interface State {
  user: Userinfo;
  nicknameList: nicknameListProps[];
  ageList: ageListProps[];
};

interface Props {
  navigation: any
  route: any
};

export default class User extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      user: {
        user_id: "",
        nickname: 'None_nickname',
        tmpNickname: '',
        nicknameCheck: '',
        gender: 'None',
        age: 0
      },
      nicknameList: [
        '', '1233', '1234'
      ],
      ageList: []
    }
  }

  inputNickname = () => {
    this.setState({user: {...this.state.user, nickname: this.state.user.tmpNickname}})
  }

  checkNickName =  () => {
    const chkNickname = function(str: string) {
      var regNm = /^[0-9a-zA-Z가-힣]{2,8}$/; 
      return regNm.test(str) ? true : false;
    };
    
    if(chkNickname(this.state.user.tmpNickname) === false) {
      this.setState({user: {...this.state.user, tmpNickname: ''}})
        Alert.alert("한글, 영문, 숫자 대소문자 2~8자리만 사용 가능합니다");
    }
    else {
      if(this.state.nicknameList.indexOf(this.state.user.tmpNickname) > 0) {
        Alert.alert("이미 존재하는 닉네임입니다.");
      }
      else {
        this.setState({user: {...this.state.user, nickname: this.state.user.tmpNickname}})
        this.state.nicknameList.push(this.state.user.tmpNickname);
        console.log(this.state.nicknameList);
      }
    }
  }

  checkNicknameList = (element: string) => {
    if(element === this.state.user.tmpNickname) {
      return true;
    }
  }

  inputAge = () => {
    for(var i = 0; i < 101; i++) this.state.ageList[i] = i;
  }

  render() {
    this.inputAge();
    const user_ide = this.props.route.params.user_ide;
    const user_account_type = this.props.route.params.user_account_type;
    return (
      <View style={styles.container}>
      <Text style={styles.headerText}>닉네임 설정</Text>
      <Text style={styles.showText}>id: {user_ide}</Text>
      <Text style={styles.showText}>type: {user_account_type}</Text>
      <Text style={styles.showText}>nickname: {this.state.user.nickname}</Text>
      <Text style={styles.showText}>성별: {this.state.user.gender}</Text>
      <Text style={styles.showText}>나이: {this.state.user.age}</Text>
      <View>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => {this.setState({user: {...this.state.user, tmpNickname: text}})}}
          placeholder="닉네임을 입력해주세요."
        />
        <Button 
        style={{backgroundColor: 'blue'}} 
        textstyle={{fontSize: 18}}
        onPress = {this.checkNickName}>
        중복확인
        </Button>
        <Text>성별</Text>
        <ButtonToggleGroup
          highlightBackgroundColor={'blue'}
          highlightTextColor={'white'}
          inactiveBackgroundColor={'transparent'}
          inactiveTextColor={'grey'}
          values={['남자', '여자']}
          onSelect={(val: string) => {this.setState({user: {...this.state.user, gender: val}})}}
        />
        <Text>나이</Text>
        <ModalDropdown
          options = {this.state.ageList}
          onSelect = {(idx: number) => {this.setState({user: {...this.state.user, age: idx}})}}>
        </ModalDropdown>
      </View>
    </View>
    );
  }
}