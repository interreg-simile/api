'use strict'

function getMongoSortFromQuerySort(querySort) {
  return querySort.split(',').reduce((acc, sort) => {
    const sortElements = sort.split(':')

    return {
      ...acc,
      [sortElements[0]]: (!sortElements[1] || sortElements[1] === 'asc') ? 1 : -1,
    }
  }, {})
}

module.exports = { getMongoSortFromQuerySort }
