const CHANGE_NAME = 'CHANGE_NAME'

const reducer = (state = 'Peter', action) => {
  if (action.type === 'CHANGE_NAME') {
    return action.payload
  }

  return state
}

export const changeName = payload => ({
  type: CHANGE_NAME,
  payload
})

export default reducer
