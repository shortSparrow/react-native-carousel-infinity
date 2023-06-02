import { DOTS_ANIMATION_TYPE } from '../../hooks/useScrollDotsInterpolatedStyles'

export const getDotsAnimatedStyle = (
  i: number,
  interpolate: (slideItemIndex: number, minValue: number, maxValue: number) => any,
  type: DOTS_ANIMATION_TYPE
) => {
  switch (type) {
    case DOTS_ANIMATION_TYPE.SCALE_WITH_OPACITY:
      return {
        transform: [
          {
            scale: interpolate(i, 1, 1.2),
          },
        ],
        opacity: interpolate(i, 0.4, 1),
      }

    case DOTS_ANIMATION_TYPE.SCALE:
      return {
        transform: [
          {
            scale: interpolate(i, 1, 1.4),
          },
        ],
      }
    case DOTS_ANIMATION_TYPE.MOVE_UP:
      return {
        transform: [
          {
            translateY: interpolate(i, 1, -15),
          },
        ],
      }

    default:
      return {
        transform: [
          {
            scale: interpolate(i, 1, 1.2),
          },
        ],
        opacity: interpolate(i, 0.4, 1),
      }
  }
}
