// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useEffect, useState } from 'react'
import { ref, onValue, orderByValue } from 'firebase/database'
import { ref as storageRef, getDownloadURL } from 'firebase/storage'
import { Grid, MainWrapper } from './styles'
import ItemQuiz from '../ItemQuiz'
import Loader from '../Loader'
import { database, storage } from '../../config/firebase'

const QuizList = () => {
  const [loading, setLoading] = useState(true)
  const [quizList, setQuizList] = useState([])

  useEffect(() => {
    const quizRef = ref(database, `quiz`, orderByValue('createdAt'))

    console.log(quizRef)

    onValue(quizRef, async (snapshot) => {
      try {
        const data = snapshot.val()

        const dataArray = Object.keys(data).map(async (key) => {
          const cache = JSON.parse(
            window.localStorage.getItem('imageCache') || `{}`
          )

          if (cache[`${data[key].id}_cover`])
            return {
              ...data[key],
              cardBackground: cache[`${data[key].id}_cover`],
            }

          const cardRef = storageRef(
            storage,
            `gs://${import.meta.env.VITE_STORAGE_BUCKET}/cover/${
              data[key].id
            }_cover`
          )
          const cardUrl = await getDownloadURL(cardRef)

          cache[`${data[key].id}_cover`] = cardUrl
          window.localStorage.setItem('imageCache', JSON.stringify(cache))

          return {
            ...data[key],
            cardBackground: cardUrl,
          }
        })

        const list = await Promise.all(dataArray)

        setQuizList(
          list.sort(
            ({ createdAt: a }, { createdAt: b }) => (b || 20) - (a || 20)
          )
        )
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    })
  }, [])
  console.log(quizList)

  return (
    <MainWrapper>
      <Grid>
        {loading ? (
          <Loader />
        ) : (
          quizList.map((item) => <ItemQuiz quiz={item} key={item.id} />)
        )}
      </Grid>
    </MainWrapper>
  )
}
export default QuizList

