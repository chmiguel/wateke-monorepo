import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';

type Props = {
  title: string;
  subtitle: string;
  price: number;
  image: number;
};

const ProductSlide: React.FC<Props> = ({title, subtitle, price, image}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.productTitle}>
        {title}
        <Text style={styles.productSubtitle}> {subtitle}</Text>
      </Text>
      <Image style={styles.productPhoto} resizeMode="contain" source={image} />
      <View style={styles.productPriceContainer}>
        <Text style={styles.productPrice}>{price.toFixed(2)}$</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productTitle: {
    fontFamily: 'LondrinaSolid-Regular',
    color: 'orange',
    fontSize: 72,
  },
  productSubtitle: {
    fontFamily: 'LondrinaOutline-Regular',
    color: '#fff',
  },
  productPhoto: {maxWidth: 500, maxHeight: 500},
  productPriceContainer: {
    width: 300,
    height: 300,
    position: 'absolute',
    left: -100,
    bottom: -50,
    borderRadius: 150,
    backgroundColor: 'orange',
  },
  productPrice: {
    fontFamily: 'LondrinaSolid-Regular',
    fontSize: 72,
    textAlign: 'center',
    marginTop: 60,
    marginLeft: 70,
    color: '#fff',
  },
});

export default ProductSlide;
