import type { NextPage } from 'next'
import clamp from 'lodash-es/clamp'
import swap from 'lodash-move'
import { useGesture } from 'react-with-gesture'
import { useSprings, animated, interpolate } from 'react-spring'
import { useRef } from 'react'
import styles from './style.module.css'

// https://codesandbox.io/embed/01p1kxymow

const fn = (order: number[], down = false, originalIndex = 0, curIndex = 0, y = 0) => (index: number) =>
  down && index === originalIndex
    ? {
        y: curIndex * 100 + y,
        scale: 1.1,
        zIndex: '1',
        shadow: 15,
        immediate: (n: string) => n === 'y' || n === 'zIndex'
      }
    : {
        y: order.indexOf(index) * 100,
        scale: 1,
        zIndex: '0',
        shadow: 1,
        immediate: false
      }

type Props = {
  items: string[];
}

const DraggableList = ({ items }: Props) => {
  const order = useRef(items.map((_, index) => index)) // Store indices as a local ref, this represents the item order
  // @ts-ignore
  const [springs, setSprings] = useSprings(items.length, fn(order.current))
  const bind = useGesture(({ args: [originalIndex], down, delta: [, y] }) => {
    const curIndex = order.current.indexOf(originalIndex)
    const curRow = clamp(Math.round((curIndex * 100 + y) / 100), 0, items.length - 1)
    const newOrder = swap(order.current, curIndex, curRow)
    setSprings(fn(newOrder, down, originalIndex, curIndex, y))
    if (!down) order.current = newOrder
  })

  return (
    <div className={styles.content} style={{ height: items.length * 100 }}>
      {springs.map(({ zIndex, shadow, y, scale }, i) => (
        <animated.div
          {...bind(i)}
          key={i}
          style={{
            zIndex,
            boxShadow: shadow.to(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
            transform: interpolate([y, scale], (y, s) => `translate3d(0,${y}px,0) scale(${s})`)
          }}
        >{items[i]}</animated.div>
      ))}
    </div>
  )
}

const AnimationSample: NextPage = () => {
  return (
    <>
      <div>AnimationSample</div>
      <p>参考url</p>
      <a href="https://codesandbox.io/embed/01p1kxymow" target="_blank" rel="noreferrer">https://codesandbox.io/embed/01p1kxymow</a>
      <DraggableList items={'Lorem ipsum dolor sit'.split(' ')} />
    </>
  )
}

export default AnimationSample;
