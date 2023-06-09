# react-native-carousel-infinity

Fast and smooth infinity carousel for React Native

## Installation

```sh
npm install react-native-carousel-infinity
```

Or uf you use yarn

```sh
yarn add react-native-carousel-infinity
```

## Usage

```js
import React from 'react'
import {
  Carousel,
  DOTS_ANIMATION_TYPE,
  SLIDE_ANIMATION_TYPE,
  SlideItem,
} from 'react-native-carousel-infinity'

const data: SlideItem[] = [
  { id: '1', image: require('someImage.jpeg') },
  {
    id: '2',
    image: {
      uri: 'https://some_image.jpg',
    },
  },
]

const SLIDE_WIDTH = 300
const SLIDE_HORIZONTAL_OFFSET = 10
const FAKE_PER_SIDE = 3

export const SimpleCarousel = () => {
  return (
    <Carousel
      isInfinity
      isAutoScroll={false}
      fakeImagePerSide={FAKE_PER_SIDE}
      images={data}
      slideHorizontalOffset={SLIDE_HORIZONTAL_OFFSET}
      slideWidth={SLIDE_WIDTH}
      slideAlign='symmetric'
      slideAnimationType={SLIDE_ANIMATION_TYPE.MOVE_UP}
      dotsAnimationType={DOTS_ANIMATION_TYPE.SCALE}
      slideStyles={{
        height: SLIDE_WIDTH,
      }}
    />
  )
}
```

## Props

**Accepts all ScrollView props and these:**
| name                              | required | default                            | types                                      | descriptions |
|:----------------------------------|:---------|:---------------------------------- |:-------------------------------------------|:-------------|
| images                            | ✅       |                                    | { id: string; image: ImageSourcePropType }  | Images for carousel, you can add local images and form url as well   |
| fakeImagePerSide                  | ❌       |  3                                 |    number                                   | Count of fake items per each side |
| slideWidth                        | ❌       |  Dimensions.get('window').width    |    number                                   | Slide width |
| isAutoScroll                      | ❌       |  false                             |    boolean                                  | Should images auto scrolling or not |
| autoScrollSlideInterval           | ❌       |  4000                              |    number                                   | Time between each autoscroll new slide |
| autoScrollSlideInteractionDelay   | ❌       |  1000                              |    number                                   | If you interrupt auto scrolling or just scroll by fingers autoscroll waiting autoScrollSlideInteractionDelay + autoScrollSlideInterval until start next auto scrolling |
| slideHorizontalOffset             | ❌       |  10                                |    number                                   | Offset between each slide |
| slideAnimationType                | ❌       |  NEED YO ADD                       |    {MOVE_UP,SCALE,ROLLING,SQUEEZE_ANDROID, SQUEEZE_MOVE_UP_IOS,NO_EFFECTS}                                   | Already implemented animations for slides |
| animationDuration                 | ❌       |  500                               |    number                                   | Sliding duration during autoscroll or pressing pagination buttons |
| slideAlign                        | ❌       |  symmetric                         |    'symmetric' \| 'left' \| number          | ```left``` - all you slides start from left edge (typically for scrollView). <br>```symmetric``` - slides looks symmetric, because adds number depends on device size. <br>```number``` - add any number for specific cases when you need to align your slides (like [here](/example/src/CustomSlides.tsx)).<br><br> If you use ```paddingHorizontal``` inside ```contentContainerStyle``` this will override ```slideAlign``` <br>**because technically ```slideAlign``` is ```paddingHorizontal```**. |
| onSelectSlide                     | ❌       |  undefined                         |    (index: number) => void                  | Calls on select slide, useful for getting current selected index |
| containerWidth                    | ❌       |                                    |    number                                   | This parameter not setting carousel width, it just says parent width. This parameter improves performance. Without one carousel make 1 rerender to defined own width  |
| dotsAnimationType                 | ❌       |  SCALE_WITH_OPACITY                |    {SCALE_WITH_OPACITY,SCALE,MOVE_UP}       | Already implemented animations for dots  |
| startFromIndex                    | ❌       |  0                                 |    number                                   | Sets index of first visible slide |
| isInfinity                        | ❌       |  true                              |    boolean                                  | Define should carousel be infinity or not |
| dotStyles                         | ❌       |  undefined                         |    ViewStyle                                | Your custom styles for dots |
| dotsContainerStyles               | ❌       |  undefined                         |    ViewStyle                                | Your custom styles for dots container |
| imageProps                        | ❌       |  {}                                |    Omit<ImageProps, 'source'>               | Image props for slide images, like resizeMode, etc... |
| imageStyles                       | ❌       |  undefined                         |    ImageStyle                               | Your custom styles for slide images  |
| slideStyles                       | ❌       |  undefined                         |    Omit<ViewStyle, 'width'>                 | Your custom styles for slides  |
| customSlides                      | ❌       |  undefined                         |   (slideStyles: any[]) => JSX.Element       | Replace developed slides by your own implementation |
| customSlideAnimation              | ❌       |  undefined                         |    customSlideAnimation?: (hiddenIndexScrolling: undefined \| number,i: number,interpolate: (slideItemIndex: number,minValue: number \| string,maxValue: number \| string) => any) => any                                                                                                         | Custom animations fro slides |
| customDots                        | ❌       |            undefined               |   (dotsStyles: any[]) => JSX.Element        | Replace developed dots pagination by your own implementation |
| customDotsAnimation               | ❌       |            undefined               |   customDotsAnimation?: (i: number,interpolate: (slideItemIndex: number,minValue: number \| string,maxValue: number \| string) => any) => any | Custom animations fro slides  |


