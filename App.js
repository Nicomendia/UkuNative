import 'react-native-gesture-handler';

import * as React from 'react';
import { Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Api from "./Api";
import ApiTransaction from "./ApiTransaction";
import AuthContext from './AuthContext';

import SplashScreen from './src/modules/Login/SplashScreen';
import SignInScreen from './src/modules/Login/login';
import ForgotScreen from './src/modules/Login/forgot';
import ResetScreen from './src/modules/Login/reset';
import RegisterScreen from './src/modules/Register/register';
import ActivateScreen from './src/modules/Register/activate';
import HomeScreen from './src/modules/Home/HomeScreen';
import ProfileScreen from './src/modules/Profile/ProfileScreen';
import UpholdScreen from './src/modules/Profile/UpholdScreen';
import UpholdConnect from './src/modules/Profile/UpholdConnect';
import FindSellerScreen from './src/modules/Payment/FindSellerScreen';
import QRScreen from './src/modules/Payment/QRScreen';
import SellerDataScreen from './src/modules/Payment/SellerDataScreen';
import UpholdTansScreen from './src/modules/Payment/UpholdTansScreen';
import TansResultScreen from './src/modules/Payment/TansResultScreen';

function CustomDrawerContent(props) {
	const { signOut } = React.useContext(AuthContext);
	
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Cerrar Sesión"
		onPress={() =>
			Alert.alert(
			  'Cerrar Sesión',
			  'Está seguro que desea salir?',
			  [
				{
				  text: 'Cancel',
				  onPress: () => props.navigation.toggleDrawer(),
				  style: 'cancel'
				},
				{ text: 'OK', onPress: () => signOut() }
			  ],
			  { cancelable: false }
			)
		}
      />
    </DrawerContentScrollView>
  );
}

const MenuStack = createDrawerNavigator();

function MenuStackScreen() {
  return (
	<MenuStack.Navigator drawerPosition={'right'} drawerContentOptions={{ activeTintColor: '#67A254' }} drawerStyle={{ width: 230 }} drawerContent={props => <CustomDrawerContent {...props} />} >
	  <MenuStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
	  <MenuStack.Screen name="Uphold" component={UpholdStackScreen} options={{ title: 'Uphold' }} />
    </MenuStack.Navigator>
  );
}


const UpholdStack = createStackNavigator();

function UpholdStackScreen() {
  return (
	<UpholdStack.Navigator initialRouteName="Uphold" screenOptions={{ headerShown: false }} >
		<UpholdStack.Screen name="Uphold" component={UpholdScreen} options={{ title: 'Uphold' }} />
		<UpholdStack.Screen name="UpholdConnect" component={UpholdConnect} options={{ title: 'Connect' }} />
	</UpholdStack.Navigator>
  );
}



const PayStack = createStackNavigator();

function PayStackScreen() {
  return (
	<PayStack.Navigator initialRouteName="FindSeller"
		screenOptions={{ 
			headerStyle: { height: 70, backgroundColor: '#AFC037' },
			headerTintColor: '#fff',
			headerTitleStyle: { fontWeight: 'bold' }
		}}
	>
		<PayStack.Screen name="FindSeller" component={FindSellerScreen} options={{ title: 'Paso 1' }} />
		<PayStack.Screen name="QRreader" component={QRScreen} options={{ title: 'QR Scanner' }} />
		<PayStack.Screen name="SellerData" component={SellerDataScreen} options={{ title: 'Paso 2' }} />
		<PayStack.Screen name="TransactionData" component={UpholdTansScreen} options={{ title: 'Paso 3' }} />
		<PayStack.Screen name="TransactionResult" component={TansResultScreen} options={{ title: 'Resultado' }} />
	</PayStack.Navigator>
  );
}

const TabStack = createBottomTabNavigator();

