import type { Animated } from 'react-native'

export const getDotsInterpolator =
  (animatedValue: Animated.Value, slideWidth: number) =>
  (slideItemIndex: number, minValue: number | string, maxValue: number | string): any => {
    return animatedValue.interpolate({
      inputRange: [
        (slideItemIndex - 1) * slideWidth,
        slideItemIndex * slideWidth,
        (slideItemIndex + 1) * slideWidth,
      ],
      outputRange: [minValue, maxValue, minValue] as string[] | number[],
      extrapolate: 'clamp',
    })
  }
