import moment from "moment"

export default function getRange(startDate, endDate, type) {
  let fromDate = moment(startDate)
  let toDate = moment(endDate)
  let diff = toDate.diff(fromDate, type)
  let range = []
  for (let i = 0; i <= diff; i++) {
    range.push(moment(startDate).add(i, type))
  }
  return range
}

export function getDaysInCurrentWeek() {
  const startDate = moment().startOf("isoWeek")
  const endDate = moment().endOf("isoWeek")
  const daysInCurrentWeek = getRange(startDate, endDate, "days")
  return daysInCurrentWeek.map((day) => {
    return { dayOfTheWeek: day._d.toString().substring(0, 3), dayOfTheMonth: day.format("D/M") }
  })
}
