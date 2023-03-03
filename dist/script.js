// import  { questions } from 'https://assets.codepen.io/3351103/questions.js'
import { shuffle, getRandomSelection } from 'https://assets.codepen.io/3351103/quiz-helpers.js'
import templates from 'https://assets.codepen.io/3351103/quiz-template.js'


const quiz = (function (doc) {

  // Creates new quiz properties
  const getQuizProps = (questions, num = 5) => ({
    numCorrect: 0,
    count: 0,
    questions: getRandomSelection(questions, num)
  })

  const startQuiz = ((optionHandler) => {

    const quizContainer = doc.querySelector('#quiz')
    const multiChoice = quizContainer.querySelector('.multiple-choice')

    return function quizHandler ({ target, type }) {

      if (type === 'click' && !target.matches('button')) return

      // Remove previous handler
      if (optionHandler) {
        multiChoice.removeEventListener('click', optionHandler)
      }

      const newQuiz = getQuizProps(questions, 10)

      // add new handler bundled with new quiz properties in a closure
      optionHandler = getOptionHandler(newQuiz)
      multiChoice.addEventListener('click', optionHandler)

      // display first question
      displayQuestion(newQuiz.questions[0])

      quizContainer.classList.add('intro-hidden')
    }
  })()

  /* Returns handler bundled with new quiz properties */

  const getOptionHandler = function ({ count, numCorrect, questions }) {

    return function optionHandler ({ target }) {

      if (!target.matches('button')) return

      if (questions[count].answer === target.textContent) numCorrect++

      // display next question
      if (count < questions.length - 1) {
        return displayQuestion(questions[++count])
      }

      displayResult(numCorrect, questions.length)
    }
  }

  /* --- Display Intro --- */

  const displayIntro = function () {
    const quizContainer = doc.querySelector('.quiz-container')
    const intro = quizContainer.querySelector('.intro')

    intro.innerHTML = templates.intro()
    quizContainer.classList.remove('intro-hidden')
  }

  /* --- Display Question and Multiple Choice --- */

  const displayQuestion = function ({ question, choices }) {
    const questionElem = doc.querySelector('.question')
    const multipleChoice = doc.querySelector('.multiple-choice')

    questionElem.innerHTML = question
    multipleChoice.innerHTML = templates.options(shuffle(choices))
  }

  /* --- Display Results --- */

  const remarks = ['Nevermind, try Again!', 'Pretty Good!', 'Very Good!', 'Top Notch!']

  const displayResult = function (numCorrect, numQuestions) {

    const quizContainer = doc.querySelector('.quiz-container')
    const conclusion = quizContainer.querySelector('.conclusion')
    const index = Math.floor(numCorrect / numQuestions * 3)

    conclusion.innerHTML = templates.conclusion({
      remark: remarks[index],
      score: `${numCorrect} out of ${numQuestions} Correct`
    })

    quizContainer.classList.remove('intro-hidden')
  }

  return { displayIntro, start: startQuiz }
}(window.document))


window.addEventListener('DOMContentLoaded', (event) => {
  const startButton = document.querySelector('.intro')

  startButton.addEventListener('click', quiz.start)
  quiz.displayIntro()
})