function TabStackScreen() {
  return (
    <TabStack.Navigator tabBarOptions={{ activeTintColor: '#67A254' }} >
	  <TabStack.Screen name="Home" component={HomeScreen} options={{
		  title: 'Inicio', tabBarIcon: ({ color, size }) => ( <MaterialCommunityIcons name="home" color={color} size={size} /> ),
		}} />
	  <TabStack.Screen name="Payment" component={PayStackScreen}
		listeners={({ navigation, route }) => ({ 
			tabPress: e => { e.preventDefault(); navigation.navigate('Payment', { screen: 'FindSeller' }); }
		})}
		options={{
		  title: 'Pago', tabBarIcon: ({ color, size }) => ( <MaterialCommunityIcons name="cash" color={color} size={size} /> ),
		}} />
	  <TabStack.Screen name="Profile" component={MenuStackScreen} options={{
		  title: 'Perfil', tabBarIcon: ({ color, size }) => ( <MaterialCommunityIcons name="account" color={color} size={size} /> )
		}} />
    </TabStack.Navigator>
  );
}

const Stack = createStackNavigator();

export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
		case 'SIGN_UP':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
		if (userToken!=null) {
			let result = await Api.getProfile(userToken);
			if (result.profile.full_name!=null && result.status_code==null && result.detail==null) {
				console.log("token restore name: "+result.profile.full_name);
				await AsyncStorage.setItem('full_name',result.profile.full_name);
				let response = await ApiTransaction.putUpholdDetails(userToken);
				//console.log(response);
			} else {
				userToken=null;
				await AsyncStorage.removeItem('userToken');
				await AsyncStorage.removeItem('full_name');
				console.log("Sesion caducada");
			}
		}
		console.log("token restore: "+userToken);
      } catch (e) {
        console.log("Restore token failed");
      }

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
		try {
			let result = await Api.login(data.email, data.password);
			if (result.token!=null) {
				await AsyncStorage.setItem('userToken',result.token);
				await AsyncStorage.setItem('userLogin',data.email);
				console.log("signIn: "+result.token);
				await ApiTransaction.putUpholdDetails(result.token);
				dispatch({ type: 'SIGN_IN', token: result.token });
			} else {
				if (result.status_code!=null && result.detail!=null) {
					Alert.alert(result.detail);
				}
			}
			
		} catch (error) {
			Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.");
		}
      },
	  signOut: async data => {
		try {
			let userToken = await AsyncStorage.getItem('userToken');
			await AsyncStorage.removeItem('userToken');
			await AsyncStorage.removeItem('full_name');
			await Api.signout(userToken);
		} catch (error) {
			console.log(error);
		}
		dispatch({ type: 'SIGN_OUT' });
		console.log("ya hice dispatch en signOut");
      },
      signUp: async data => {
		try {	
			let result = await Api.signup(data.email, data.full_name, data.phone, data.password);
			
			if (result.status_code!=null && result.detail!=null) {
				Alert.alert(result.detail);
				console.log("Fallo el SignUp y va a retornar falso");
				return false;
			} else {
				console.log("SignUp: "+data.email+" "+data.full_name+" "+data.phone+" "+data.password);
				dispatch({ type: 'SIGN_UP', token: null });
				return true;
			}
		} catch (error) {
			Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.");
			console.log(error);
			return false;
		}
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn"
			screenOptions={{ 
				headerStyle: { height: 70, backgroundColor: '#AFC037' },
				headerTintColor: '#fff',
				headerTitleStyle: { fontWeight: 'bold' }
			}}
		>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} options={{ title: '' }} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
			<>
				<Stack.Screen
				  name="SignIn"
				  component={SignInScreen}
				  options={{
					title: '',
				// When logging out, a pop animation feels intuitive
					animationTypeForReplace: state.isSignout ? 'pop' : 'push',
				  }}
				/>
				<Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
				<Stack.Screen name="Activate" component={ActivateScreen} options={{ title: '' }} />
				<Stack.Screen name="Forgot" component={ForgotScreen} options={{ title: 'Recuperar Password' }}/>
				<Stack.Screen name="Reset" component={ResetScreen} options={{ title: 'Nuevo Password' }}/>
			</>
          ) : (
            // User is signed in
            <>
				<Stack.Screen name="UKU" component={TabStackScreen} options={{ headerShown: false }} />
			</>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}