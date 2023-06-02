import React, { useRef } from 'react'
import {
  Animated,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native'
import {
  Carousel,
  CarouselRef,
  DOTS_ANIMATION_TYPE,
  SLIDE_ANIMATION_TYPE,
  SlideItem,
} from 'react-native-carousel-infinity'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
  { id: '6', image: require('./image/6.jpeg') },
  { id: '7', image: require('./image/7.jpeg') },
  { id: '8', image: require('./image/8.jpeg') },
  { id: '9', image: require('./image/9.jpeg') },
  { id: '9', image: require('./image/10.jpeg') },
]

const SLIDE_WIDTH = 100
const SLIDE_HORIZONTAL_OFFSET = 10

export const CustomSlides = () => {
  const insets = useSafeAreaInsets()

  const myAnim = useRef(new Animated.Value(0)).current
  const carouselRef = useRef<CarouselRef | null>(null)
  const { width: CAROUSEL_WIDTH } = useWindowDimensions()

  const _onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const value = nativeEvent.contentOffset.x
    myAnim.setValue(value)
  }

  const customSlidesAnimation = (
    hiddenIndexScrolling: undefined | number,
    i: number,
    interpolate: (
      slideItemIndex: number,
      minValue: number | string,
      maxValue: number | string
    ) => any
  ) => {
    const OFFSET = SLIDE_WIDTH + SLIDE_HORIZONTAL_OFFSET * 2
    return {
      transform: [
        {
          scale: interpolate(i, 0.9, 1.05),
        },
        {
          translateY: myAnim.interpolate({
            inputRange: [
              (i - 3) * OFFSET,
              (i - 2) * OFFSET,
              (i - 1) * OFFSET,
              i * OFFSET,
              (i + 1) * OFFSET,
              (i + 2) * OFFSET,
              (i + 3) * OFFSET,
            ],
            outputRange: [150, 90, 30, 0, 30, 90, 150],
            extrapolate: 'clamp',
          }),
        },
      ],
    }
  }

  const renderCustomSlides = (slides: any[]) => {
    return (
      <>
        {slides.map(({ style, image }, i) => (
          <Pressable key={i} onPress={() => carouselRef.current?.scrollToIndex(i)}>
            <Animated.View
              style={[
                {
                  height: SLIDE_WIDTH,
                  width: SLIDE_WIDTH,
                  marginHorizontal: SLIDE_HORIZONTAL_OFFSET,
                },
                style,
              ]}
              key={image.id}
            >
              <Image source={image.image} style={styles.imageStyle} resizeMode='cover' />
            </Animated.View>
          </Pressable>
        ))}
      </>
    )
  }

  return (
    <View style={styles.container}>
      <View>
        <Carousel
          getCarouselRef={(ref) => {
            carouselRef.current = ref
          }}
          startFromIndex={2}
          onScroll={_onScroll}
          isInfinity={false}
          isAutoScroll={false}
          images={initialList}
          slideHorizontalOffset={SLIDE_HORIZONTAL_OFFSET}
          slideWidth={SLIDE_WIDTH}
          slideAnimationType={SLIDE_ANIMATION_TYPE.NO_EFFECTS}
          dotsAnimationType={DOTS_ANIMATION_TYPE.SCALE_WITH_OPACITY}
          contentContainerStyle={{
            paddingVertical: 100,
            paddingHorizontal:
              (CAROUSEL_WIDTH - insets.left - insets.right) / 2 -
              (SLIDE_WIDTH + SLIDE_HORIZONTAL_OFFSET * 2) / 2,
          }}
          slideStyles={{
            height: SLIDE_WIDTH,
          }}
          customSlides={renderCustomSlides}
          customSlideAnimation={customSlidesAnimation}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: SLIDE_WIDTH,
  },
})
