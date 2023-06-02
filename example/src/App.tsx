import React, { useRef } from 'react'
import {
  Animated,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  Carousel,
  CarouselRef,
  DOTS_ANIMATION_TYPE,
  SLIDE_ANIMATION_TYPE,
  SlideItem,
} from 'react-native-carousel-infinity'
import { SimpleCarousel } from './SimpleCarousel'
import DotsAnimation from './DotsAnimation'
import DotsAdvancedAnimation from './DotsAdvancedAnimation'
import CustomSlides from './CustomSlides'

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
  { id: '6', image: require('./image/1.jpeg') },
  { id: '7', image: require('./image/2.webp') },
  { id: '8', image: require('./image/3.jpeg') },
  { id: '9', image: require('./image/4.jpeg') },
  {
    id: '10',
    image: {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/IAA_2022_20_travelarz.jpg',
    },
  },
]

// const CONTAINER_WIDTH = Dimensions.get('window').width - 100
const CONTAINER_WIDTH = 350
const SLIDE_WIDTH = 100
const SLIDE_HORIZONTAL_OFFSET = 10
const FAKE_PER_SIDE = 8

const FULL_SLIDE_WIDTH = SLIDE_WIDTH + SLIDE_HORIZONTAL_OFFSET * 2

const DOT_WIDTH = 15
const DOR_HORIZONTAL_MARGIN = 10
const DOT_FULL_WIDTH = DOT_WIDTH + DOR_HORIZONTAL_MARGIN * 2

