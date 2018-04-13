const inquirer = require('inquirer')
const Rx = require('rxjs')

inquirer.prompt([
  {
    type: 'list',
    name: 'type',
    message: '你来猜还是我来猜？',
    choices: [
      {
        name: '你来猜吧！',
        value: 'AI'
      },
      {
        name: '还是我吧！',
        value: 'Player'
      }
    ]
  },
  {
    type: 'list',
    name: 'mode',
    message: '我们来玩什么模式的游戏？',
    choices: [
      {
        name: '简单',
        value: 'easy'
      },
      {
        name: '困难',
        value: 'hard'
      }
    ],
    when (answer) {
      return answer.type === 'Player'
    }
  },
  {
    type: 'confirm',
    name: 'ready',
    message: '准备好了吗？'
  }
]).then(answers => {
  let { type, mode, ready } = answers
  if (ready) {
    if (type === 'Player') {
      let answer = generate(mode)
      question(answer)
    } else if (type === 'AI') {
      console.log('真抱歉，我还没学会怎么猜呢！');
    }
  } else {
    console.log('那就等你准备好了再来找我吧！');
  }
});

function generate (mode) {
  let output = ''
  let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  for (let i = 0; i < 4; i++) {
    if (mode === 'easy') {
      let index = Math.floor(Math.random() * nums.length)
      output += nums.splice(index, 1).toString()
    } else {
      let num = Math.floor(Math.random() * 10)
      output += num.toString()
    }
  }
  return output
}

function question (answer) {
  let round = 1
  let prompts = new Rx.Subject()
  inquirer.prompt(prompts).ui.process.subscribe(
    reply => {
      if (answer !== reply.answer) {
        let aSkip = []
        let rSkip = []
        let [A, B] = [0, 0]
        for (let i = 0; i < answer.length; i++) {
          if (answer[i] == reply.answer[i]) {
            aSkip.push(i)
            rSkip.push(i)
            A++
          }
        }
        for (let i = 0; i < answer.length; i++) {
          if (!aSkip.includes(i)) {
            let nums = reply.answer.split('')
            nums.forEach((num, x) => {
              if (num == answer[i] && !rSkip.includes(x)) {
                rSkip.push(x)
                B++
              }
            })
          }
        }
        console.log(reply.name, `${A}A${B}B`)
        prompts.next({
          type: 'input',
          name: `第${round++}回合`,
          message: '请输入你猜测的数字！',
          validate: value => {
            if (/^\d{4}$/.test(value)) {
              return true
            } else {
              return '拜托！请输入数字好么？'
            }
          }
        })
      } else {
        console.log(`恭喜你在${reply.name}回答正确了！`)
        prompts.complete()
      }
    },
    error => { },
    () => { }
  )
  prompts.next({
    type: 'input',
    name: `第${round++}回合`,
    message: '请输入你猜测的数字！',
    validate: value => {
      if (/^\d{4}$/.test(value)) {
        return true
      } else {
        return '拜托！请输入4位数字好么？'
      }
    }
  })
}

function guess () {
  let round = 1
  let member = {
    '0': {
      skip: new Set()
    },
    '1': {
      skip: new Set()
    },
    '2': {
      skip: new Set()
    },
    '3': {
      skip: new Set()
    },
    '4': {
      skip: new Set()
    },
    '5': {
      skip: new Set()
    },
    '6': {
      skip: new Set()
    },
    '7': {
      skip: new Set()
    },
    '8': {
      skip: new Set()
    },
    '9': {
      skip: new Set()
    }
  }
  let suspects = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let results = [{ answer: '1234' }]
  let prompts = new Rx.Subject()
  inquirer.prompt(prompts).ui.process.subscribe(
    reply => {
      let { name, answer } = reply
      let validate = answer.match(/(\d)A(\d)B/)
      results[round - 1].A = validate[1]
      results[round - 1].B = validate[2]
      if (answer === '4A0B') {
        console.log('ok')
        prompts.complete()
      } else if (answer === '0A0B') {
        for (num of results[round - 1].answer) {
          member[num].out = true
        }
      } else if (validate[1] == 0 && validate[2] > 0) {
        for (let i = 0; i < results[round - 1].answer.length; i++) {
          member[results[round - 1].answer[i]].skip.add(i)
        }
      } else if (reply.answer === '0A2B') {

      } else if (reply.answer === '0A3B') {

      } else if (reply.answer === '0A4B') {

      } else if (reply.answer === '1A3B') {

      } else if (reply.answer === '2A2B') {

      } else if (reply.answer === '3A0B') {

      } else if (reply.answer === '2A1B') {

      } else if (reply.answer === '2A0B') {

      } else if (reply.answer === '1A2B') {

      } else if (reply.answer === '1A1B') {

      } else if (reply.answer === '1A0B') {

      }
    },
    error => { },
    () => { }
  )
  prompts.next({
    type: 'input',
    name: `第${round++}回合`,
    message: '是1234吗？',
    validate: value => {
      if (/^[0-4]A[0-4]B$/.test(value)) {
        return true
      } else {
        return '拜托！请给我正常的（?A?B）反馈好么？'
      }
    }
  })
}
