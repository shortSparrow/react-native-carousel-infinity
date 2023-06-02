import type {
  ImageProps,
  ImageSourcePropType,
  ImageStyle,
  ScrollView,
  ScrollViewProps,
  ViewStyle,
} from 'react-native'
import type { DOTS_ANIMATION_TYPE } from './hooks/useScrollDotsInterpolatedStyles'
import type { SLIDE_ANIMATION_TYPE } from './hooks/useScrollSlideInterpolatedStyles'

export type SlideItem = { id: string; image: ImageSourcePropType }

export type Props = ScrollViewProps & {
  images: SlideItem[]
  fakeImagePerSide?: number
  slideWidth?: number
  isAutoScroll?: boolean
  autoScrollSlideInterval?: number
  autoScrollSlideInteractionDelay?: number
  slideHorizontalOffset?: number
  slideAnimationType?: SLIDE_ANIMATION_TYPE
  animationDuration?: number
  slideAlign?: 'center' | 'left' | number
  containerWidth?: number
  dotsAnimationType?: DOTS_ANIMATION_TYPE
  customSlideAnimation?: (
    hiddenIndexScrolling: undefined | number,
    i: number,
    interpolate: (
      slideItemIndex: number,
      minValue: number | string,
      maxValue: number | string
    ) => any
  ) => any
  customDotsAnimation?: (
    i: number,
    interpolate: (
      slideItemIndex: number,
      minValue: number | string,
      maxValue: number | string
    ) => any
  ) => any
  customDots?: (dotsStyles: any[]) => JSX.Element
  customSlides?: (slideStyles: any[]) => JSX.Element
  getScrollViewRef?: (ref: React.RefObject<ScrollView>) => void
  slideStyles?: Omit<ViewStyle, 'width'>
  imageStyles?: ImageStyle
  imageProps?: Omit<ImageProps, 'source'>
  dotsContainerStyles?: ViewStyle
  dotStyles?: ViewStyle
  getCarouselRef?: (ref: CarouselRef) => void
  isInfinity?: boolean
  startFromIndex?: number
}

export type CarouselRef = {
  stopAutoPlay: () => void
  tryStartAutoPlay: () => void
  scrollToIndex: (index: number) => void
}
