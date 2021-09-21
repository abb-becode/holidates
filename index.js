#!/usr/bin/env node

const axios = require('axios')
const country = require('country-list')
const chalk = require('chalk')
const figlet = require('figlet')
// const ora = require('ora')
const chalkAnimation = require('chalk-animation')
const prompts = require('prompts')
const clear = require('clear')
const uri = 'https://date.nager.at/api/v3/publicholidays/'

const questions = [
  {
    type: 'text',
    name: 'chosenCountry',
    message: 'Choose a country ? '
  },
  {
    type: 'number',
    name: 'chosenYear',
    message: 'Choose a year ? '

  }
]

/*
let params = {
  country: '',
  year: '',
  countryCode: ''
}

let setParams = (res) => {
  // const res = await prompts(questions)
  params.country = res.chosenCountry
  params.year = res.chosenYear

  if (params.year === '') {
    params.year = new Date().getFullYear() // take current year if year is empty
  }

  params.countryCode = country.getCode(params.country) // get country code
}
*/

let getHolidates = async () => {
  const res = await prompts(questions)
  let _country = res.chosenCountry
  let _year = res.chosenYear

  if (_year === '') {
    _year = new Date().getFullYear() // take current year if year is empty
  }

  let countryCode = country.getCode(_country) // get country code

  try {
    const result = await axios.get(`${uri}${_year}/${countryCode}`)
    console.log(chalk.white(figlet.textSync('Holidays', {
      font: 'Standard',
      horizontalLayout: 'fitted',
      verticalLayout: 'default'
    })))

    let holidays = Array.from(result.data) // get the result like an array.

    const rainbow = chalkAnimation.rainbow(`This is a list of holidays in ${_country}, ${_year} :`).stop() // Don't start the animation

    rainbow.render() // Display the first frame

    const frame = rainbow.frame() // Get the second frame
    console.log(frame)

    holidays.forEach(el => {
      console.log(`${el.date} : ${el.name}.`)
    })
  } catch (err) {
    console.log(chalk.bgRed('Incorrect values. Please try again : '))
    getHolidates()
  }
}

clear()
getHolidates()
