const {Predicate, sub, S} = require('english-io')
const FolieSound = require('../sound/FolieSound')

const RollACigarette = new Predicate({
  forms: [
    {verb: 'roll a cigarette'},
  ],

  prepare(mihai, sentence) {
    let rizla = mihai.findNearest('a rizla')
    let tobacco = mihai.findNearest('the tobacco')
    let filter = mihai.findNearest('a filter')

    sentence.rizla = rizla
    sentence.tobacco = tobacco
    sentence.filter = filter

    if(rizla && tobacco && filter)
      return [
        S('PickUp', mihai, rizla),
        S('PickUp', mihai, tobacco),
        S('PickUp', mihai, filter),
      ]
  },

  problem(mihai, sentence) {
    if(!sentence.rizla)
      return sub('_ could not find a rizla', mihai)
    if(!sentence.tobacco)
      return sub('_ could not find tobacco', mihai)
    if(!sentence.filter)
      return sub('_ could not find a filter', mihai)
  },

  until: callback => callback(),

  afterwards(mihai, sentence) {

    let cigarette = this.dictionary.createEntity()
    cigarette.be_a('cigarette')

    sentence.rizla.setLocation(cigarette, 'consist')
    sentence.tobacco.setLocation(cigarette, 'consist')
    sentence.filter.setLocation(cigarette, 'consist')

    sentence.cigarette = cigarette

    return S('Hold', cigarette, mihai)
  },
})
module.exports.RollACigarette = RollACigarette

const BeOnFire = new Predicate({
  forms:[
    {verb:'be on fire'}
  ],

  begin(burner) {
    let sound = new FolieSound('fire', true)
    sound.entitySource = burner
    sound.start()
  }
})
module.exports.BeOnFire = BeOnFire

const SetOnFire = new Predicate({
  forms:[
    {verb:'set', params:['subject', 'object'], constants:{on:'fire'}},
    {verb:'light', params:['subject', 'object']}
  ],

  prepare(fireStarter, fireStartee, s) {
    s.lighter = fireStarter.findNearest('a source of fire')
    if(s.lighter)
      return [
        S('PickUp', fireStarter, s.lighter),
        S('Approach', fireStarter, fireStartee)
      ]
  },

  problem(fireStarter, fireStartee, s) {
    if(!s.lighter)
      return sub('_ cannot find a lighter', fireStartee)
  },

  until(callback, fireStarte, fireStartee, {lighter}) {
    if(lighter.is_a('cigarette lighter')) {
      let sound = new FolieSound('lighter')
      sound.once('end', () => callback())
      sound.entitySource = lighter
      sound.start()
    } else {
      console.warn('Unhandled fire soure:', lighter.str())
      callback()
    }
  },

  afterwards(fireStarter, fireStartee) {
    return S('BeOnFire', fireStartee)
  },
})
module.exports.SetOnFire = SetOnFire

const SmokeACigarette = new Predicate({
  forms: [
    {verb:'smoke a cigarette'},
    {verb:'smoke'}
  ],

  prepare(mihai, s) {
    return [
      S('RollACigarette', mihai),
      S('LightACigarette', mihai)
    ]
  },
})
module.exports.SmokeACigarette = SmokeACigarette

const LightACigarette = new Predicate({
  forms: [
    {verb:'light a cigarette'},
  ],

  prepare(mihai, s) {
    let cigarette = mihai.findNearest('a cigarette')
    s.cig = cigarette
    return S('PickUp', mihai, cigarette)
  },

  problem(mihai, s) {
    if(!s.cig) {
      return sub('there is no cigarette')
    }
  },

  expand(mihai, s) {
    return S('Light', mihai, s.cig)
  },

  banal: true,
})
module.exports.LightACigarette = LightACigarette
