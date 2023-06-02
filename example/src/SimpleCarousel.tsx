import React from 'react'
import { SafeAreaView } from 'react-native'
import {
  Carousel,
  DOTS_ANIMATION_TYPE,
  SLIDE_ANIMATION_TYPE,
  SlideItem,
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

const SLIDE_WIDTH = 300
const SLIDE_HORIZONTAL_OFFSET = 10
const FAKE_PER_SIDE = 3

export const SimpleCarousel = () => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <Carousel
        isInfinity={true}
        isAutoScroll={false}
        fakeImagePerSide={FAKE_PER_SIDE}
        images={initialList}
        slideHorizontalOffset={SLIDE_HORIZONTAL_OFFSET}
        slideWidth={SLIDE_WIDTH}
        slideAlign={'center'}
        slideAnimationType={SLIDE_ANIMATION_TYPE.MOVE_UP}
        dotsAnimationType={DOTS_ANIMATION_TYPE.SCALE}
        slideStyles={{
          height: SLIDE_WIDTH,
        }}
      />
    </SafeAreaView>
  )
}
