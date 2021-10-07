import React from 'react';
import {ActivityIndicator,StyleSheet,Text,View,} from 'react-native'

const styles = StyleSheet.create({
    loadingView: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
    },
    loadingText: {
      color: '#99ddff',
      fontSize: 14,
      fontWeight: 'bold'
    }
});

const LoadingComponent = () =>{
    return(
        <View style={styles.loadingView} >
            <ActivityIndicator size="large" color="#99ddff" />
            <Text style={styles.loadingText} >Loading . . .</Text>
        </View>
    )
}

export const Loading = () => {
    return(
        <LoadingComponent/>
    );
};