type InitialList = {
  id: string
  image: any
}[]

export const generateFakeItems = (initialList: InitialList, count: number) => {
  let newList = [...initialList]
  let listToReverseForFakeStart = [...initialList]
  listToReverseForFakeStart.reverse()
  let fakeStart = []
  let fakeEnd = []
  const newItem = (listIndex: number, list: InitialList, loopIndex: number, side: string) => ({
    ...list[listIndex],
    id: `${list[listIndex]!.id}-fake-${side}-${loopIndex}`,
  })

  for (let i = 0; i < count; i++) {
    const rest = i % initialList.length
    let index = i < initialList.length ? i : rest

    const newItemEnd = newItem(index, initialList, i, 'end')
    const newItemStart = newItem(index, listToReverseForFakeStart, i, 'start')
    fakeStart.unshift(newItemStart)
    fakeEnd.push(newItemEnd)
  }

  return [...fakeStart, ...newList, ...fakeEnd] as InitialList
}
