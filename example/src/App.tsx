import React, { useState } from 'react'

import { SimpleCarousel } from './SimpleCarousel'
import { DotsAnimation } from './DotsAnimation'
import { DotsAdvancedAnimation } from './DotsAdvancedAnimation'
import { CustomSlides } from './CustomSlides'
import { Button, StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

type CarouselList = {
  name: string
  carousel: JSX.Element
}
const carouselList = [
  { name: 'Simple Carousel', carousel: <SimpleCarousel /> },
  { name: 'Dots Animation', carousel: <DotsAnimation /> },
  { name: 'Dots Advanced Animation', carousel: <DotsAdvancedAnimation /> },
  { name: 'Custom Slides', carousel: <CustomSlides /> },
]

export default function App() {
  const [currentVisible, setCurrentVisible] = useState<CarouselList | null>(null)

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {!currentVisible ? (
          <View style={styles.buttonContainer}>
            {carouselList.map((renderItem) => (
              <View key={renderItem.name} style={styles.buttonWrapper}>
                <Button title={renderItem.name} onPress={() => setCurrentVisible(renderItem)} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.carouseContainer}>
            <Button title='go back' onPress={() => setCurrentVisible(null)} />
            <Text style={styles.carouselTitle}>Current Carousel: {currentVisible.name}</Text>
            <View style={styles.carouselWrapper}>{currentVisible?.carousel}</View>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 10,
    justifyContent: 'center',
    flex: 1,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  carouseContainer: {
    flex: 1,
    paddingVertical: 30,
  },
  carouselWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  carouselTitle: {
    textAlign: 'center',
    fontSize: 17,
    paddingVertical: 20,
  },
})
