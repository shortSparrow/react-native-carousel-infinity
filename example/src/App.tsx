import React, { useRef } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import {
  Carousel,
  SlideItem,
  DOTS_ANIMATION_TYPE,
  SLIDE_ANIMATION_TYPE,
} from 'react-native-carousel-infinity'

const initialList: SlideItem[] = [
  { id: '1', image: require('./image/1.jpeg') },
  { id: '2', image: require('./image/2.webp') },
  { id: '3', image: require('./image/3.jpeg') },
  { id: '4', image: require('./image/4.jpeg') },
  {
    id: '5',
    image: {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/IAA_2022_20_travelarz.jpg',
    },
  },
]

export default function App() {
  const myScrollViewRef = useRef<ScrollView>(null)

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <Carousel
        isAutoScroll={false}
        fakeImagePerSide={3}
        images={initialList}
        slideHorizontalOffset={10}
        slideWidth={100}
        slideAlign='center'
        slideAnimationType={SLIDE_ANIMATION_TYPE.MOVE_UP}
        dotsAnimationType={DOTS_ANIMATION_TYPE.SCALE}
        getScrollViewRef={(scrollViewRef) => {
          myScrollViewRef.current = scrollViewRef
        }}
        slideStyles={{ height: 100 }}
        imageProps={{ resizeMode: 'cover' }}
      />
    </SafeAreaView>
  )
}
