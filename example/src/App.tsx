import React, { useState } from 'react'

import { SimpleCarousel } from './SimpleCarousel'
import { DotsAnimation } from './DotsAnimation'
import { DotsAdvancedAnimation } from './DotsAdvancedAnimation'
import { CustomSlides } from './CustomSlides'
import { Button, StyleSheet, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const list = [
  { name: 'SimpleCarousel', carousel: <SimpleCarousel /> },
  { name: 'DotsAnimation', carousel: <DotsAnimation /> },
  { name: 'DotsAdvancedAnimation', carousel: <DotsAdvancedAnimation /> },
  { name: 'CustomSlides', carousel: <CustomSlides /> },
]

export default function App() {
  const [currentVisible, setCurrentVisible] = useState(list[0])

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.buttonContainer}>
          {list.map((renderItem) => (
            <View
              key={renderItem.name}
              style={[
                styles.buttonWrapper,
                renderItem.name === currentVisible?.name && styles.active,
              ]}
            >
              <Button title={renderItem.name} onPress={() => setCurrentVisible(renderItem)} />
            </View>
          ))}

        </View>
        <View style={styles.carouselWrapper}>{currentVisible?.carousel}</View>
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
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },

  active: {
    backgroundColor: 'lightgreen',
  },
  carouselWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
})
