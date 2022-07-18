const SORT = "score"

const data = window.data.sort((d1, d2) => {
  return d1[SORT] - d2[SORT];
})

console.log(data);
function getStats(data) {
  const avg = data.reduce((acc, cur) => {
    return acc + cur;
  }) / data.length;

  const max = data.reduce((acc, cur) => {
    return Math.max(acc, cur);
  });
  const min = data.reduce((acc, cur) => { return Math.min(acc, cur); });
  const median = data.sort((d1, d2) => {
    return d1 - d2
  })[Math.floor(data.length / 2)]
  return {avg, max, min, median};
}

const scores = getStats(data.map(d => d.score));
const kids = getStats(data.map(d => d.numKids));

$(document).ready(() => {
  $('body').append(`<table id="stats"></table>`);
  $('#stats').append(`
    <tr>
      <th>Stat</th>
      <th>min</th>
      <th>max</th>
      <th>avg</th>
      <th>median</th>
    <tr>
  `);
  $('#stats').append(`
    <tr>
      <th>Score</th>
      <td>${scores.min}</td>
      <td>${scores.max}</td>
      <td>${scores.avg}</td>
      <td>${scores.median}</td>
    </tr>
    `);
  $('#stats').append(`
    <tr>
      <th>Kids</th>
      <td>${kids.min}</td>
      <td>${kids.max}</td>
      <td>${kids.avg}</td>
      <td>${kids.median}</td>
    </tr>
    `);

  $('body').append(`<table id="data-table"></table>`);

  $('#data-table').append(`
  <tr>
    <th>Date</th>
    <th>Score</th>
    <th>Kids</th>
    <th>Text</th>
  </tr>
  `);
  window.data.forEach(datum => {
    $('#data-table').append(`
      <tr>
        <td>${datum.id}</td>
        <td>${new Date(datum.time * 1000).toString().replace(/ GMT.*$/, '')}</td>
        <td>${datum.score}</td>
        <td>${datum.numKids}</td>
        <td>${datum.text}</td>
      </tr>
    `);
  })
});