export default function App() {
  const myAnim = useRef(new Animated.Value(0)).current
  const carouselRef = useRef<CarouselRef | null>(null)

  const interpolationInputRange = {
    LEFT_EDGE: (FAKE_PER_SIDE - 0.5) * FULL_SLIDE_WIDTH,
    BUTTON_START: FAKE_PER_SIDE * FULL_SLIDE_WIDTH,
    BUTTON_END: (FAKE_PER_SIDE + initialList.length - 1) * FULL_SLIDE_WIDTH,
    RIGHT_EDGE: (FAKE_PER_SIDE + initialList.length - 0.5) * FULL_SLIDE_WIDTH,
  }
  const interpolationOutputRange = {
    LEFT_EDGE: -(
      (CONTAINER_WIDTH - initialList.length * DOT_FULL_WIDTH) / 2 +
      DOR_HORIZONTAL_MARGIN * 2
    ),
    BUTTON_START: 0,
    BUTTON_END: DOT_FULL_WIDTH * (initialList.length - 1),
    RIGHT_EDGE:
      DOT_FULL_WIDTH * initialList.length +
      (CONTAINER_WIDTH - initialList.length * DOT_FULL_WIDTH) / 2 -
      DOR_HORIZONTAL_MARGIN,
  }

  const _onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const value = nativeEvent.contentOffset.x

    if (value <= interpolationInputRange.LEFT_EDGE) {
      // if green dots go over left edge move one to right edge
      myAnim.setValue(initialList.length * FULL_SLIDE_WIDTH + value)
    } else if (value >= interpolationInputRange.RIGHT_EDGE) {
      // if green dots move over right edge move one to left edge
      const realSlidesWidth = initialList.length * FULL_SLIDE_WIDTH
      myAnim.setValue(value - realSlidesWidth)
    } else {
      myAnim.setValue(value)
    }
  }

  const renderCustomDots = (dots: any[]) => {
    return (
      <View style={styles.dotsContainer}>
        <View style={styles.dotsWrapper}>
          <Animated.View
            style={[
              styles.dot,
              styles.movableDot,
              {
                transform: [
                  {
                    translateX: myAnim.interpolate({
                      inputRange: [
                        interpolationInputRange.LEFT_EDGE,
                        interpolationInputRange.BUTTON_START,
                        interpolationInputRange.BUTTON_END,
                        interpolationInputRange.RIGHT_EDGE,
                      ],
                      outputRange: [
                        interpolationOutputRange.LEFT_EDGE,
                        interpolationOutputRange.BUTTON_START,
                        interpolationOutputRange.BUTTON_END,
                        interpolationOutputRange.RIGHT_EDGE,
                      ],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
          />
          {dots.map((_, index) => (
            <TouchableOpacity key={index} onPress={() => carouselRef.current?.scrollToIndex(index)}>
              <Animated.View style={styles.dot} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
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
      // transform: [
      //   {
      //     // translateY: interpolate(i, 0, 30),
      //     translateY: myAnim.interpolate({
      //       inputRange: [(i - 1) * OFFSET, i * OFFSET, (i + 1) * OFFSET],
      //       outputRange: [30, 0, 30],
      //       extrapolate: 'clamp',
      //     }),
      //   },
      // ],
      transform: [
        // {
        //   scale: interpolate(i, 1, 1.2),
        // },
        {
          translateY: myAnim.interpolate({
            inputRange: [
              // (i - 4) * OFFSET,
              (i - 3) * OFFSET,
              (i - 2) * OFFSET,
              (i - 1) * OFFSET,
              i * OFFSET,
              (i + 1) * OFFSET,
              (i + 2) * OFFSET,
              (i + 3) * OFFSET,
              // (i + 4) * OFFSET,
            ],
            outputRange: [150, 90, 30, 0, 30, 90, 150],
            extrapolate: 'clamp',
          }),
        },
        // {
        //   translateX: myAnim.interpolate({
        //     inputRange: [
        //       // (i - 4) * OFFSET,
        //       (i - 3) * OFFSET,
        //       (i - 2) * OFFSET,
        //       (i - 1) * OFFSET,
        //       i * OFFSET,
        //       (i + 1) * OFFSET,
        //       (i + 2) * OFFSET,
        //       (i + 3) * OFFSET,
        //       // (i + 4) * OFFSET,
        //     ],
        //     outputRange: [-30, -20, 0, 0, 0, 20, 30],
        //     extrapolate: 'clamp',
        //   }),
        // },
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
                // slideStyle,
                {
                  height: SLIDE_WIDTH,
                  width: SLIDE_WIDTH,
                  marginHorizontal: SLIDE_HORIZONTAL_OFFSET,
                },
                style,
              ]}
              key={image.id}
            >
              <Image
                source={image.image}
                style={{ width: '100%', height: '100%', borderRadius: SLIDE_WIDTH }}
                resizeMode='cover'
              />
            </Animated.View>
          </Pressable>
        ))}
      </>
    )
  }

  return <CustomSlides />
  return <DotsAdvancedAnimation />
  return <DotsAnimation />
  return <SimpleCarousel />
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ backgroundColor: 'blue' }}>
        <Carousel
          getCarouselRef={(ref) => {
            carouselRef.current = ref
          }}
          onScroll={_onScroll}
          // containerWidth={CONTAINER_WIDTH}
          isInfinity={true}
          isAutoScroll={false}
          fakeImagePerSide={FAKE_PER_SIDE}
          images={initialList}
          slideHorizontalOffset={SLIDE_HORIZONTAL_OFFSET}
          slideWidth={SLIDE_WIDTH}
          slideAlign={130}
          slideAnimationType={SLIDE_ANIMATION_TYPE.NO_EFFECTS}
          dotsAnimationType={DOTS_ANIMATION_TYPE.SCALE}
          contentContainerStyle={{ paddingVertical: 100, paddingHorizontal: 130 }}
          slideStyles={{
            height: SLIDE_WIDTH,
            // paddingHorizontal: 10,
            // borderRadius: SLIDE_WIDTH,
            // backgroundColor: 'white'
          }}
          // imageProps={{ resizeMode: 'contain' }}

          // contentContainerStyle={{
          //   paddingBottom: 100,
          //   paddingTop: 100,
          // }}
          imageStyles={{
            width: '100%',
            height: '100%',
            borderRadius: SLIDE_WIDTH,
          }}
          customSlides={renderCustomSlides}
          customSlideAnimation={customSlidesAnimation}
          customDots={renderCustomDots}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dotsWrapper: {
    flexDirection: 'row',
  },
  movableDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    backgroundColor: 'green',
    position: 'absolute',
    left: 2.6,
    top: 2.6,
    zIndex: 1,
  },
  dot: {
    width: DOT_WIDTH,
    height: DOT_WIDTH,
    borderRadius: DOT_WIDTH,
    borderColor: 'grey',
    borderWidth: 1,
    marginHorizontal: 10,
  },
  slide: {
    height: 200,
  },
})
