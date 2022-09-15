import fetch from "node-fetch"

export const checkForProfanity = async (text) => {
  const response = await fetch(`https://www.purgomalum.com/service/containsprofanity?text=${text}`)

  const data = await response.json()

  return data
}
