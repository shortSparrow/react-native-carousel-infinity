import { SLIDE_ANIMATION_TYPE } from '../../hooks/useScrollSlideInterpolatedStyles'

export const getSlideAnimatedStyle = (
  hiddenIndexScrolling: undefined | number,
  i: number,
  interpolate: (slideItemIndex: number, minValue: number, maxValue: number) => any,
  type: SLIDE_ANIMATION_TYPE
) => {
  switch (type) {
    case SLIDE_ANIMATION_TYPE.MOVE_UP:
      return {
        opacity: hiddenIndexScrolling && hiddenIndexScrolling === i ? 0.99 : interpolate(i, 0.2, 1),
        transform: [
          {
            translateY:
              hiddenIndexScrolling && hiddenIndexScrolling === i ? -24.99 : interpolate(i, 0, -25),
          },
        ],
      }
    case SLIDE_ANIMATION_TYPE.SCALE:
      return {
        transform: [
          {
            scale: hiddenIndexScrolling && hiddenIndexScrolling === i ? 1 : interpolate(i, 0.6, 1),
          },
        ],
      }
    case SLIDE_ANIMATION_TYPE.ROLLING:
      return {
        opacity: hiddenIndexScrolling && hiddenIndexScrolling === i ? 1 : interpolate(i, 0.6, 1),
        transform: [
          {
            rotateZ:
              hiddenIndexScrolling && hiddenIndexScrolling === i
                ? '0deg'
                : interpolate(i, '-50deg', '0deg'),
          },
        ],
        zIndex: interpolate(i, 0, 1),
      }
    case SLIDE_ANIMATION_TYPE.SQUEEZE_ANDROID:
      return {
        transform: [
          {
            skewY:
              hiddenIndexScrolling && hiddenIndexScrolling === i
                ? '0deg'
                : interpolate(i, '-45deg', '0deg'),
          },
          {
            rotate:
              hiddenIndexScrolling && hiddenIndexScrolling === i
                ? '0deg'
                : interpolate(i, '45deg', '0deg'),
          },
        ],
      }
    case SLIDE_ANIMATION_TYPE.SQUEEZE_MOVE_UP_IOS:
      return {
        transform: [
          {
            skewY:
              hiddenIndexScrolling && hiddenIndexScrolling === i
                ? '0deg'
                : interpolate(i, '-45deg', '0deg'),
          },
        ],
      }
    case SLIDE_ANIMATION_TYPE.NO_EFFECTS:
      return {}

    default:
      return {}
  }
}
