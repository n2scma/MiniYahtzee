import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'brown',
    flexDirection: 'row',
  },
  footer: {
    marginTop: 140,
    backgroundColor: 'brown',
    flexDirection: 'row'
  },
  title: {
    color: 'orange',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 23,
    textAlign: 'center',
    margin: 10,
  },
  author: {
    color: 'orange',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
  gameboard: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gameinfo: {
    backgroundColor: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 20,
    marginTop: 10
  },
  row: {
    marginTop: 20,
    padding: 10
  },
  flex: {
    flexDirection: "row"
  },
  button: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 1,
    width: 100,
    height: 40, 
    marginBottom: 30,
  },
  namebox: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 1,
    paddingHorizontal: 25,
    paddingVertical: 5
  },
  buttons: {
    backgroundColor: 'lightblue', 
        borderRadius: 5, 
        paddingHorizontal: 20,
        paddingVertical: 10, 
        borderWidth: 1,
        borderColor: 'black',
        marginTop: 20
  },
  buttonText: {
    color:"#2B2B52",
    fontSize: 20
  }
});