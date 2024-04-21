// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { onValue, orderByValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import { database } from '../../config/firebase'
import { assetsUrl } from '../../utils/assetsUrl'
import ItemQuiz from '../ItemQuiz'
import Loader from '../Loader'
import { Grid, MainWrapper } from './styles'

const QuizList = () => {
  const [loading, setLoading] = useState(true)
  const [quizList, setQuizList] = useState([])

  useEffect(() => {
    const quizRef = ref(database, `quiz`, orderByValue('createdAt'))

    onValue(quizRef, async (snapshot) => {
      try {
        const data = snapshot.val()

        if (!data) {
          throw new Error('Nenhum quiz cadastrado')
        }

        const list = Object.keys(data).map((quizId) => {
          const cardBackground = assetsUrl(`cover/${quizId}_cover`)

          return {
            ...data[quizId],
            cardBackground,
          }
        })

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

