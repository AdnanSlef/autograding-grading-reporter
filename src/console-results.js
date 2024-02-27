const {COLORS} = require('./colors')
const {AggregateResults} = require('./aggregate-results')
const {getTestScore, getMaxScoreForTest} = require('./helpers/test-helpers')

exports.ConsoleResults = function ConsoleResults(runnerResults) {
  try {
    let grandTotalPassedTests = 0
    let grandTotalTests = 0

    runnerResults.forEach(({runner, results}, index) => {
      // Fun transition to new runner
      const maxScore = getMaxScoreForTest(results)
      // const weight = getTestWeight(maxScore, totalMaxScore);
      const score = getTestScore(results)
      if (index > 0) {
        console.log(`${COLORS.magenta}🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀${COLORS.reset}\n`)
      }

      console.log(`🔄 Processing: ${runner}`)
      console.log(results)
      let passedTests = 0
      const totalTests = results.tests.length

      results.tests.forEach((test) => {
        if (test.status === 'pass') {
          console.log(`${COLORS.green}✅ ${test.name}${COLORS.reset}`)
          passedTests += 1
        } else if (test.status === 'error') {
          console.log(`Error: ${test.message || `Failed to run test '${test.name}'`}\n${COLORS.reset}`)
        } else {
          console.log(`${COLORS.red}❌ ${test.name}\n`)
          console.log(`${test.message || ''}\n${COLORS.reset}`)
        }
        if (test.test_code) {
          console.log(`Test code: ${test.test_code}\n`)
        }
      })

      // Update grand totals
      grandTotalPassedTests += passedTests
      grandTotalTests += totalTests

      // Calculate and display points for the current runner
      if (maxScore !== 0) {
        console.log(`Total points for ${runner}: ${score.toFixed(2)}/${maxScore}\n`);
      }
    })

    console.log(`${COLORS.magenta}Test runner summary${COLORS.magenta}`)

    // Calculate and display grand total points
    AggregateResults(runnerResults)
    console.log(
      `${COLORS.cyan}🏆 Grand total tests passed: ${grandTotalPassedTests}/${grandTotalTests}${COLORS.reset}\n`,
    )
  } catch (error) {
    throw new Error(error.message)
  }
}
