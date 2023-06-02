import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  NativeScrollEvent,
  Platform,
  TouchableOpacity,
  NativeSyntheticEvent,
} from 'react-native'
import debounce from 'lodash.debounce'
import {
  DOTS_ANIMATION_TYPE,
  useScrollDotsInterpolatedStyles,
} from './hooks/useScrollDotsInterpolatedStyles'
import {
  SLIDE_ANIMATION_TYPE,
  useScrollSlideInterpolatedStyles,
} from './hooks/useScrollSlideInterpolatedStyles'
import { generateFakeItems } from './utils/generateFakeItems'
import { styles } from './Carousel.style'
import type { CarouselRef, Props } from './Carousel.types'

const DEFAULT_SLIDE_WIDTH = Dimensions.get('window').width
const DEFAULT_FAKE_PER_SIDE = 2
const DEFAULT_SLIDE_INTERVAL = 4000
const DEFAULT_SLIDE_INTERACTION_DELAY = 1000
const DEFAULT_ANIMATION_DURATION = 500

export const Carousel = (props: Props) => {
  const {
    fakeImagePerSide = props.isInfinity ? DEFAULT_FAKE_PER_SIDE : 0,
    slideWidth = DEFAULT_SLIDE_WIDTH,
    slideHorizontalOffset = 10,
    isAutoScroll = false,
    autoScrollSlideInterval = DEFAULT_SLIDE_INTERVAL,
    autoScrollSlideInteractionDelay = DEFAULT_SLIDE_INTERACTION_DELAY,
    images,
    slideAnimationType,
    customSlideAnimation,
    customDotsAnimation,
    animationDuration = DEFAULT_ANIMATION_DURATION,
    slideAlign = 'center',
    containerWidth,
    dotsAnimationType = DOTS_ANIMATION_TYPE.SCALE_WITH_OPACITY,
    onScroll,
    onMomentumScrollEnd,
    onScrollEndDrag,
    onScrollBeginDrag,
    customDots,
    getScrollViewRef,
    slideStyles,
    imageStyles,
    imageProps = {},
    dotsContainerStyles,
    dotStyles,
    getCarouselRef,
    isInfinity = true,
    customSlides,
    startFromIndex = 0,

    ...rest
  } = props

  const [currentContainerWidth, setCurrentContainerWidth] = useState(containerWidth)
  const fullSlideHorizontalOffset = slideHorizontalOffset * 2
  const initialOffset = isInfinity
    ? (slideWidth + fullSlideHorizontalOffset) * fakeImagePerSide +
      startFromIndex * (slideWidth + fullSlideHorizontalOffset)
    : startFromIndex * (slideWidth + fullSlideHorizontalOffset)
  // shows real offset
  const scrolling = useRef(new Animated.Value(initialOffset))

  // scrollViewOffset needed for adding custom smooth scroll with animation
  const scrollViewOffset = useRef(new Animated.Value(initialOffset)).current

  const intervalId = useRef<NodeJS.Timeout | null>(null)
  const intervalDelayId = useRef<NodeJS.Timeout | null>(null)
  const isScrolling = useRef(false)
  const isDrag = useRef<boolean>(false)
  const ref = useRef<ScrollView>(null)
  const carouselRef = useRef<CarouselRef | null>(null)

  // help to avoid style blinking when go from fake items to real
  const [hiddenIndexScrolling, setHiddenIndexScrolling] = useState<undefined | number>(undefined)

  const [list] = useState(isInfinity ? generateFakeItems(images, fakeImagePerSide) : images)

  useLayoutEffect(() => {
    getScrollViewRef && getScrollViewRef(ref)
  }, [ref, getScrollViewRef])

  const calculateContainerWidth = debounce((width: number) => {
    if (currentContainerWidth !== width) {
      setCurrentContainerWidth(width)
    }
  }, 10)

  const { animatedDotsStyles } = useScrollDotsInterpolatedStyles({
    slidesCount: images.length,
    slideWidthWithOffset: slideWidth + fullSlideHorizontalOffset,
    scrollEvent: scrolling.current,
    fakeImagePerSide,
    dotsAnimationType,
    customDotsAnimation,
    isInfinity,
  })

  const { animatedImageStyles } = useScrollSlideInterpolatedStyles({
    list,
    slideWidthWithOffset: slideWidth + fullSlideHorizontalOffset,
    scrollEvent: scrolling.current,
    hiddenIndexScrolling,
    slideAnimationType,
    customSlideAnimation,
  })

  const debounceHandleScroll = debounce((nativeEvent: NativeScrollEvent) => {
    handleScroll(nativeEvent)
  }, 50)

  // when go to first fake images make momentum hidden scroll to real position
  const handleScroll = (nativeEvent: NativeScrollEvent) => {
    isScrolling.current = false

    if (isDrag.current === true) return

    const x =
      nativeEvent.contentOffset.x -
      (slideWidth + fullSlideHorizontalOffset) * fakeImagePerSide +
      slideHorizontalOffset
    const index = Math.round(x / (slideWidth + fullSlideHorizontalOffset))

    // scroll to start
    if (index > images.length - 1) {
      // FAKE_PER_SIDE - simple way, bu we handle case when user can swipe 2 and more items per one swipe, and navigate to real position
      const toIndex = fakeImagePerSide + index - images.length
      hiddenScrollToIndex(toIndex)
    }

    // scroll to end
    if (index <= -1) {
      const toIndex = images.length + index + fakeImagePerSide
      hiddenScrollToIndex(toIndex)
    }
  }

  const hiddenScrollToIndex = (toIndex: number) => {
    isScrolling.current = true
    setHiddenIndexScrolling(toIndex)

    ref.current?.scrollTo({
      x: slideWidth * toIndex + toIndex * fullSlideHorizontalOffset,
      y: 0,
      animated: false,
    })
  }

  const stopAutoPlay = useCallback(() => {
    scrollViewOffset.stopAnimation()
    if (intervalId.current) {
      clearInterval(intervalId.current)
    }
    if (intervalDelayId.current) {
      clearTimeout(intervalDelayId.current)
    }

    intervalDelayId.current = null
    intervalId.current = null
  }, [scrollViewOffset])

  const tryStartAutoPlay = useCallback(
    (delay: number = 0) => {
      if (!isAutoScroll) return
      intervalDelayId.current = setTimeout(() => {
        intervalId.current = setInterval(() => {
          const x =
            scrolling.current._value -
            (slideWidth + fullSlideHorizontalOffset) * fakeImagePerSide +
            slideHorizontalOffset
          const index = Math.round(x / (slideWidth + fullSlideHorizontalOffset)) + 1
          const offset = slideWidth * (index + fakeImagePerSide) + (index + fakeImagePerSide) * 20
          // sync drag and autoscroll value
          scrollViewOffset.setValue(scrolling.current._value)
          Animated.timing(scrollViewOffset, {
            toValue: offset,
            duration: animationDuration,
            useNativeDriver: false,
          }).start()
        }, autoScrollSlideInterval)
      }, delay)
    },
    [
      isAutoScroll,
      autoScrollSlideInterval,
      slideWidth,
      fullSlideHorizontalOffset,
      fakeImagePerSide,
      slideHorizontalOffset,
      scrollViewOffset,
      animationDuration,
    ]
  )

  const scrollToIndex = (toIndex: number) => {
    stopAutoPlay()

    // sync drag and autoscroll value
    scrollViewOffset.setValue(scrolling.current._value)

    Animated.timing(scrollViewOffset, {
      toValue: slideWidth * toIndex + toIndex * fullSlideHorizontalOffset,
      duration: animationDuration,
      useNativeDriver: false,
    }).start()

    tryStartAutoPlay(autoScrollSlideInteractionDelay)
  }

  const _onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    isDrag.current = false
    // enable if want to avoid blink on fast scroll when go to the last item.
    // It can looks like freeze, I think this happens because IOS Easing not linier
    if (Platform.OS === 'ios') {
      const x =
        e.nativeEvent.contentOffset.x -
        (slideWidth + fullSlideHorizontalOffset) * fakeImagePerSide +
        slideHorizontalOffset
      const index = Math.round(x / (slideWidth + fullSlideHorizontalOffset))

      // forbid scroll when user fast scroll to last item
      if (index < 0 || index >= images.length) {
        ref.current?.setNativeProps({
          scrollEnabled: false,
        })
      }
    }
    tryStartAutoPlay(autoScrollSlideInteractionDelay)
    onScrollEndDrag && onScrollEndDrag(e)
  }

  const _onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (Platform.OS === 'ios') {
      ref.current?.setNativeProps({
        scrollEnabled: true,
      })
    }
    onMomentumScrollEnd && onMomentumScrollEnd(e)
  }

  const _onScrollBeginDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    isDrag.current = true
    stopAutoPlay()
    onScrollBeginDrag && onScrollBeginDrag(e)
  }

  const _onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isScrolling.current === false && hiddenIndexScrolling) {
      setHiddenIndexScrolling(undefined)
    }
    scrolling.current.setValue(e.nativeEvent.contentOffset.x)
    debounceHandleScroll(e.nativeEvent)
    onScroll && onScroll(e)
  }

  carouselRef.current = {
    stopAutoPlay,
    tryStartAutoPlay,
    scrollToIndex,
  }
  useEffect(() => {
    getCarouselRef && carouselRef.current && getCarouselRef(carouselRef.current)
  }, [getCarouselRef])

  // smooth scrollig by tap on index, and autoscroll
  useEffect(() => {
    scrollViewOffset.addListener(({ value }) => {
      ref.current?.setNativeProps({
        contentOffset: {
          x: value,
          y: 0,
        },
      })
    })
  }, [scrollViewOffset])

  useEffect(() => {
    tryStartAutoPlay()

    return () => {
      stopAutoPlay()
    }
  }, [tryStartAutoPlay, stopAutoPlay, isAutoScroll])

  const horizontalMargin = useMemo(() => {
    if (slideAlign === 'center') {
      if (!currentContainerWidth) return 0
      const x = currentContainerWidth % (slideWidth + slideHorizontalOffset * 2)

      return x / 2
    }

    if (slideAlign === 'left') return 0

    return slideAlign
  }, [slideAlign, currentContainerWidth, slideWidth, slideHorizontalOffset])

  const slideStyle = slideStyles ?? [styles.slideWrapper, styles.shadow]
  const imageStyle = imageStyles ?? [{ width: slideWidth }, styles.image]
  const dotsContainerStyle = dotsContainerStyles ?? styles.dotsContainer
  const dotStyle = dotStyles ?? styles.dot

  return (
    <View
      style={[
        styles.wrapper,
        {
          opacity: !currentContainerWidth ? 0 : 1,
        },
      ]}
    >
      <View>
        <ScrollView
          onLayout={(e) => calculateContainerWidth(e.nativeEvent.layout.width)}
          bounces={false}
          contentOffset={{
            x: initialOffset,
            y: 0,
          }}
          horizontal
          disableIntervalMomentum
          scrollEventThrottle={16}
          disableScrollViewPanResponder
          snapToInterval={slideWidth + fullSlideHorizontalOffset}
          decelerationRate='fast'
          ref={ref}
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={_onScrollBeginDrag}
          onScrollEndDrag={_onScrollEndDrag}
          onMomentumScrollEnd={_onMomentumScrollEnd}
          onScroll={_onScroll}
          contentContainerStyle={{
            paddingHorizontal: horizontalMargin,
            paddingTop: slideAnimationType === SLIDE_ANIMATION_TYPE.MOVE_UP ? 25 : 0,
          }}
          {...rest}
        >
          {customSlides
            ? customSlides(animatedImageStyles)
            : animatedImageStyles.map(({ style, image }) => (
                <Animated.View
                  style={[
                    slideStyle,
                    {
                      width: slideWidth,
                      marginHorizontal: slideHorizontalOffset,
                    },
                    style,
                  ]}
                  key={image.id}
                >
                  <Image source={image.image} style={imageStyle} {...imageProps} />
                </Animated.View>
              ))}
        </ScrollView>
      </View>
      {customDots ? (
        customDots(animatedDotsStyles)
      ) : (
        <View style={dotsContainerStyle}>
          {animatedDotsStyles.map((animatedDotStyle, index) => (
            <TouchableOpacity key={index} onPress={() => scrollToIndex(index)}>
              <Animated.View style={[dotStyle, animatedDotStyle]} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}
