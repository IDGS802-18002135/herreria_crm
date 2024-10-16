import { StyleSheet } from "react-native";
import { Image } from "expo-image";


type Props={
    imgSource:string;
    selectedImage?:string;
};

const ImageViewer = ({imgSource,selectedImage}:Props) => {
    const imageSource = selectedImage ? { uri: selectedImage } : imgSource;
    return (
        <Image source={imageSource} style={styles.image}/>
    )
}

export default ImageViewer


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#25292e',
      alignItems: 'center',
     
    },
    text: {
      color: '#fff',
    },
    button:{
      fontSize:20,
      textDecorationLine:'underline',
      color:'#fff',
    },
    imageContainer:{
      flex:1,
    },
      image:{
        width: 320,
        height:440,
        borderRadius:18,
      }
  
  });
  