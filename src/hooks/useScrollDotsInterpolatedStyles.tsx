import type { Animated } from 'react-native'
import { getDotsInfinityInterpolator } from '../utils/dots/getDotsInfinityInterpolator'
import { getDotsAnimatedStyle } from '../utils/dots/getDotsAnimatedStyle'
import { getDotsInterpolator } from '../utils/dots/getDotsInterpolator'

export enum DOTS_ANIMATION_TYPE {
  SCALE_WITH_OPACITY,
  SCALE,
  MOVE_UP,
}

type UseScrollDotsInterpolatedStyles = {
  slidesCount: number
  slideWidthWithOffset: number
  scrollEvent: Animated.Value
  fakeImagePerSide: number
  dotsAnimationType: DOTS_ANIMATION_TYPE
  customDotsAnimation?: (
    i: number,
    interpolate: (slideItemIndex: number, minValue: number, maxValue: number) => any
  ) => any
  isInfinity?: boolean
}
export const useScrollDotsInterpolatedStyles = ({
  slidesCount,
  slideWidthWithOffset,
  scrollEvent,
  fakeImagePerSide,
  dotsAnimationType = DOTS_ANIMATION_TYPE.SCALE_WITH_OPACITY,
  customDotsAnimation,
  isInfinity = true,
}: UseScrollDotsInterpolatedStyles) => {
  const animatedDotsStyles = Array(slidesCount)

  const interpolate = isInfinity
    ? getDotsInfinityInterpolator(scrollEvent, slideWidthWithOffset, slidesCount, fakeImagePerSide)
    : getDotsInterpolator(scrollEvent, slideWidthWithOffset)

  for (let i = fakeImagePerSide; i < slidesCount + fakeImagePerSide; i += 1) {
    animatedDotsStyles[i] = {
      ...(customDotsAnimation
        ? customDotsAnimation(i, interpolate)
        : getDotsAnimatedStyle(i, interpolate, dotsAnimationType)),
    }
  }

  return {
    animatedDotsStyles,
  }
}