## Ref

| name                              | required | default                            | types                | descriptions |
|:----------------------------------|:---------|:----------- |:---------------------------------------------:| ------------:|
| getCarouselRef                    | ❌       |  undefined  | (ref:  {stopAutoPlay: () => void,tryStartAutoPlay: () => void, scrollToIndex: (index: number) => void}) => void                                                                                                         | Return CarouselRef for easing handing autoplay and scrolling   |
| getScrollViewRef                  | ❌       |  undefined  | (ref: React.RefObject<ScrollView>) => void  | Return ScrollView ref  |

## Props

Animations
You can use already implemented animations or create own. There are two way to create your custom animations

1. customDotsAnimation or customSlideAnimation provides you `index` and `interpolate` function. You need just add to interpolate `index`, `minValue` and `maxValue`. This useful for common cases, this animation depends on current selected slide

```sh
      customDotsAnimation={(index, interpolate) => ({
        transform: [{ translateY: interpolate(index, 0, -20) }],
      })}
```

2. Sometimes you may want to add specific animation, for this case nativeEvent for getting current offset and use interpolate on it. For more details see [DotsAdvancedAnimation](/example/src/DotsAdvancedAnimation.tsx) or [CustomSlides](/example/src/CustomSlides.tsx)


```js
import React from 'react'
import { Carousel,  NativeScrollEvent, NativeSyntheticEvent } from 'react-native-carousel-infinity'

const Component = () => {
  const myAnim = useRef(new Animated.Value(0)).current

  const _onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const value = nativeEvent.contentOffset.x
    myAnim.setValue(value)
  }

  const renderCustomDots = (dots: any[]) => {
    return (
      <Animated.View
        style={[
          {
            transform: [
              {
                translateX: myAnim.interpolate({
                  inputRange: [900, 960, 1440, 1500],
                  outputRange: [-107.5, 0, 140, 252.5],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      />
    )
  }

  return <Carousel onScroll={_onScroll} customDots={renderCustomDots} />
}

```

## Examples

### Animation SLIDE_ANIMATION_TYPE.MOVE_UP ANDROID

https://user-images.githubusercontent.com/43185533/188471805-20e36d5e-bbfb-46d9-93a5-5c9228407c52.mov

### Animation SLIDE_ANIMATION_TYPE.MOVE_UP IOS

https://user-images.githubusercontent.com/43185533/188471937-04c54309-8579-40e6-990f-1ac5a761e816.mov




### Animation SLIDE_ANIMATION_TYPE.SCALE ANDROID

https://user-images.githubusercontent.com/43185533/188471896-d1e0777a-7dfd-48da-adf0-12a13fa3e0cf.mov

### Animation SLIDE_ANIMATION_TYPE.SCALE IOS

https://user-images.githubusercontent.com/43185533/188471982-66a528cb-da2f-41fe-9ccd-ef94a3624b4c.mov




### Animation SLIDE_ANIMATION_TYPE.ROLLING ANDROID

https://user-images.githubusercontent.com/43185533/188472323-05ce9eaa-a519-4ee9-bf7a-614023e81fc9.mov

### Animation SLIDE_ANIMATION_TYPE.ROLLING IOS

https://user-images.githubusercontent.com/43185533/188472374-7119aa18-7dc8-4f31-81ac-48bef1628f14.mov




### Animation SLIDE_ANIMATION_TYPE.SQUEEZE_ANDROID ANDROID

https://user-images.githubusercontent.com/43185533/188472459-ae2edc88-f1f0-40af-9962-6917b6ebf2c6.mov

### Animation SLIDE_ANIMATION_TYPE.SQUEEZE_MOVE_UP_IOS IOS

https://user-images.githubusercontent.com/43185533/188472518-d1cdee73-a508-4e3a-801b-7e0205608049.mov


## License
MIT

