// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

const BASE_API_URL = "https://jservice.io/api/";
const cate = 6;
const cluesOfcate = 5;

let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

 async function getCategoryIds() {
  
  let response = await axios.get(`https://jservice.io/api/categories?count=100`);
  let catIds = response.data.map(result => {
         return  result.id
  } );
  return _.sampleSize(catIds, cate);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

 async function getCategory(catId) {
  let response = await axios.get(`${BASE_API_URL}category?id=${catId}`);
  let catData = response.data;
  let allClues = catData.clues;
  let random = _.sampleSize(allClues, cluesOfcate);
  let clues = random.map(result => ({
    question: result.question,
    answer: result.answer,
    show: null,
  }));

  return { title: catData.title, clues };
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
   // Add row with headers for categories
   $("#jeo-thead").empty();
   let $tr = $("<tr>");
   for (let i = 0; i < cate; i++) {
     $tr.append($("<th>").text(categories[i].title));
   }
   $("#jeo-thead").append($tr);
 
   // Add rows with questions for each category
   $("#jeo-tbody").empty();
   for (let y = 0; y < cluesOfcate; y++) {
     let $tr = $("<tr>");
     for (let i = 0; i < cate; i++) {
       $tr.append($("<td>").attr("id", `${i}-${y}`).text("?"));
     }
     $("#jeo-tbody").append($tr);
   }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
  let id = evt.target.id;

  let [catId, clueId] = id.split("-");

  let clue = categories[catId].clues[clueId];

  let msg;

  if (!clue.show) {
    msg = clue.question;
    clue.show = "question";
  } else if (clue.show === "question") {
    msg = clue.answer;
    clue.show = "answer";
  } else {
    return
  }

  // Update text of cell
  $(`#${catId}-${clueId}`).html(msg);
}


$(async function () {
  setupAndStart();
  $("#jeopardy").on("click", "td", handleClick);
}
);
/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

  const $spinner = $("#spinner");
  $spinner.addClass ("show");
  
  setTimeout(() => {
    
    hideLoadingView();
  }, 3000);
  $("#jeopardy").hide();
}



/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
  $('.show').addClass('').removeClass('show');
  setupAndStart();
  $("#jeopardy").show()
}


/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */


async function setupAndStart() {
  
  let catIds = await getCategoryIds();

  categories = [];

  for (let id of catIds) {

    categories.push(await getCategory(id));
  }
  
  fillTable();
}

/** On click of restart button, restart game. */

$(".btn-group").on("click", showLoadingView)




/** On page load, setup and start & add event handler for clicking clues */




/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO