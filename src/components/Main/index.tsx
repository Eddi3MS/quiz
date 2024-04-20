// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { onValue, ref } from 'firebase/database'
import { getDownloadURL, ref as storageRef } from 'firebase/storage'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { database, storage } from '../../config/firebase'
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

const Main = () => {
  const { setVolume, volume } = useContext(QuizContext)
  const { id } = useParams()
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [quiz, setQuiz] = useState(null)
  const [time, setTime] = useState(0)

  const addCount = () => setCount(count + 1)

  useEffect(() => {
    const starCountRef = ref(database, `quiz/${id}`)

    onValue(starCountRef, async (snapshot) => {
      try {
        const data = snapshot.val()

        if (!data) {
          throw new Error('Quiz não encontrado.')
        }
        const { quizItems, id } = data
        const cache = JSON.parse(
          window.localStorage.getItem('imageCache') || `{}`
        )
        let cardUrl = ''

        if (cache[`${id}_cover`]) {
          cardUrl = cache[`${id}_cover`]
        } else {
          const cardRef = await storageRef(
            storage,
            `gs://${import.meta.env.VITE_STORAGE_BUCKET}/cover/${id}_cover`
          )
          cardUrl = await getDownloadURL(cardRef)

          cache[`${id}_cover`] = cardUrl
        }

        const mappedQuiz = await quizItems?.map(
          async ({ name, variations, audioId, imageId }) => {
            let imageUrl = ''
            let audioUrl = ''

            if (cache[imageId]) {
              imageUrl = cache[imageId]
            } else {
              const imageRef = await storageRef(
                storage,
                `gs://${import.meta.env.VITE_STORAGE_BUCKET}/${imageId}`
              )
              imageUrl = await getDownloadURL(imageRef)

              cache[imageId] = imageUrl
            }

            if (cache[audioId]) {
              audioUrl = cache[audioId]
            } else {
              const audioRef = await storageRef(
                storage,
                `gs://${import.meta.env.VITE_STORAGE_BUCKET}/${audioId}`
              )
              audioUrl = await getDownloadURL(audioRef)

              cache[audioId] = audioUrl
            }

            window.localStorage.setItem('imageCache', JSON.stringify(cache))

            return {
              name,
              variations,
              imageUrl,
              audioUrl,
            }
          }
        )

        const resolvedQuizPromise = await Promise.all(mappedQuiz).then((e) => e)

        setQuiz({
          ...data,
          cardBackground: cardUrl,
          quizItems: resolvedQuizPromise,
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

