import type { Word } from '@/typings'

interface Response {
  word: string
  last_seen: string
  count: number
  id: number
  action_type: string
  user_id: string
}

export async function fetchWords(url: string, isListeningPractice = false): Promise<Word[]> {
  const response = await fetch('https://listenhappy.xyz/user/words', {
    headers: {
      accept: 'application/json',
      'X-API-Key':
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1heWJlX3h1ZSIsImV4cCI6MTcyODU2MDE0OSwidG9rZW5fbGltaXQiOjEwMDB9.iGdcpQvXS9RPh0wXKvMG5TWpR5QwZbFrL7fEGwDVX8o',
      is_listening_practice: isListeningPractice,
    },
  })
  const data = await response.json()
  const words: Word[] = data.words.map((word: Response) => ({
    name: word.word,
    trans: '',
  }))
  return words
}

export async function wordListFetcher(url: string): Promise<Word[]> {
  const URL_PREFIX: string = REACT_APP_DEPLOY_ENV === 'pages' ? '/qwerty-learner' : ''
  console.log(url)
  if (url === '/dicts/custom.json') {
    return fetchWords(url, true)
  }
  const response = await fetch(URL_PREFIX + url)
  const words: Word[] = await response.json()
  return words
}
