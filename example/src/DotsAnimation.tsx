import React, { useRef } from 'react'
import { StyleSheet } from 'react-native'
import {
  Carousel,
  CarouselRef,
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

const SLIDE_WIDTH = 100
const SLIDE_HORIZONTAL_OFFSET = 10
const FAKE_PER_SIDE = 8

export const DotsAnimation = () => {
  const carouselRef = useRef<CarouselRef | null>(null)

  return (
    <Carousel
      getCarouselRef={(ref) => {
        carouselRef.current = ref
      }}
      isInfinity={true}
      isAutoScroll={false}
      fakeImagePerSide={FAKE_PER_SIDE}
      images={initialList}
      slideHorizontalOffset={SLIDE_HORIZONTAL_OFFSET}
      slideWidth={SLIDE_WIDTH}
      slideAlign='symmetric'
      slideAnimationType={SLIDE_ANIMATION_TYPE.NO_EFFECTS}
      dotsAnimationType={DOTS_ANIMATION_TYPE.SCALE}
      slideStyles={{
        height: SLIDE_WIDTH,
      }}
      customDotsAnimation={(index, interpolate) => ({
        transform: [{ translateY: interpolate(index, 0, -20) }],
      })}
      dotsContainerStyles={styles.dotsContainer}
    />
  )
}

const styles = StyleSheet.create({
  dotsContainer: {
    marginTop: 70,
    flexDirection: 'row',
    justifyContent: 'center',
  },
})
