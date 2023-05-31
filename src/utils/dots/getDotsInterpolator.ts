import type { Animated } from 'react-native'

export const getDotsInterpolator =
  (
    animatedValue: Animated.Value,
    slideWidth: number,
    slidesCount: number,
    fakeImagePerSide: number
  ) =>
  (slideItemIndex: number, minValue: number, maxValue: number): any => {
    const lastIndex = slidesCount + fakeImagePerSide - 1
    const inputRange = [...Array(slidesCount + fakeImagePerSide)].map(
      (_, i) => (i + 1) * slideWidth
    )

    const arr = [...Array(fakeImagePerSide + slidesCount)]

    arr[arr.length - 1] = maxValue
    arr[fakeImagePerSide - 1] = maxValue

    for (let i = fakeImagePerSide - 1; i >= 0; i -= 2) {
      arr[i] = maxValue
    }

    const firstImageOutput = arr.map((item) => {
      if (item === undefined) return minValue
      return item
    })

    const lastImageTemp = [...firstImageOutput]
    lastImageTemp.push(minValue)
    const lastImageOutput = lastImageTemp.slice(1)

    switch (slideItemIndex) {
      case fakeImagePerSide:
        return animatedValue.interpolate({
          inputRange,
          outputRange: firstImageOutput,
          extrapolate: 'clamp',
        })

      case lastIndex:
        return animatedValue.interpolate({
          inputRange,
          outputRange: lastImageOutput,
          extrapolate: 'clamp',
        })

      default:
        return animatedValue.interpolate({
          inputRange: [
            (slideItemIndex - 1) * slideWidth,
            slideItemIndex * slideWidth,
            (slideItemIndex + 1) * slideWidth,
          ],
          outputRange: [minValue, maxValue, minValue],
          extrapolate: 'clamp',
        })
    }
  }
