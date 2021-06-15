import {StyleSheet, Platform} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: Platform.OS === 'ios' ? 0 : 24,
    paddingTop: Platform.OS === 'ios' ? 24 : 0,
    backgroundColor: 'white',
  },
  profile: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: 'black',
  },
  content: {
    flex: 6,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  token: {
    width: 200,
    fontSize: 12,
    padding: 5,
    borderRadius: 8,
    marginVertical: 20,
    backgroundColor: 'grey',
    color: 'white',
    textAlign: 'center',
  },
  btnKakaoLogin: {
    height: 48,
    width: 240,
    alignSelf: 'center',
    backgroundColor: '#F8E71C',
    borderRadius: 0,
    borderWidth: 0,
  },
  txtKakaoLogin: {
    fontSize: 16,
    color: '#3d3d3d',
  },
  headerText: {
    paddingTop: 50,
    alignItems: 'center',
    fontSize: 30,
  },
  bodyContainer: {
    backgroundColor: '#FDF5DC',
    paddingHorizontal: 20,
    marginVertical: 30,
    flex: 1
  },
  textInput: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1
  },
  showText: {
    marginTop: 10,
    fontSize: 25,
  }
});

export default styles