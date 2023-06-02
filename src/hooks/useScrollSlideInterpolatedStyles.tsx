import type { Animated, ViewStyle } from 'react-native'
import { getSlideInterpolator } from '../utils/slides/getSlideInterpolator'
import { getSlideAnimatedStyle } from '../utils/slides/getSlideAnimatedStyle'

export enum SLIDE_ANIMATION_TYPE {
  MOVE_UP,
  SCALE,
  ROLLING,
  SQUEEZE_ANDROID,
  SQUEEZE_MOVE_UP_IOS,
  NO_EFFECTS,
}

type UseScrollSlideInterpolatedStyles = {
  list: {
    id: string
    image: any
  }[]
  slideWidthWithOffset: number
  scrollEvent: Animated.Value
  hiddenIndexScrolling: undefined | number
  slideAnimationType?: SLIDE_ANIMATION_TYPE
  customSlideAnimation?: (
    hiddenIndexScrolling: undefined | number,
    i: number,
    interpolate: (
      slideItemIndex: number,
      minValue: number | string,
      maxValue: number | string
    ) => any
  ) => ViewStyle
}

export const useScrollSlideInterpolatedStyles = ({
  list,
  slideWidthWithOffset,
  scrollEvent,
  hiddenIndexScrolling,
  slideAnimationType = SLIDE_ANIMATION_TYPE.MOVE_UP,
  customSlideAnimation,
}: UseScrollSlideInterpolatedStyles) => {
  const slidesCount = list.length
  const animatedImageStyles = Array(slidesCount)

  const interpolate = getSlideInterpolator(scrollEvent, slideWidthWithOffset)

  for (let i = 0; i < slidesCount; i += 1) {
    animatedImageStyles[i] = {
      style: {
        ...(customSlideAnimation
          ? customSlideAnimation(hiddenIndexScrolling, i, interpolate)
          : getSlideAnimatedStyle(hiddenIndexScrolling, i, interpolate, slideAnimationType)),
      },
      image: list[i],
    }
  }

  return {
    animatedImageStyles,
  }
}
