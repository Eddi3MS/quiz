// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { onValue, ref } from 'firebase/database'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { database } from '../../config/firebase'
import ItemGuess from '../ItemGuess'
import Loader from '../Loader'
import { QuizContext } from '../context/QuizContext'
import {
  Container,
  Count,
  Description,
  Grid,
  InputRange,
  Main as MainWrapper,
  Title,
} from './styles'
import { assetsUrl } from '../../utils/assetsUrl'

const Main = () => {
  const { setVolume, volume } = useContext(QuizContext)
  const { id } = useParams()
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [quiz, setQuiz] = useState(null)
  const [time, setTime] = useState(0)

  const addCount = () => setCount(count + 1)

  useEffect(() => {
    if (!id) return
    const starCountRef = ref(database, `quiz/${id}`)

    onValue(starCountRef, async (snapshot) => {
      try {
        const data = snapshot.val()

        if (!data) {
          throw new Error('Quiz não encontrado.')
        }

        const { quizItems, id } = data

        const cardUrl = assetsUrl(`cover/${id}_cover`)

        setQuiz({
          ...data,
          cardBackground: cardUrl,
          quizItems: quizItems?.map(({ audioId, imageId, ...rest }) => ({
            ...rest,
            imageUrl: assetsUrl(`${imageId}`),
            audioUrl: assetsUrl(`${audioId}`),
          })),
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    })
  }, [id])

  useEffect(() => {
    if (count === quiz?.quizItems?.length) return
    setTimeout(() => {
      setTime(time + 100)
    }, 1000)
  }, [time, count, quiz?.quizItems?.length])

  const minutes = Math.floor((time % 360000) / 6000)
  const seconds = Math.floor((time % 6000) / 100)

  if (loading) {
    return (
      <MainWrapper>
        <Grid>
          <Loader />
        </Grid>
      </MainWrapper>
    )
  }

  if (!quiz || !quiz?.quizItems) {
    return (
      <MainWrapper>
        <Grid>
          <p>Nenhum quiz encontrado.</p>
        </Grid>
      </MainWrapper>
    )
  }

  return (
    <MainWrapper>
      <Grid>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Container>
              <Count>
                {count}/{quiz.quizItems.length}
              </Count>
              <Title>{quiz.quizName}</Title>
              <Description>
                {quiz.quizDescription} por: {quiz.author}
              </Description>
              <Count>
                {minutes.toString().padStart(2, '0')}:
                {seconds.toString().padStart(2, '0')}
              </Count>
            </Container>
            {quiz?.quizItems.map((item, i) => {
              return (
                <ItemGuess
                  addCount={addCount}
                  cardBackground={quiz.cardBackground}
                  quizItem={item}
                  key={i}
                />
              )
            })}
            <InputRange
              onChange={({ target: { value } }) => setVolume(parseInt(value))}
              value={volume}
              min={0}
              max={100}
              type="range"
            />
          </>
        )}
      </Grid>
    </MainWrapper>
  )
}

export default Main

